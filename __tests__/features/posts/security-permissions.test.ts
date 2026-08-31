import { describe, it, expect, vi } from 'vitest'
import { can } from '@/lib/permissions'
import { createPost } from '@/features/posts/actions'
import { updateUserRole } from '@/features/users/actions'

vi.mock('@/lib/auth/session', () => ({
  getProfile: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockImplementation(async () => ({
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'post-1', slug: 'test' }, error: null }),
  })),
}))

import { getProfile } from '@/lib/auth/session'

describe('Role Security & Post Creation Permissions', () => {
  it('allows admin and author roles to create posts', () => {
    expect(can('admin', 'posts:create')).toBe(true)
    expect(can('author', 'posts:create')).toBe(true)
  })

  it('denies regular users or unassigned roles from creating posts', () => {
    expect(can('user' as any, 'posts:create')).toBe(false)
    expect(can(null, 'posts:create')).toBe(false)
    expect(can(undefined, 'posts:create')).toBe(false)
  })

  it('createPost action returns Unauthorized if user is not author or admin', async () => {
    vi.mocked(getProfile).mockResolvedValueOnce({
      id: 'u1',
      email: 'user@example.com',
      role: 'user',
    } as any)

    const result = await createPost({
      title: 'Test Post',
      content: 'Content',
      slug: '',
      excerpt: '',
      cover_image: '',
      category_id: '',
      tag_ids: [],
      seo_title: '',
      seo_description: '',
    })

    expect(result).toEqual({ error: 'Unauthorized' })
  })

  it('updateUserRole blocks assigning admin role via application actions', async () => {
    vi.mocked(getProfile).mockResolvedValueOnce({
      id: 'admin1',
      email: 'admin@example.com',
      role: 'admin',
    } as any)

    const result = await updateUserRole('u2', 'admin' as any)
    expect(result).toEqual({ error: 'Admin role can only be assigned directly in the database.' })
  })
})
