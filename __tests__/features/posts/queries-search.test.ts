import { describe, it, expect, vi } from 'vitest'
import { getPublishedPosts } from '@/features/posts/queries'

const mockOr = vi.fn().mockReturnThis()
const mockRange = vi.fn().mockResolvedValue({
  data: [
    {
      id: 'post-1',
      title: 'Global STEM Fellowship Guide',
      slug: 'global-stem-fellowship-guide',
      excerpt: 'Learn how to apply for global stem fellowships.',
      status: 'published',
      published_at: '2026-08-30T10:00:00Z',
    },
  ],
  error: null,
  count: 1,
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockImplementation(async () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    or: mockOr,
    range: mockRange,
  })),
}))

describe('getPublishedPosts search query', () => {
  it('applies ilike search filter when query is provided', async () => {
    const result = await getPublishedPosts(1, 10, 'fellowship')

    expect(mockOr).toHaveBeenCalledWith('title.ilike.%fellowship%,excerpt.ilike.%fellowship%')
    expect(result.posts).toHaveLength(1)
    expect(result.posts[0].title).toBe('Global STEM Fellowship Guide')
  })
})
