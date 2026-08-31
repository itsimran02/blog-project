'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth/session'
import { uploadFile, deleteFile, listFolder } from '@/lib/storage'
import type { ProfileFormData, SocialLinksFormData } from './types'

export async function updateProfile(data: Partial<{ [K in keyof (ProfileFormData & SocialLinksFormData)]: string | null }>) {
  const profile = await getProfile()
  if (!profile) return { error: 'Unauthorized' }

  const ALLOWED_PROFILE_KEYS = new Set([
    'full_name', 'pronouns', 'bio', 'company', 'location', 'website',
    'twitter_url', 'linkedin_url', 'github_url', 'instagram_url',
    'facebook_url', 'youtube_url', 'tiktok_url',
  ])

  const safeData = Object.fromEntries(
    Object.entries(data).filter(([k]) => ALLOWED_PROFILE_KEYS.has(k))
  )

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update(safeData)
    .eq('id', profile.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function updateAvatar(formData: FormData) {
  const profile = await getProfile()
  if (!profile) return { error: 'Unauthorized' }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return { error: 'No file provided' }
  if (file.size > 2 * 1024 * 1024) return { error: 'File too large (max 2 MB)' }

  const ALLOWED_TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
  }

  if (!ALLOWED_TYPES[file.type]) return { error: 'Invalid file type. Use JPG, PNG, or GIF.' }
  const ext = ALLOWED_TYPES[file.type]
  const key = `${profile.id}/avatar.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { publicUrl, error: uploadError } = await uploadFile({
    bucket: 'avatars',
    key,
    fileBuffer: buffer,
    contentType: file.type,
  })

  if (uploadError || !publicUrl) return { error: uploadError || 'Upload failed' }

  const supabase = await createClient()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', profile.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/dashboard/profile')
  return { success: true, avatar_url: publicUrl }
}

export async function deleteAvatar() {
  const profile = await getProfile()
  if (!profile) return { error: 'Unauthorized' }

  if (!profile.avatar_url) return { success: true }

  const { files, error: listError } = await listFolder({ bucket: 'avatars', prefix: profile.id })
  if (listError) return { error: listError }

  if (files && files.length > 0) {
    for (const filePath of files) {
      // Remove prefix if returned as relative path
      const key = filePath.startsWith(`${profile.id}/`) ? filePath : `${profile.id}/${filePath.split('/').pop()}`
      const { error: removeError } = await deleteFile({ bucket: 'avatars', key })
      if (removeError) return { error: removeError }
    }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', profile.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const profile = await getProfile()
  if (!profile) return { error: 'Unauthorized' }

  // Use a stateless client (no cookie writes) to verify the current password
  // so re-authentication does not mutate the caller's session cookies.
  const anonClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { error: signInError } = await anonClient.auth.signInWithPassword({
    email: profile.email,
    password: currentPassword,
  })
  if (signInError) {
    // Use structured error code to distinguish credential failures from
    // infrastructure/rate-limit errors, avoiding brittle string matching.
    const isInvalidCredentials =
      signInError.code === 'invalid_credentials' ||
      (signInError.code == null && signInError.status === 400)
    return { error: isInvalidCredentials ? 'Current password is incorrect' : signInError.message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }

  return { success: true }
}
