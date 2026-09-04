'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Briefcase, GraduationCap, Calendar, Award, BookOpen, User, ArrowRight, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react'

const navLinks = [
  { label: 'Jobs', href: '/blog/category/jobs', icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
  { label: 'Internships', href: '/blog/category/internships', icon: GraduationCap, color: 'text-sky-600 bg-sky-50' },
  { label: 'Workshops', href: '/blog/category/workshops', icon: Calendar, color: 'text-indigo-600 bg-indigo-50' },
  { label: 'Scholarships', href: '/blog/category/scholarships', icon: Award, color: 'text-amber-600 bg-amber-50' },
  { label: 'Articles', href: '/blog', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track auth session for mobile drawer
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const name = session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User'
        const email = session.user.email ?? ''
        supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle().then(({ data }) => {
          setUser({ name, email, role: data?.role ?? 'user' })
        })
      } else {
        setUser(null)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User'
        const email = session.user.email ?? ''
        supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle().then(({ data }) => {
          setUser({ name, email, role: data?.role ?? 'user' })
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Click outside & Escape key listener to close menu immediately
  useEffect(() => {
    if (!open) return

    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    window.location.href = '/'
  }

  return (
    <div ref={containerRef} className="md:hidden flex items-center shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl border border-[#1d4ed8]/20 bg-white text-[#07163d] hover:bg-[#eff6ff] hover:text-[#1d4ed8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 shadow-xs flex items-center justify-center relative z-50"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
      >
        {open ? <X className="w-5 h-5 text-[#07163d]" /> : <Menu className="w-5 h-5 text-[#07163d]" />}
      </button>

      {/* Backdrop overlay (Full screen) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#07163d]/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-[65px] inset-x-0 z-50 bg-white border-b border-[#1d4ed8]/15 shadow-2xl transition-all duration-300 ease-in-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto max-h-[calc(100vh-70px)] overflow-y-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-5 space-y-5">
          
          {/* Navigation Category Links */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#64748b] px-3 pb-1">
              Explore Opportunities
            </p>
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#eff6ff] text-[#1d4ed8] border border-[#1d4ed8]/20 shadow-xs'
                      : 'text-[#334155] hover:bg-slate-50 hover:text-[#1d4ed8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
              )
            })}
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <Link
              href="/#about"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#334155] hover:bg-white hover:border-[#1d4ed8]/30 transition-all"
            >
              <User className="w-3.5 h-3.5 text-[#1d4ed8]" />
              About Us
            </Link>
            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#334155] hover:bg-white hover:border-[#1d4ed8]/30 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#1d4ed8]" />
              All Articles
            </Link>
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-3 bg-[#f8fbff] p-3.5 rounded-xl border border-[#dbeafe]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-[#07163d]">{user.name}</p>
                    <p className="text-[11px] text-[#64748b] truncate max-w-[220px]">{user.email}</p>
                  </div>
                  {(user.role === 'admin' || user.role === 'author') && (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-[#1d4ed8] text-white flex items-center gap-1"
                    >
                      <LayoutDashboard className="w-3 h-3" /> Dashboard
                    </Link>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full py-2 bg-white text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#334155] hover:border-[#1d4ed8] transition-all text-center"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#1d4ed8]" /> Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1d4ed8] text-white text-xs font-bold shadow-sm hover:bg-[#0b1f4d] transition-all text-center"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Create Account
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
