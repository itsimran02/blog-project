'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  MessageSquare, Trash2, Reply, Search, ExternalLink, Loader2, MessageCircle, FileText, User,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteComment, replyToComment } from '@/features/comments/actions'
import type { CommentWithAuthorAndPost } from '@/features/comments/types'

interface CommentModerationTableProps {
  initialComments: CommentWithAuthorAndPost[]
}

export function CommentModerationTable({ initialComments }: CommentModerationTableProps) {
  const [comments, setComments] = useState<CommentWithAuthorAndPost[]>(initialComments)
  const [searchQuery, setSearchQuery] = useState('')
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const filteredComments = comments.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      c.content.toLowerCase().includes(q) ||
      (c.author?.full_name || '').toLowerCase().includes(q) ||
      (c.post?.title || '').toLowerCase().includes(q)
    )
  })

  const handleDelete = (commentId: string, postSlug?: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    startTransition(async () => {
      const res = await deleteComment(commentId, postSlug)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Comment deleted')
        setComments((prev) => prev.filter((c) => c.id !== commentId))
      }
    })
  }

  const handleSendReply = (parentComment: CommentWithAuthorAndPost) => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty')
      return
    }

    startTransition(async () => {
      const res = await replyToComment(parentComment.post_id, replyContent, parentComment.post?.slug)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Reply published to article!')
        setReplyingCommentId(null)
        setReplyContent('')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            type="text"
            placeholder="Search comments by reader, text, or post..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm bg-background border-border/80"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-xl border border-border/50">
            <MessageSquare className="w-3.5 h-3.5 text-primary" /> {comments.length} Total Comments
          </span>
        </div>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/70 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No comments found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {searchQuery ? 'No comments match your search criteria.' : 'Reader comments on your blog posts will appear here for moderation.'}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border/70 shadow-xs overflow-hidden divide-y divide-border/60">
          {filteredComments.map((comment) => {
            const authorName = comment.author?.full_name || 'Anonymous Reader'
            const avatarUrl = comment.author?.avatar_url
            const postTitle = comment.post?.title || 'Untitled Post'
            const postSlug = comment.post?.slug
            const isReplying = replyingCommentId === comment.id

            return (
              <div key={comment.id} className="p-5 space-y-3 hover:bg-muted/10 transition-colors">
                {/* Header row: Author info & Article info */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={authorName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-tight">{authorName}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(comment.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Article Link Badge */}
                  {postSlug && (
                    <Link
                      href={`/blog/${postSlug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span className="max-w-[200px] truncate">{postTitle}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground/60" />
                    </Link>
                  )}
                </div>

                {/* Comment Content */}
                <div className="pl-12">
                  <p className="text-sm text-foreground/90 leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/40">
                    {comment.content}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pl-12 flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setReplyingCommentId(isReplying ? null : comment.id)}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Reply className="w-3.5 h-3.5 mr-1 text-primary" /> Reply
                    </Button>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => handleDelete(comment.id, postSlug)}
                    className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>

                {/* Inline Reply Form */}
                {isReplying && (
                  <div className="pl-12 pt-2 space-y-2">
                    <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-2">
                      <p className="text-xs font-semibold text-foreground">Post official reply as Author:</p>
                      <textarea
                        rows={2}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your response to this reader..."
                        className="w-full text-xs p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setReplyingCommentId(null)}
                          className="h-7 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleSendReply(comment)}
                          className="h-7 text-xs bg-primary text-primary-foreground font-semibold px-4"
                        >
                          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
