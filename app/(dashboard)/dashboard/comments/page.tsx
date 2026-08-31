import type { Metadata } from 'next'
import { MessageSquare } from 'lucide-react'
import { getAllCommentsForDashboard } from '@/features/comments/queries'
import { CommentModerationTable } from '@/components/dashboard/CommentModerationTable'

export const metadata: Metadata = {
  title: 'Comments Moderation | Dashboard',
}

export default async function CommentsDashboardPage() {
  const comments = await getAllCommentsForDashboard()

  return (
    <div className="p-4 md:p-8 space-y-8 animate-page max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Comment Moderation</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Review, reply, and moderate reader comments across all published articles.
          </p>
        </div>
      </div>

      {/* Moderation Table */}
      <CommentModerationTable initialComments={comments} />
    </div>
  )
}
