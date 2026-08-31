import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'

let s3ClientInstance: S3Client | null = null

export function resetStorageClient(): void {
  s3ClientInstance = null
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME
  )
}

function getR2Client(): S3Client {
  if (!s3ClientInstance) {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID!
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!

    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }
  return s3ClientInstance
}

export function getR2PublicUrl(key: string): string {
  const publicUrlBase = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL
  if (publicUrlBase) {
    const cleanBase = publicUrlBase.replace(/\/$/, '')
    const cleanKey = key.replace(/^\//, '')
    return `${cleanBase}/${cleanKey}`
  }

  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'default-bucket'
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || 'account'
  return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`
}

export interface UploadOptions {
  bucket: string
  key: string
  fileBuffer: Buffer | Uint8Array
  contentType: string
  cacheControl?: string
}

export interface UploadResult {
  publicUrl?: string
  error?: string
}

export async function uploadFile({
  bucket,
  key,
  fileBuffer,
  contentType,
  cacheControl = 'public, max-age=31536000, immutable',
}: UploadOptions): Promise<UploadResult> {
  if (isR2Configured()) {
    try {
      const client = getR2Client()
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!
      const fullKey = `${bucket}/${key}`.replace(/\/+/g, '/')

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fullKey,
          Body: fileBuffer,
          ContentType: contentType,
          CacheControl: cacheControl,
        })
      )

      const rawUrl = getR2PublicUrl(fullKey)
      const versionedUrl = `${rawUrl}?v=${Date.now()}`
      return { publicUrl: versionedUrl }
    } catch (err: any) {
      return { error: err.message || 'Failed to upload file to Cloudflare R2' }
    }
  }

  // Fallback to Supabase Storage if R2 is not configured
  try {
    const supabase = await createSupabaseServerClient()
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(key, fileBuffer, { contentType, upsert: true })

    if (uploadError) return { error: uploadError.message }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(key)

    const versionedUrl = `${publicUrl}?v=${Date.now()}`
    return { publicUrl: versionedUrl }
  } catch (err: any) {
    return { error: err.message || 'Failed to upload file to storage' }
  }
}

export interface DeleteOptions {
  bucket: string
  key: string
}

export interface DeleteResult {
  success?: boolean
  error?: string
}

export async function deleteFile({ bucket, key }: DeleteOptions): Promise<DeleteResult> {
  if (isR2Configured()) {
    try {
      const client = getR2Client()
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!
      const fullKey = `${bucket}/${key}`.replace(/\/+/g, '/')

      await client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: fullKey,
        })
      )
      return { success: true }
    } catch (err: any) {
      return { error: err.message || 'Failed to delete file from Cloudflare R2' }
    }
  }

  // Fallback to Supabase Storage if R2 is not configured
  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.storage
      .from(bucket)
      .remove([key])

    if (error) return { error: error.message }
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete file from storage' }
  }
}

export interface ListFolderOptions {
  bucket: string
  prefix: string
}

export interface ListFolderResult {
  files: string[]
  error?: string
}

export async function listFolder({ bucket, prefix }: ListFolderOptions): Promise<ListFolderResult> {
  if (isR2Configured()) {
    try {
      const client = getR2Client()
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!
      const fullPrefix = `${bucket}/${prefix}`.replace(/\/+/g, '/')

      const response = await client.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: fullPrefix,
        })
      )

      const files = (response.Contents || [])
        .map((item) => item.Key)
        .filter((key): key is string => Boolean(key))

      return { files }
    } catch (err: any) {
      return { files: [], error: err.message || 'Failed to list R2 folder' }
    }
  }

  // Fallback to Supabase Storage
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix)

    if (error) return { files: [], error: error.message }
    const files = (data || []).map((f) => `${prefix}/${f.name}`.replace(/\/+/g, '/'))
    return { files }
  } catch (err: any) {
    return { files: [], error: err.message || 'Failed to list storage folder' }
  }
}
