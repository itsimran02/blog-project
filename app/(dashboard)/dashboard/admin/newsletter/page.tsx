import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { getSubscriberStats, getActiveSubscribers } from '@/features/newsletter/queries'
import { createClient } from '@/lib/supabase/server'
import { NewsletterManagerTable } from '@/components/dashboard/NewsletterManagerTable'

export const metadata: Metadata = {
  title: 'Newsletter Subscribers | Admin Dashboard',
}

export default async function AdminNewsletterPage() {
  const [stats, subscribers] = await Promise.all([
    getSubscriberStats(),
    getActiveSubscribers(),
  ])

  const supabase = await createClient()
  const { data: postsData } = await supabase
    .from('posts')
    .select('id, title')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const publishedPosts = (postsData || []).map((p) => ({ id: p.id, title: p.title }))

  return (
    <div className="p-4 md:p-8 space-y-8 animate-page max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Newsletter Manager</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage active email subscribers, export marketing CSVs, and trigger broadcast campaigns.
          </p>
        </div>
      </div>

      {/* Table & Actions */}
      <NewsletterManagerTable
        initialSubscribers={subscribers}
        stats={stats}
        publishedPosts={publishedPosts}
      />
    </div>
  )
}
