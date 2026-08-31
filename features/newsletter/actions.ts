'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { getProfile } from '@/lib/auth/session'
import { can, type Role } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'

export async function scheduleNewsletterSend(postId: string): Promise<void> {
  const parsed = parseInt(process.env.NEWSLETTER_DELAY_MINUTES ?? '', 10)
  const delayMinutes = Number.isFinite(parsed) && parsed >= 0 ? parsed : 60
  const scheduledAt = new Date(Date.now() + delayMinutes * 60 * 1000).toISOString()
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('newsletter_sends')
    .upsert(
      { post_id: postId, scheduled_at: scheduledAt, status: 'pending' },
      { onConflict: 'post_id', ignoreDuplicates: true }
    )
  if (error) {
    console.error('[scheduleNewsletterSend] DB error:', error.message)
    throw new Error(`[scheduleNewsletterSend] DB error: ${error.message}`)
  }
}

export async function triggerNewsletterSendNow(postId: string) {
  const profile = await getProfile()
  if (!profile || !can(profile.role as Role, 'users:read')) {
    return { error: 'Unauthorized' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('newsletter_sends')
    .upsert(
      { post_id: postId, scheduled_at: new Date().toISOString(), status: 'pending' },
      { onConflict: 'post_id' }
    )

  if (error) return { error: error.message }
  revalidatePath('/dashboard/admin/newsletter')
  return { success: true }
}

export async function deleteSubscriberAction(email: string) {
  const profile = await getProfile()
  if (!profile || !can(profile.role as Role, 'users:read')) {
    return { error: 'Unauthorized' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('newsletter_subscriptions')
    .delete()
    .eq('email', email)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/admin/newsletter')
  return { success: true }
}
