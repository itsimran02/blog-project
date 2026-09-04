'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { LayoutDashboard, LogOut, Loader2 } from 'lucide-react'

const COLORS = [
  '#1d4ed8', '#0284c7', '#0891b2', '#059669',
  '#4f46e5', '#7c3aed', '#2563eb', '#0369a1',
]

function nameToColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % COLORS.length
  }
  return COLORS[hash]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts.at(-1)![0]).toUpperCase()
}

type UserState = { email: string; name: string; role: string } | null | undefined

export function NavAuthButton() {
  const [user, setUser] = useState<UserState>(undefined)
  const [signingOut, setSigningOut] = useState(false)
  const [goingToDashboard, startDashboard] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function loadUser(session: Session | null) {
      if (!session?.user) {
        setUser(null)
        return
      }
      const email = session.user.email ?? ''
      const name =
        session.user.user_metadata?.full_name ??
        session.user.user_metadata?.name ??
        email.split('@')[0]

      let role = 'user'
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()
      if (profile?.role) {
        role = profile.role
      }

      setUser({ email, name, role })
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUser(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (user === undefined) return <div className="w-8 h-8" />

  if (user === null) {
    return (
      <div className="hidden sm:flex items-center gap-2">
        <Link
          href="/login"
          className="text-xs font-black uppercase tracking-wider text-[#475569] hover:text-[#1d4ed8] transition-colors px-2 py-1"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center bg-[#1d4ed8] text-white h-9 px-4 text-xs font-black uppercase tracking-wider rounded-lg shadow-[0_4px_12px_rgba(29,78,216,0.2)] hover:bg-[#0b1f4d] hover:-translate-y-0.5 transition-all"
        >
          Create Account
        </Link>
      </div>
    )
  }

  const isAdminOrAuthor = user.role === 'admin' || user.role === 'author'

  const handleDashboard = () => {
    startDashboard(() => {
      router.push('/dashboard')
    })
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
    setSigningOut(false)
  }

  const initials = getInitials(user.name)
  const color = nameToColor(user.name)
  const busy = signingOut || goingToDashboard

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2 transition-opacity disabled:opacity-50"
        aria-label="Account menu"
        disabled={busy}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: color,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 800,
            color: '#fff',
            userSelect: 'none',
            letterSpacing: '0.05em',
            flexShrink: 0,
            border: '2px solid #eef6ff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            opacity: busy ? 0.5 : 1,
            transition: 'opacity 150ms',
          }}
          aria-hidden="true"
        >
          {busy ? <Loader2 className="size-4 animate-spin" style={{ color: '#fff' }} /> : initials}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-1.5 shadow-xl border-[#dbeafe]">
        <DropdownMenuGroup>
          <div className="px-2 py-2">
            <p className="text-xs font-bold text-[#07163d] truncate">{user.name}</p>
            <p className="text-[11px] text-[#64748b] truncate">{user.email}</p>
          </div>
        </DropdownMenuGroup>
        
        {isAdminOrAuthor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2 font-bold text-[#07163d]"
                onClick={handleDashboard}
                disabled={busy}
              >
                {goingToDashboard ? <Loader2 className="size-4 animate-spin" /> : <LayoutDashboard className="size-4 text-[#1d4ed8]" />}
                Dashboard
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-2 font-bold"
            onClick={handleSignOut}
            disabled={busy}
          >
            {signingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
