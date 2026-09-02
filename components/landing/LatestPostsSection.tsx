import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react'
import { getPublishedPosts } from '@/features/posts/queries'

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

  return (
    <section className="border-y border-[#1d4ed8]/15 bg-[#f8fbff] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#1d4ed8] flex items-center justify-center gap-1.5 mb-2">
            <BookOpen className="w-4 h-4" /> Latest Articles & Insights
          </span>
          <h2 className="text-3xl font-black text-[#07163d] tracking-tight">From Our Research Journal</h2>
          <div className="w-16 h-1 bg-[#38bdf8] mx-auto mt-4 mb-4"></div>
          <p className="text-[#475569] max-w-2xl mx-auto text-lg leading-relaxed">
            Explore the newest guides, scholarship strategies, and academic career advice written by our mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {displayPosts.map((post) => {
            const dateStr = post.published_at
              ? format(new Date(post.published_at), 'MMM d, yyyy')
              : 'Recent'
            const authorName = post.author?.full_name || post.author?.email || 'Versatile Scientist'

            return (
              <article
                key={post.id}
                className="bg-white border border-[#1d4ed8]/15 shadow-[6px_6px_0_rgba(37,99,235,0.10)] hover:shadow-[9px_9px_0_rgba(37,99,235,0.18)] transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {post.cover_image && (
                  <div className="relative h-48 w-full overflow-hidden bg-[#dbeafe]">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3">
                    {post.category && (
                      <span className="inline-block px-3 py-1 bg-[#eff6ff] text-[#1d4ed8] text-xs font-black border border-[#93c5fd]/70">
                        {post.category.name}
                      </span>
                    )}
                    <Link href={`/blog/${post.slug}`} className="block group-hover:text-[#1d4ed8] transition-colors">
                      <h3 className="text-xl font-black text-[#07163d] leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    {post.excerpt && (
                      <p className="text-[#475569] text-sm line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#1d4ed8]/10 flex items-center justify-between text-xs text-[#64748b] font-medium">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#1d4ed8]" /> {authorName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {dateStr}
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
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1d4ed8] text-white font-black shadow-[6px_6px_0_#93c5fd] hover:bg-[#07163d] transition-all text-sm"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
