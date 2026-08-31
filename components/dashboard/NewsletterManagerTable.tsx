'use client'

import { useState, useTransition } from 'react'
import {
  Mail, Users, Send, Download, Search, Trash2, CheckCircle2, UserX, Loader2, Sparkles, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { triggerNewsletterSendNow, deleteSubscriberAction } from '@/features/newsletter/actions'
import type { NewsletterSubscription, SubscriberStats } from '@/features/newsletter/types'

interface NewsletterManagerTableProps {
  initialSubscribers: NewsletterSubscription[]
  stats: SubscriberStats
  publishedPosts: { id: string; title: string }[]
}

export function NewsletterManagerTable({
  initialSubscribers,
  stats,
  publishedPosts,
}: NewsletterManagerTableProps) {
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>(initialSubscribers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPostId, setSelectedPostId] = useState('')
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleExportCsv = () => {
    const activeEmails = subscribers
      .filter((s) => !s.unsubscribed_at)
      .map((s) => `${s.email},${s.subscribed_at}`)

    const csvContent = 'data:text/csv;charset=utf-8,Email,Subscribed Date\n' + activeEmails.join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Subscriber CSV exported successfully!')
  }

  const handleDeleteSubscriber = (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from subscribers?`)) return

    startTransition(async () => {
      const res = await deleteSubscriberAction(email)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Removed ${email}`)
        setSubscribers((prev) => prev.filter((s) => s.email !== email))
      }
    })
  }

  const handleSendBroadcast = () => {
    if (!selectedPostId) {
      toast.error('Please select a post to broadcast')
      return
    }

    startTransition(async () => {
      const res = await triggerNewsletterSendNow(selectedPostId)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Newsletter broadcast queued successfully!')
        setBroadcastModalOpen(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Stats Header Cards ────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-card p-5 rounded-2xl border border-border/70 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Subscribers</p>
            <p className="text-3xl font-bold tracking-tight text-foreground mt-1">{stats.active}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-border/70 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dispatched Emails</p>
            <p className="text-3xl font-bold tracking-tight text-foreground mt-1">{stats.sends_dispatched}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-border/70 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unsubscribed</p>
            <p className="text-3xl font-bold tracking-tight text-foreground mt-1">{stats.unsubscribed}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Search & Actions Bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            type="text"
            placeholder="Search subscriber emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm bg-background border-border/80"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportCsv}
            className="h-9 text-xs font-semibold border-border/80 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>

          <Button
            type="button"
            onClick={() => setBroadcastModalOpen(true)}
            className="h-9 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" /> Broadcast Newsletter
          </Button>
        </div>
      </div>

      {/* ── Subscribers Table ─────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border/70 shadow-xs overflow-hidden">
        {filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Mail className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No subscribers found</p>
            <p className="text-xs text-muted-foreground">New readers who subscribe via the newsletter form will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Subscriber Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Subscribed Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSubscribers.map((sub) => {
                  const isUnsubscribed = Boolean(sub.unsubscribed_at)
                  return (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                        {sub.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {isUnsubscribed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Unsubscribed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {new Date(sub.subscribed_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() => handleDeleteSubscriber(sub.email)}
                          className="h-7 px-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Broadcast Newsletter Modal ────────────────────────────── */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">Queue Newsletter Broadcast</h3>
              </div>
              <button
                type="button"
                onClick={() => setBroadcastModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Select a published post to send out as an email campaign to all <strong>{stats.active} active subscribers</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Select Article</label>
              <select
                value={selectedPostId}
                onChange={(e) => setSelectedPostId(e.target.value)}
                className="w-full h-9 text-xs rounded-xl border border-border bg-background px-3 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Choose a published article...</option>
                {publishedPosts.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBroadcastModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPending || !selectedPostId}
                onClick={handleSendBroadcast}
                className="text-xs bg-primary text-primary-foreground font-semibold px-4"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Send Broadcast
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
