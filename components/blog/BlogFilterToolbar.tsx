'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogFilterToolbarProps {
  categories: Category[]
  currentQuery: string
  currentCategory: string
  currentSort: string
  totalResults: number
}

export function BlogFilterToolbar({
  categories,
  currentQuery,
  currentCategory,
  currentSort,
  totalResults,
}: BlogFilterToolbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Reset page to 1 on filter change
    params.set('page', '1')

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'desc') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/blog?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q') as string
    updateFilters({ q })
  }

  const hasActiveFilters = currentQuery || currentCategory !== 'all' || currentSort !== 'desc'

  return (
    <div className="space-y-4">
      {/* Top Filter Controls Bar */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={currentQuery}
            placeholder="Search articles by title or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="relative flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-xl border border-border text-xs text-foreground font-semibold shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <select
              value={currentCategory}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="bg-transparent text-foreground text-xs font-semibold outline-none cursor-pointer pr-1"
              aria-label="Filter by Category"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Filter */}
          <div className="relative flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-xl border border-border text-xs text-foreground font-semibold shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="bg-transparent text-foreground text-xs font-semibold outline-none cursor-pointer pr-1"
              aria-label="Sort Order"
            >
              <option value="desc">Newest to Oldest</option>
              <option value="asc">Oldest to Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <span className="text-xs text-muted-foreground font-semibold">Active filters:</span>

          {currentQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-full">
              Search: &quot;{currentQuery}&quot;
              <button
                onClick={() => updateFilters({ q: '' })}
                className="hover:text-foreground transition-colors"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-full">
              Category: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
              <button
                onClick={() => updateFilters({ category: 'all' })}
                className="hover:text-foreground transition-colors"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentSort !== 'desc' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-full">
              Sort: Oldest First
              <button
                onClick={() => updateFilters({ sort: 'desc' })}
                className="hover:text-foreground transition-colors"
                aria-label="Reset sort order"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={() => router.push('/blog')}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium ml-1"
          >
            Reset All
          </button>
        </div>
      )}
    </div>
  )
}
