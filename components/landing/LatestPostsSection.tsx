import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react'
import { getPublishedPosts } from '@/features/posts/queries'

const articleFallbackImages = [
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
]

export async function LatestPostsSection() {
  let posts: any[] = []
  try {
    const data = await getPublishedPosts(1, 3)
    posts = data.posts || []
  } catch (err) {
    posts = []
  }

  // Sample fallback posts if database has no published posts yet
  const fallbackPosts = [
    {
      id: 'sample-1',
      title: 'How to Ace the Global STEM Fellowship Application 2026',
      slug: 'how-to-ace-global-stem-fellowship-2026',
      excerpt: 'A comprehensive step-by-step guide on drafting compelling research proposals, securing referee letters, and preparing for competitive interviews.',
      published_at: new Date().toISOString(),
      category: { name: 'Fellowships', slug: 'fellowships' },
      author: { full_name: 'Dr. Namdev Togre' },
      cover_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'sample-2',
      title: 'Top 10 Remote Research Internships for Students',
      slug: 'top-10-remote-research-internships-students',
      excerpt: 'Discover fully remote research assistant opportunities at leading international laboratories in AI, Genomics, and Sustainable Energy.',
      published_at: new Date().toISOString(),
      category: { name: 'Internships', slug: 'internships' },
      author: { full_name: 'Versatile Scientist Team' },
      cover_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'sample-3',
      title: 'Navigating the Transition from Masters to PhD',
      slug: 'navigating-transition-masters-to-phd',
      excerpt: 'Key strategies for identifying potential supervisors, articulating your research interest, and funding your postgraduate doctoral studies.',
      published_at: new Date().toISOString(),
      category: { name: 'Career Advice', slug: 'career-advice' },
      author: { full_name: 'Dr. Sarah Jenkins' },
      cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    },
  ]

  const displayPosts = posts.length > 0 ? posts : fallbackPosts
  const cardGridClass =
    displayPosts.length === 1
      ? 'mx-auto max-w-xl'
      : displayPosts.length === 2
        ? 'mx-auto grid max-w-5xl grid-cols-1 gap-7 md:grid-cols-2'
        : 'grid grid-cols-1 gap-7 md:grid-cols-3'

  return (
    <section className="relative isolate overflow-hidden border-y border-[#1d4ed8]/10 bg-[#f7fbff] py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#eef6ff] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 grid max-w-5xl gap-6 text-center">
          <span className="mx-auto flex items-center justify-center gap-2 border border-[#1d4ed8]/15 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#1d4ed8] shadow-[0_12px_30px_rgba(29,78,216,0.08)]">
            <BookOpen className="h-4 w-4" /> Latest Articles & Insights
          </span>
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[#07163d] sm:text-5xl">From Our Research Journal</h2>
            <div className="mx-auto mt-5 h-1.5 w-20 bg-[#38bdf8]" />
          </div>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-8 text-[#475569]">
            Explore fresh guides, scholarship strategies, and academic career advice shaped for students who need
            practical next steps.
          </p>
        </div>

        <div className={`${cardGridClass} mb-12`}>
          {displayPosts.map((post, index) => {
            const dateStr = post.published_at
              ? format(new Date(post.published_at), 'MMM d, yyyy')
              : 'Recent'
            const authorName = post.author?.full_name || post.author?.email || 'Versatile Scientist'
            const coverImage = post.cover_image || articleFallbackImages[index % articleFallbackImages.length]
            const categoryName = post.category?.name || 'Research Guide'

            return (
              <article
                key={post.id}
                className="group flex min-h-full flex-col overflow-hidden border border-[#1d4ed8]/15 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1d4ed8]/30 hover:shadow-[0_30px_80px_rgba(29,78,216,0.16)]"
              >
                <div className="relative h-56 w-full overflow-hidden bg-[#dbeafe]">
                  <img
                    src={coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,22,61,0.02)_0%,rgba(7,22,61,0.64)_100%)]" />
                  <span className="absolute bottom-4 left-4 border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#1d4ed8] backdrop-blur">
                    {categoryName}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between space-y-5 p-6">
                  <div className="space-y-3">
                    <Link href={`/blog/${post.slug}`} className="block group-hover:text-[#1d4ed8] transition-colors">
                      <h3 className="line-clamp-2 text-2xl font-black leading-tight text-[#07163d]">
                        {post.title}
                      </h3>
                    </Link>
                    {post.excerpt && (
                      <p className="line-clamp-3 text-base leading-7 text-[#475569]">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1d4ed8]/10 pt-5 text-sm font-bold text-[#64748b]">
                    <span className="flex min-w-0 items-center gap-2">
                      <User className="h-4 w-4 shrink-0 text-[#1d4ed8]" />
                      <span className="truncate">{authorName}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#1d4ed8]" /> {dateStr}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#1d4ed8] px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_34px_rgba(29,78,216,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#07163d]"
          >
            View All Articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
