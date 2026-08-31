import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LatestPostsSection } from '@/components/landing/LatestPostsSection'

vi.mock('@/features/posts/queries', () => ({
  getPublishedPosts: vi.fn().mockResolvedValue({
    posts: [
      {
        id: 'post-1',
        title: 'Test Published Post Title',
        slug: 'test-published-post-slug',
        excerpt: 'Test post excerpt text for latest posts homepage section.',
        published_at: '2026-08-30T12:00:00Z',
        category: { name: 'Science', slug: 'science' },
        author: { full_name: 'Dr. Test Author' },
        cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      },
    ],
    total: 1,
  }),
}))

describe('LatestPostsSection Component', () => {
  it('renders section title and fetched blog post', async () => {
    const jsx = await LatestPostsSection()
    render(jsx)

    expect(screen.getByText('Latest Articles & Insights')).toBeInTheDocument()
    expect(screen.getByText('From Our Research Journal')).toBeInTheDocument()
    expect(screen.getByText('Test Published Post Title')).toBeInTheDocument()
    expect(screen.getByText('Test post excerpt text for latest posts homepage section.')).toBeInTheDocument()
    expect(screen.getByText('Dr. Test Author')).toBeInTheDocument()
    expect(screen.getByText('Science')).toBeInTheDocument()
  })

  it('renders View All Articles button linking to /blog', async () => {
    const jsx = await LatestPostsSection()
    render(jsx)

    const link = screen.getByRole('link', { name: /view all articles/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/blog')
  })
})
