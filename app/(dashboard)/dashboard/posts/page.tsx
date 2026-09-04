import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { getAllPostsForDashboard } from '@/features/posts/queries'
import { PostTable } from '@/components/dashboard/PostTable'
import { getProfile } from '@/lib/auth/session'

export const metadata: Metadata = { title: 'Articles & Posts | Versatile Scientist' }

export default async function PostsPage() {
  const profile = await getProfile()
  const posts = await getAllPostsForDashboard(
    profile?.role === 'admin' ? undefined : profile?.id
  )

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-page">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#07163d] tracking-tight">Articles & Posts</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            {posts.length} article{posts.length !== 1 ? 's' : ''} in your database
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#1d4ed8] text-white text-xs font-bold hover:bg-[#1e40af] shadow-[0_2px_10px_rgba(29,78,216,0.3)] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Write New Post
        </Link>
      </div>
      <PostTable posts={posts} />
    </div>
  )
}

