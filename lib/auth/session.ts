import * as React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { can } from '@/lib/permissions'
import type { Permission, Role } from '@/lib/permissions'
import type { Profile } from '@/lib/supabase/types'

const cacheFn = typeof React.cache === 'function' ? React.cache : (fn: any) => fn

/**
 * Returns the current user's full profile, or null if not authenticated.
 * Wrapped with React cache() when available to deduplicate requests within the same server render.
 */
export const getProfile = cacheFn(async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
})

/**
 * Returns the current user's profile or redirects to /login.
 * Use this in pages and layouts that require authentication.
 */
export async function requireAuth(): Promise<Profile> {
  const profile = await getProfile()
  if (!profile) redirect('/login')
  return profile
}

/**
 * Returns the current user's profile if they have the given permission,
 * redirects to /login if not authenticated, or to /dashboard if unauthorized.
 * Use this in pages and actions that require a specific role/permission.
 */
export async function requirePermission(permission: Permission): Promise<Profile> {
  const profile = await requireAuth()
  if (!can(profile.role as Role, permission)) redirect('/dashboard')
  return profile
}
