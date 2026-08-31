'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { can } from '@/lib/permissions'
import type { Role } from '@/lib/permissions'
import { getProfile } from '@/lib/auth/session'

export async function updateUserRole(userId: string, role: 'author' | 'user') {
  const profile = await getProfile()
  if (!profile || !can(profile.role as Role, 'users:update')) {
    return { error: 'Unauthorized' }
  }

  // Enforce strict security rule: Admin role can ONLY be assigned manually in the database
  if ((role as string) === 'admin') {
    return { error: 'Admin role can only be assigned directly in the database.' }
  }

  if (role !== 'author' && role !== 'user') {
    return { error: 'Invalid role specified.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
}
