import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { getPublishedPosts } from '@/features/posts/queries'
import { PostList } from '@/features/posts/components/PostList'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Articles | Versatile Scientist',
  description: 'Scholarship guides, research tips, and academic career insights.',
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam, q: queryParam } = await searchParams
  const page = Number(pageParam) || 1
  const query = (queryParam || '').trim()
  const limit = 12

  const { posts, total } = await getPublishedPosts(page, limit, query)
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 space-y-10">
      {/* Page header */}
      <div className="space-y-4 border-b border-border pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Versatile Scientist</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">All Articles & Guides</h1>
            <p className="text-muted-foreground text-base max-w-xl">
              Discover research strategies, scholarship tips, fellowship guides, and career insights.
            </p>
          </div>

          {/* Search Form */}
          <form action="/blog" method="GET" className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search articles by title or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xs"
            />
          </form>
        </div>

        {/* Active Search Banner */}
        {query && (
          <div className="flex items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-full">
              Results for: &quot;{query}&quot; ({total} found)
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium underline underline-offset-2"
            >
              <X className="w-3.5 h-3.5" /> Clear search
            </Link>
          </div>
        )}
      </div>

      <PostList posts={posts} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          {page > 1 && (
            <Link
              href={`/blog?${query ? `q=${encodeURIComponent(query)}&` : ''}page=${page - 1}`}
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
              href={`/blog?${query ? `q=${encodeURIComponent(query)}&` : ''}page=${page + 1}`}
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
