import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth/session', () => ({
  getProfile: vi.fn(),
}))

vi.mock('@/lib/storage', () => ({
  uploadFile: vi.fn(),
  listFolder: vi.fn(),
  getR2PublicUrl: vi.fn().mockReturnValue('https://cdn.example.com/media/file.jpg'),
  isR2Configured: vi.fn().mockReturnValue(true),
}))

import { POST } from '@/app/api/media/upload/route'
import { GET } from '@/app/api/media/list/route'
import { getProfile } from '@/lib/auth/session'
import { uploadFile, listFolder } from '@/lib/storage'

const mockGetProfile = vi.mocked(getProfile)
const mockUploadFile = vi.mocked(uploadFile)
const mockListFolder = vi.mocked(listFolder)

describe('Media API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/media/upload', () => {
    it('returns 403 when user is unauthenticated or not an author/admin', async () => {
      mockGetProfile.mockResolvedValue(null)
      const req = new Request('http://localhost/api/media/upload', { method: 'POST' })
      const res = await POST(req)
      expect(res.status).toBe(403)
    })

    it('returns 400 when no file is provided', async () => {
      mockGetProfile.mockResolvedValue({ id: 'user-1', role: 'author' } as any)
      const formData = new FormData()
      const req = new Request('http://localhost/api/media/upload', {
        method: 'POST',
        body: formData,
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })

    it('uploads valid image file and returns 201 with public URL', async () => {
      mockGetProfile.mockResolvedValue({ id: 'user-1', role: 'author' } as any)
      mockUploadFile.mockResolvedValue({ publicUrl: 'https://cdn.example.com/media/test.jpg' })

      const formData = new FormData()
      const file = new File(['fake-image-bytes'], 'banner.jpg', { type: 'image/jpeg' })
      formData.append('file', file)

      const req = new Request('http://localhost/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      const res = await POST(req)
      expect(res.status).toBe(201)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.data.url).toContain('https://cdn.example.com')
    })
  })

  describe('GET /api/media/list', () => {
    it('returns 403 when user is unauthenticated', async () => {
      mockGetProfile.mockResolvedValue(null)
      const res = await GET()
      expect(res.status).toBe(403)
    })

    it('returns list of uploaded media items for authors', async () => {
      mockGetProfile.mockResolvedValue({ id: 'user-1', role: 'author' } as any)
      mockListFolder.mockResolvedValue({ files: ['2026/04/banner.jpg'] })

      const res = await GET()
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.data.length).toBe(1)
      expect(json.data[0].filename).toBe('banner.jpg')
    })
  })
})
