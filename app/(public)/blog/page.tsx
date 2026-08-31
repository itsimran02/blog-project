import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedPosts, getAllCategories } from '@/features/posts/queries'
import { PostList } from '@/features/posts/components/PostList'
import { BlogFilterToolbar } from '@/components/blog/BlogFilterToolbar'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Articles | Versatile Scientist',
  description: 'Scholarship guides, research tips, and academic career insights.',
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string; q?: string; category?: string; sort?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam, q: queryParam, category: categoryParam, sort: sortParam } = await searchParams
  const page = Number(pageParam) || 1
  const query = (queryParam || '').trim()
  const category = categoryParam || 'all'
  const sort = sortParam === 'asc' ? 'asc' : 'desc'
  const limit = 12

  const categories = await getAllCategories()
  const { posts, total } = await getPublishedPosts(page, limit, query, category, sort)
  const totalPages = Math.ceil(total / limit)

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category !== 'all') params.set('category', category)
    if (sort !== 'desc') params.set('sort', sort)
    params.set('page', pageNum.toString())
    return `/blog?${params.toString()}`
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 space-y-10">
      {/* Page Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Versatile Scientist</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">All Articles & Guides</h1>
        <p className="text-muted-foreground text-base max-w-xl">
          Discover research strategies, scholarship tips, fellowship guides, and career insights.
        </p>

        {/* Filter & Search Controls */}
        <div className="pt-2">
          <BlogFilterToolbar
            categories={categories}
            currentQuery={query}
            currentCategory={category}
            currentSort={sort}
            totalResults={total}
          />
        </div>
      </div>

      <PostList posts={posts} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted text-foreground transition-colors shadow-xs"
            >
              ← Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted text-foreground transition-colors shadow-xs"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
