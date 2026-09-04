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

  // Dynamic fallback posts for standard categories if none currently in DB
  const normalizedSlug = slug.toLowerCase()
  if (posts.length === 0) {
    if (normalizedSlug === 'jobs' || normalizedSlug === 'job') {
      posts = [
        {
          id: 'sample-job-1',
          title: 'Global Academic & Industry Research Job Opportunities 2026',
          slug: 'global-academic-industry-research-job-opportunities-2026',
          excerpt: 'Explore open postdoctoral, lab technician, and scientific researcher roles across top universities and biotech hubs worldwide.',
          content: '<p>Career and scientific openings...</p>',
          cover_image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
          author_id: 'sample-author',
          category_id: category?.id || 'sample-cat',
          status: 'published',
          featured: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { id: 'sample-cat', name: 'Jobs', slug: 'jobs' },
          author: { id: 'sample-author', full_name: 'Versatile Scientist Team', email: 'team@versatilescientist.org', avatar_url: null },
          tags: [{ id: '1', name: 'Jobs', slug: 'jobs' }],
        } as unknown as PostWithRelations,
        {
          id: 'sample-job-2',
          title: 'How to Prepare a Competitive Scientific CV for International Roles',
          slug: 'how-to-prepare-competitive-scientific-cv-international-roles',
          excerpt: 'A blueprint for structuring your research publications, grant history, and technical proficiencies to stand out in global hiring pools.',
          content: '<p>CV preparation guide...</p>',
          cover_image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
          author_id: 'sample-author',
          category_id: category?.id || 'sample-cat',
          status: 'published',
          featured: false,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { id: 'sample-cat', name: 'Jobs', slug: 'jobs' },
          author: { id: 'sample-author', full_name: 'Dr. Namdev Togre', email: 'team@versatilescientist.org', avatar_url: null },
          tags: [{ id: '1', name: 'Jobs', slug: 'jobs' }],
        } as unknown as PostWithRelations,
      ]
    } else if (normalizedSlug === 'internships' || normalizedSlug === 'internship') {
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
        {
          id: 'sample-internship-2',
          title: 'Summer Undergraduate Research Programs (SURF) Guide',
          slug: 'summer-undergraduate-research-programs-surf-guide',
          excerpt: 'Step-by-step application advice for landing paid summer research positions at prestigious research institutions.',
          content: '<p>Undergraduate summer programs...</p>',
          cover_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
          author_id: 'sample-author',
          category_id: category?.id || 'sample-cat',
          status: 'published',
          featured: false,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { id: 'sample-cat', name: 'Internships', slug: 'internships' },
          author: { id: 'sample-author', full_name: 'Dr. Namdev Togre', email: 'team@versatilescientist.org', avatar_url: null },
          tags: [{ id: '1', name: 'Internships', slug: 'internships' }],
        } as unknown as PostWithRelations,
      ]
    } else if (normalizedSlug === 'workshops' || normalizedSlug === 'workshop') {
      posts = [
        {
          id: 'sample-workshop-1',
          title: 'Gaav Te Global Science & Research Mentorship Workshop 2026',
          slug: 'gaav-te-global-science-research-mentorship-workshop-2026',
          excerpt: 'Hands-on interactive career roadmaps, college guidance, and scientific writing workshops designed for rural and aspiring scholars.',
          content: '<p>Interactive career mentorship...</p>',
          cover_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
          author_id: 'sample-author',
          category_id: category?.id || 'sample-cat',
          status: 'published',
          featured: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { id: 'sample-cat', name: 'Workshops', slug: 'workshops' },
          author: { id: 'sample-author', full_name: 'Dr. Namdev Togre', email: 'team@versatilescientist.org', avatar_url: null },
          tags: [{ id: '1', name: 'Workshops', slug: 'workshops' }],
        } as unknown as PostWithRelations,
        {
          id: 'sample-workshop-2',
          title: 'Mastering Scientific Paper Writing & Peer Review',
          slug: 'mastering-scientific-paper-writing-peer-review',
          excerpt: 'A comprehensive workshop on outlining manuscripts, choosing the right target journals, and addressing referee comments.',
          content: '<p>Scientific writing workshop...</p>',
          cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
          author_id: 'sample-author',
          category_id: category?.id || 'sample-cat',
          status: 'published',
          featured: false,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { id: 'sample-cat', name: 'Workshops', slug: 'workshops' },
          author: { id: 'sample-author', full_name: 'Versatile Scientist Team', email: 'team@versatilescientist.org', avatar_url: null },
          tags: [{ id: '1', name: 'Workshops', slug: 'workshops' }],
        } as unknown as PostWithRelations,
      ]
    } else if (normalizedSlug === 'scholarships' || normalizedSlug === 'scholarship') {
      posts = [
        {
          id: 'sample-scholarship-1',
          title: 'How to Ace the Global STEM Fellowship & Scholarship Application 2026',
          slug: 'how-to-ace-global-stem-fellowship-2026',
          excerpt: 'A comprehensive step-by-step guide on drafting compelling research proposals, securing referee letters, and preparing for competitive interviews.',
          content: '<p>Scholarship application blueprint...</p>',
          cover_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
          author_id: 'sample-author',
          category_id: category?.id || 'sample-cat',
          status: 'published',
          featured: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { id: 'sample-cat', name: 'Scholarships', slug: 'scholarships' },
          author: { id: 'sample-author', full_name: 'Dr. Namdev Togre', email: 'team@versatilescientist.org', avatar_url: null },
          tags: [{ id: '1', name: 'Scholarships', slug: 'scholarships' }],
        } as unknown as PostWithRelations,
        {
          id: 'sample-scholarship-2',
          title: 'Fully Funded Postgraduate Scholarships in Europe & North America',
          slug: 'fully-funded-postgraduate-scholarships-europe-north-america',
          excerpt: 'Curated list of tuition-free Masters and PhD funding opportunities covering living stipends, health insurance, and travel allowances.',
          content: '<p>Funding programs...</p>',
          cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
          author_id: 'sample-author',
          category_id: category?.id || 'sample-cat',
          status: 'published',
          featured: false,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { id: 'sample-cat', name: 'Scholarships', slug: 'scholarships' },
          author: { id: 'sample-author', full_name: 'Versatile Scientist Team', email: 'team@versatilescientist.org', avatar_url: null },
          tags: [{ id: '1', name: 'Scholarships', slug: 'scholarships' }],
        } as unknown as PostWithRelations,
      ]
    }
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
