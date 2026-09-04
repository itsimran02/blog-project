import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PostList } from '@/features/posts/components/PostList'
import type { PostWithRelations } from '@/features/posts/types'

export const revalidate = 60

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { createStaticClient } = await import('@/lib/supabase/static')
  const supabase = createStaticClient()
  if (!supabase) return []
  const { data } = await supabase.from('categories').select('slug')
  return ((data ?? []) as { slug: string }[]).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  let { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!category) {
    const altSlug = slug.endsWith('s') ? slug.slice(0, -1) : `${slug}s`
    const { data: altCat } = await supabase
      .from('categories')
      .select('*')
      .or(`slug.eq.${slug},slug.eq.${altSlug},name.ilike.%${slug}%`)
      .limit(1)
      .maybeSingle()
    category = altCat
  }

  const name = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
  return {
    title: `${name} | Versatile Scientist`,
    description: category?.description ?? `Explore articles, opportunities, and guides for ${name}.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  let { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!category) {
    const altSlug = slug.endsWith('s') ? slug.slice(0, -1) : `${slug}s`
    const { data: altCat } = await supabase
      .from('categories')
      .select('*')
      .or(`slug.eq.${slug},slug.eq.${altSlug},name.ilike.%${slug}%`)
      .limit(1)
      .maybeSingle()
    category = altCat
  }

  const formattedName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
  const description = category?.description || `Explore curated opportunities, insights, and guides in ${formattedName}.`

  let postsData = null
  if (category?.id) {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, full_name, email, avatar_url),
        category:categories(id, name, slug),
        tags:post_tags(tag:tags(id, name, slug))
      `)
      .eq('status', 'published')
      .eq('category_id', category.id)
      .order('published_at', { ascending: false })
    postsData = data
  } else {
    // Search posts matching slug keywords if category is not explicitly linked
    const term = `%${slug}%`
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, full_name, email, avatar_url),
        category:categories(id, name, slug),
        tags:post_tags(tag:tags(id, name, slug))
      `)
      .eq('status', 'published')
      .or(`title.ilike.${term},excerpt.ilike.${term}`)
      .order('published_at', { ascending: false })
    postsData = data
  }

  let posts = (postsData ?? []).map((p) => ({
    ...p,
    // @ts-expect-error nested join shape
    tags: (p.tags ?? []).map((pt: { tag: unknown }) => pt.tag).filter(Boolean),
  })) as PostWithRelations[]

  // Fallback sample post for internships if no posts in database yet
  if (posts.length === 0 && (slug === 'internships' || slug === 'internship')) {
    posts = [
      {
        id: 'sample-internship-1',
        title: 'Top 10 Remote Research Internships for Students 2026',
        slug: 'top-10-remote-research-internships-students',
        excerpt: 'Discover fully remote research assistant opportunities at leading international laboratories in AI, Genomics, and Sustainable Energy.',
        content: '<p>Explore top research internships...</p>',
        cover_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        author_id: 'sample-author',
        category_id: category?.id || 'sample-cat',
        status: 'published',
        featured: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: { id: 'sample-cat', name: 'Internships', slug: 'internships' },
        author: { id: 'sample-author', full_name: 'Versatile Scientist Team', email: 'team@versatilescientist.org', avatar_url: null },
        tags: [{ id: '1', name: 'Internships', slug: 'internships' }],
      } as unknown as PostWithRelations,
    ]
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 space-y-10">
      <div className="space-y-3 border-b border-border pb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          Back to All Articles
        </Link>
        <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          Category
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{formattedName}</h1>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">{description}</p>
      </div>

      <PostList posts={posts} />
    </div>
  )
}
