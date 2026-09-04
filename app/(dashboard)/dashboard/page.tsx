import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import {
  FileText,
  Users,
  Eye,
  PenLine,
  ExternalLink,
  Plus,
  Briefcase,
  GraduationCap,
  Calendar,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import { getProfile } from '@/lib/auth/session'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = { title: 'Dashboard | Versatile Scientist' }

export default async function DashboardPage() {
  const profile = await getProfile()
  const isAdmin = profile?.role === 'admin'

  const supabase = await createClient()

  const [
    { count: totalPosts },
    { count: publishedPosts },
    { count: totalUsers },
    { count: totalComments },
    { data: recentPostsRaw },
    { count: totalCategories },
  ] = await Promise.all([
    isAdmin
      ? supabase.from('posts').select('*', { count: 'exact', head: true })
      : supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', profile?.id),
    isAdmin
      ? supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published')
      : supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published').eq('author_id', profile?.id),
    isAdmin
      ? supabase.from('profiles').select('*', { count: 'exact', head: true })
      : { count: null },
    isAdmin
      ? supabase.from('comments').select('*', { count: 'exact', head: true })
      : { count: null },
    supabase
      .from('posts')
      .select('id, title, slug, status, created_at, published_at, category:categories(name, slug), author:profiles!posts_author_id_fkey(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ])

  const draftCount = Math.max(0, (totalPosts ?? 0) - (publishedPosts ?? 0))
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Editor'

  type RawPost = {
    id: string
    title: string
    slug: string
    status: string
    created_at: string
    published_at: string | null
    category: { name: string; slug: string } | null
    author: { full_name: string | null; email: string } | null
  }

  const recentPosts = (recentPostsRaw ?? []) as unknown as RawPost[]

  const stats = [
    {
      label: 'TOTAL POSTS',
      value: totalPosts ?? 0,
      subtext: `${draftCount} in draft queue`,
      icon: FileText,
      badge: 'All Items',
    },
    {
      label: 'PUBLISHED LIVE',
      value: publishedPosts ?? 0,
      subtext: 'Indexed & visible',
      icon: Eye,
      badge: 'Live',
    },
    {
      label: 'CATEGORIES',
      value: totalCategories ?? 4,
      subtext: 'Jobs, Internships, etc.',
      icon: Award,
      badge: 'Taxonomy',
    },
    ...(isAdmin
      ? [
          {
            label: 'REGISTERED USERS',
            value: totalUsers ?? 0,
            subtext: `${totalComments ?? 0} reader comments`,
            icon: Users,
            badge: 'Community',
          },
        ]
      : [
          {
            label: 'READER COMMENTS',
            value: totalComments ?? 0,
            subtext: 'Feedback & responses',
            icon: MessageSquare,
            badge: 'Feedback',
          },
        ]),
  ]

  const publishingDesks = [
    { label: 'Jobs & Careers', desc: 'Industry & research roles', icon: Briefcase, href: '/dashboard/posts/new' },
    { label: 'Internships', desc: 'Summer & research training', icon: GraduationCap, href: '/dashboard/posts/new' },
    { label: 'Workshops', desc: 'Conferences & hands-on seminars', icon: Calendar, href: '/dashboard/posts/new' },
    { label: 'Scholarships', desc: 'Grants & international fellowships', icon: Award, href: '/dashboard/posts/new' },
  ]

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-page">
      {/* Editorial Header */}
      <div className="bg-white border border-[#1d4ed8]/15 rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(7,22,61,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eef6ff] text-[#1d4ed8] border border-[#93c5fd]/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] animate-pulse" />
              EDITORIAL CONSOLE
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Versatile Scientist CMS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#07163d] tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm font-medium text-slate-600 max-w-2xl">
            Publish science careers, manage verified opportunities, and monitor portal content.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/"
            target="_blank"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-[#07163d] text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            Live Website
          </Link>
          <Link
            href="/dashboard/posts/new"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1d4ed8] text-white text-xs font-bold hover:bg-[#1e40af] transition-colors shadow-[0_2px_10px_rgba(29,78,216,0.3)]"
          >
            <Plus className="h-4 w-4" />
            Write New Post
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_2px_8px_rgba(7,22,61,0.03)] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  {stat.label}
                </span>
                <div className="p-1.5 rounded-lg bg-[#eef6ff] text-[#1d4ed8] border border-[#1d4ed8]/10">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#07163d] tracking-tight">
                  {stat.value}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-600 truncate">
                    {stat.subtext}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid: Recent Content & Publishing Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Recent Content & Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(7,22,61,0.03)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#07163d]">
                Recent Articles & Post Queue
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Latest submissions, edits, and live career postings
              </p>
            </div>
            <Link
              href="/dashboard/posts"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d4ed8] hover:text-[#1e40af] transition-colors"
            >
              View All ({totalPosts ?? 0})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-[#eef6ff] flex items-center justify-center text-[#1d4ed8] border border-[#1d4ed8]/20">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-[#07163d]">No articles published yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Start sharing science opportunities, internships, and research updates with your audience.
              </p>
              <Link
                href="/dashboard/posts/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1d4ed8] text-white text-xs font-bold hover:bg-[#1e40af] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPosts.map((post) => {
                const isPublished = post.status === 'published'
                const relativeTime = post.created_at
                  ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
                  : 'recently'

                return (
                  <div
                    key={post.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#eef6ff] text-[#1d4ed8] border border-[#93c5fd]/50">
                            {post.category.name}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {post.status}
                        </span>
                        <span className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-600" />
                          {relativeTime}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#07163d] truncate hover:text-[#1d4ed8] transition-colors">
                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                          {post.title}
                        </Link>
                      </h3>

                      {post.author && (
                        <p className="text-xs text-slate-600">
                          By <span className="font-semibold text-slate-700">{post.author.full_name ?? post.author.email}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {isPublished && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#1d4ed8] hover:bg-white rounded-lg border border-slate-200 transition-colors"
                        >
                          Preview
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="px-3 py-1.5 text-xs font-bold text-[#1d4ed8] bg-[#eef6ff] hover:bg-[#dbeafe] rounded-lg border border-[#93c5fd]/60 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Publishing Workflows & Quality Checklist */}
        <div className="space-y-6">
          {/* Quick Publish Categories */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_2px_8px_rgba(7,22,61,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#07163d] uppercase tracking-wider">
                Publishing Desks
              </h2>
              <Sparkles className="h-4 w-4 text-[#1d4ed8]" />
            </div>

            <div className="grid gap-2">
              {publishingDesks.map((desk) => {
                const Icon = desk.icon
                return (
                  <Link
                    key={desk.label}
                    href={desk.href}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#93c5fd] hover:bg-[#f8fbff] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#eef6ff] text-[#1d4ed8] flex items-center justify-center shrink-0 border border-[#93c5fd]/40 group-hover:scale-105 transition-transform">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#07163d] group-hover:text-[#1d4ed8] transition-colors truncate">
                        {desk.label}
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">
                        {desk.desc}
                      </p>
                    </div>
                    <PenLine className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#1d4ed8] transition-colors shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Publishing Checklist */}
          <div className="bg-[#07163d] text-white rounded-2xl p-5 border border-white/10 space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#7dd3fc]">
                Editorial Quality Standards
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#38bdf8] font-bold">1.</span>
                <span>Specify accurate eligibility criteria, stipends, or deadlines in the job summary.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#38bdf8] font-bold">2.</span>
                <span>Select the appropriate primary stream (Jobs, Internships, Workshops, Scholarships).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#38bdf8] font-bold">3.</span>
                <span>Include authoritative official links for applicants to verify and submit.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

