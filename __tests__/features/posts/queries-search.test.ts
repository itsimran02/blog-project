import { describe, it, expect, vi } from 'vitest'
import { getPublishedPosts } from '@/features/posts/queries'

const mockOr = vi.fn().mockReturnThis()
const mockEq = vi.fn().mockReturnThis()
const mockOrder = vi.fn().mockReturnThis()
const mockSingle = vi.fn().mockResolvedValue({ data: { id: 'cat-123' }, error: null })
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
    eq: mockEq,
    order: mockOrder,
    or: mockOr,
    single: mockSingle,
    range: mockRange,
  })),
}))

describe('getPublishedPosts filters', () => {
  it('applies ilike search filter when query is provided', async () => {
    const result = await getPublishedPosts(1, 10, 'fellowship')

    expect(mockOr).toHaveBeenCalledWith('title.ilike.%fellowship%,excerpt.ilike.%fellowship%')
    expect(result.posts).toHaveLength(1)
    expect(result.posts[0].title).toBe('Global STEM Fellowship Guide')
  })

  it('applies ascending sort order when sortOrder is asc', async () => {
    await getPublishedPosts(1, 10, '', 'all', 'asc')

    expect(mockOrder).toHaveBeenCalledWith('published_at', { ascending: true })
  })

  it('applies category filter when categorySlug is provided', async () => {
    await getPublishedPosts(1, 10, '', 'fellowships', 'desc')

    expect(mockEq).toHaveBeenCalledWith('category_id', 'cat-123')
  })
})
