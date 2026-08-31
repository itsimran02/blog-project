'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  // Server-side password strength validation
  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const data = {
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  }

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

  const { data: authData, error } = await supabase.auth.signUp({
    ...data,
    options: {
      ...data.options,
      emailRedirectTo: new URL('/auth/callback', baseUrl).toString(),
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If no session, email confirmation is required
  if (!authData.session) {
    return { needsConfirmation: true }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
