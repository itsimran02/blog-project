import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required for @supabase/ssr
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Helper: build a redirect that carries any auth cookie updates from supabaseResponse.
  function redirectWithCookies(destination: string): NextResponse {
    const url = request.nextUrl.clone()
    url.pathname = destination
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  // ── /mfa page ──────────────────────────────────────────────────────────────
  if (pathname === '/mfa') {
    if (!user) return redirectWithCookies('/login')

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.currentLevel === 'aal2') return redirectWithCookies('/dashboard')

    return supabaseResponse
  }

  // ── /dashboard routes ──────────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    if (!user) return redirectWithCookies('/login')

    // Enforce MFA for users who have it enrolled.
    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aalError || (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2')) {
      return redirectWithCookies('/mfa')
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profileData as { role?: string } | null)?.role

    // Protect /dashboard/admin — require admin role
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return redirectWithCookies('/dashboard')
    }

    // Allow /dashboard/profile for updating display profile for comments
    if (pathname === '/dashboard/profile') {
      return supabaseResponse
    }

    // Restrict all other management dashboard routes (/dashboard, /dashboard/posts, etc.)
    // Regular users (role 'user' or member) are redirected to /blog so they can read and comment
    if (role !== 'admin' && role !== 'author') {
      return redirectWithCookies('/blog')
    }
  }

  // ── Redirect logged-in users away from auth pages ─────────────────────────
  if (user && (pathname === '/login' || pathname === '/register')) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profileData as { role?: string } | null)?.role
    if (role === 'admin' || role === 'author') {
      return redirectWithCookies('/dashboard')
    }
    return redirectWithCookies('/blog')
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/mfa',
  ],
}
