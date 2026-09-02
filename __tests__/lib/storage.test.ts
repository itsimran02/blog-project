import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock AWS S3 client with a proper Vitest constructor implementation
const mockSend = vi.fn()
vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: vi.fn().mockImplementation(function (this: any) {
      this.send = mockSend
      return this
    }),
    PutObjectCommand: vi.fn(),
    DeleteObjectCommand: vi.fn(),
    ListObjectsV2Command: vi.fn(),
  }
})

// Mock Supabase Server client
const mockSupabaseStorage = {
  upload: vi.fn(),
  remove: vi.fn(),
  getPublicUrl: vi.fn(),
  list: vi.fn(),
}
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    storage: {
      from: vi.fn(() => mockSupabaseStorage),
    },
  }),
}))

import {
  isR2Configured,
  getStorageProvider,
  getR2PublicUrl,
  uploadFile,
  deleteFile,
  listFolder,
  resetStorageClient,
} from '@/lib/storage'

describe('Storage Abstraction Layer', () => {
  const SAVED_ENV = { ...process.env }

  function restoreEnv() {
    process.env.STORAGE_PROVIDER = SAVED_ENV.STORAGE_PROVIDER
    process.env.CLOUDFLARE_R2_ACCOUNT_ID = SAVED_ENV.CLOUDFLARE_R2_ACCOUNT_ID
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = SAVED_ENV.CLOUDFLARE_R2_ACCESS_KEY_ID
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = SAVED_ENV.CLOUDFLARE_R2_SECRET_ACCESS_KEY
    process.env.CLOUDFLARE_R2_BUCKET_NAME = SAVED_ENV.CLOUDFLARE_R2_BUCKET_NAME
    process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL = SAVED_ENV.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL
  }

  function clearR2Env() {
    delete process.env.STORAGE_PROVIDER
    delete process.env.CLOUDFLARE_R2_ACCOUNT_ID
    delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
    delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
    delete process.env.CLOUDFLARE_R2_BUCKET_NAME
    delete process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL
  }

  function setR2Env() {
    delete process.env.STORAGE_PROVIDER
    process.env.CLOUDFLARE_R2_ACCOUNT_ID = 'test-account'
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = 'test-key'
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'test-secret'
    process.env.CLOUDFLARE_R2_BUCKET_NAME = 'test-bucket'
    process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL = 'https://pub-r2.dev'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    restoreEnv()
    resetStorageClient()
  })

  afterEach(() => {
    restoreEnv()
    resetStorageClient()
  })

  describe('isR2Configured and getStorageProvider', () => {
    it('returns false and supabase when R2 env variables are missing', () => {
      clearR2Env()
      expect(isR2Configured()).toBe(false)
      expect(getStorageProvider()).toBe('supabase')
    })

    it('returns true and cloudflare when all R2 env variables are present', () => {
      setR2Env()
      expect(isR2Configured()).toBe(true)
      expect(getStorageProvider()).toBe('cloudflare')
    })

    it('forces supabase when STORAGE_PROVIDER=supabase even if R2 env vars are present', () => {
      setR2Env()
      process.env.STORAGE_PROVIDER = 'supabase'
      expect(isR2Configured()).toBe(false)
      expect(getStorageProvider()).toBe('supabase')
    })
  })

  describe('getR2PublicUrl', () => {
    it('uses NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL when set', () => {
      setR2Env()
      process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL = 'https://media.example.com/'
      const url = getR2PublicUrl('avatars/user-1/avatar.jpg')
      expect(url).toBe('https://media.example.com/avatars/user-1/avatar.jpg')
    })

    it('falls back to default R2 endpoint url when public url env is absent', () => {
      clearR2Env()
      process.env.CLOUDFLARE_R2_BUCKET_NAME = 'my-bucket'
      process.env.CLOUDFLARE_R2_ACCOUNT_ID = 'my-account'

      const url = getR2PublicUrl('avatars/user-1/avatar.jpg')
      expect(url).toBe('https://my-bucket.my-account.r2.cloudflarestorage.com/avatars/user-1/avatar.jpg')
    })
  })

  describe('Cloudflare R2 Provider Mode', () => {
    beforeEach(() => {
      setR2Env()
      resetStorageClient()
    })

    it('uploads file via R2 S3 client', async () => {
      mockSend.mockResolvedValueOnce({})

      const result = await uploadFile({
        bucket: 'avatars',
        key: 'user-1/avatar.jpg',
        fileBuffer: Buffer.from('test data'),
        contentType: 'image/jpeg',
      })

      expect(mockSend).toHaveBeenCalledOnce()
      expect(result.publicUrl).toContain('https://pub-r2.dev/avatars/user-1/avatar.jpg?v=')
      expect(result.error).toBeUndefined()
    })

    it('deletes file via R2 S3 client', async () => {
      mockSend.mockResolvedValueOnce({})

      const result = await deleteFile({
        bucket: 'avatars',
        key: 'user-1/avatar.jpg',
      })

      expect(mockSend).toHaveBeenCalledOnce()
      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('lists files via R2 S3 client', async () => {
      mockSend.mockResolvedValueOnce({
        Contents: [
          { Key: 'avatars/user-1/avatar.jpg' },
          { Key: 'avatars/user-1/avatar.png' },
        ],
      })

      const result = await listFolder({
        bucket: 'avatars',
        prefix: 'user-1',
      })

      expect(mockSend).toHaveBeenCalledOnce()
      expect(result.files).toEqual(['avatars/user-1/avatar.jpg', 'avatars/user-1/avatar.png'])
    })
  })

  describe('Supabase Storage Provider Mode', () => {
    beforeEach(() => {
      clearR2Env()
      process.env.STORAGE_PROVIDER = 'supabase'
      resetStorageClient()
    })

    it('uploads file via Supabase storage', async () => {
      mockSupabaseStorage.upload.mockResolvedValueOnce({ error: null })
      mockSupabaseStorage.getPublicUrl.mockReturnValueOnce({
        data: { publicUrl: 'https://supabase.co/storage/v1/object/public/avatars/user-1/avatar.jpg' },
      })

      const result = await uploadFile({
        bucket: 'avatars',
        key: 'user-1/avatar.jpg',
        fileBuffer: Buffer.from('test data'),
        contentType: 'image/jpeg',
      })

      expect(mockSupabaseStorage.upload).toHaveBeenCalledWith(
        'user-1/avatar.jpg',
        expect.any(Buffer),
        { contentType: 'image/jpeg', upsert: true }
      )
      expect(result.publicUrl).toContain('https://supabase.co/storage/v1/object/public/avatars/user-1/avatar.jpg?v=')
    })

    it('deletes file via Supabase storage', async () => {
      mockSupabaseStorage.remove.mockResolvedValueOnce({ error: null })

      const result = await deleteFile({
        bucket: 'avatars',
        key: 'user-1/avatar.jpg',
      })

      expect(mockSupabaseStorage.remove).toHaveBeenCalledWith(['user-1/avatar.jpg'])
      expect(result.success).toBe(true)
    })

    it('lists files via Supabase storage recursively', async () => {
      mockSupabaseStorage.list.mockImplementation(async (dir: string) => {
        if (dir === '') {
          return {
            data: [
              { name: '2026', id: null }, // folder
            ],
            error: null,
          }
        }
        if (dir === '2026') {
          return {
            data: [
              { name: 'image1.jpg', id: 'uuid-1' },
              { name: 'image2.png', id: 'uuid-2' },
            ],
            error: null,
          }
        }
        return { data: [], error: null }
      })

      const result = await listFolder({
        bucket: 'media',
        prefix: '',
      })

      expect(result.files).toEqual(['2026/image1.jpg', '2026/image2.png'])
    })
  })
})
