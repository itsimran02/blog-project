import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'

let s3ClientInstance: S3Client | null = null

export function resetStorageClient(): void {
  s3ClientInstance = null
}

export type StorageProvider = 'supabase' | 'cloudflare'

export function getStorageProvider(): StorageProvider {
  const configuredProvider = process.env.STORAGE_PROVIDER?.toLowerCase()
  if (configuredProvider === 'cloudflare' && isR2Configured()) {
    return 'cloudflare'
  }
  if (configuredProvider === 'supabase') {
    return 'supabase'
  }
  return isR2Configured() ? 'cloudflare' : 'supabase'
}

export function isR2Configured(): boolean {
  // If STORAGE_PROVIDER is explicitly set to supabase, force Supabase storage
  if (process.env.STORAGE_PROVIDER?.toLowerCase() === 'supabase') {
    return false
  }

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

  // Supabase Storage Provider / Fallback
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

  // Supabase Storage Provider / Fallback
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
      const fullPrefix = prefix ? `${bucket}/${prefix}`.replace(/\/+/g, '/') : bucket

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

  // Supabase Storage Provider / Fallback
  try {
    const supabase = await createSupabaseServerClient()

    async function listRecursive(dir: string): Promise<string[]> {
      const { data, error } = await supabase.storage.from(bucket).list(dir)
      if (error) throw error
      if (!data || data.length === 0) return []

      let collected: string[] = []
      for (const item of data) {
        const itemPath = dir ? `${dir}/${item.name}` : item.name
        // In Supabase storage, folders have id === null
        if (item.id === null) {
          const nested = await listRecursive(itemPath)
          collected = collected.concat(nested)
        } else {
          collected.push(itemPath)
        }
      }
      return collected
    }

    const files = await listRecursive(prefix)
    return { files }
  } catch (err: any) {
    return { files: [], error: err.message || 'Failed to list storage folder' }
  }
}
