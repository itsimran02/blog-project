'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  FolderOpen,
  Tag,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Loader2,
  Code,
  UserCircle,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { can } from '@/lib/permissions'
import type { Role } from '@/lib/permissions'
import type { Profile } from '@/lib/supabase/types'

interface SidebarProps {
  readonly profile: Profile
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const role = profile.role as Role
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Close drawer on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  function handleLogout() {
    startTransition(async () => {
      try {
        await fetch('/api/auth/signout', { method: 'POST' })
      } finally {
        globalThis.location.href = '/login'
      }
    })
  }

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', show: true, section: 'main' as const },
    { href: '/dashboard/posts', icon: FileText, label: 'Articles & Posts', show: true, section: 'main' as const },
    { href: '/dashboard/posts/new', icon: PlusCircle, label: 'Write New Post', show: true, section: 'main' as const, isNew: true },
    { href: '/dashboard/comments', icon: MessageSquare, label: 'Comments', show: can(role, 'posts:create'), section: 'main' as const },
    { href: '/dashboard/profile', icon: UserCircle, label: 'Account Profile', show: true, section: 'main' as const },
    { href: '/dashboard/developer', icon: Code, label: 'API & Developer', show: can(role, 'api_keys:write'), section: 'main' as const },
    { href: '/dashboard/admin/users', icon: Users, label: 'User Directory', show: can(role, 'users:read'), section: 'admin' as const },
    { href: '/dashboard/admin/categories', icon: FolderOpen, label: 'Categories', show: can(role, 'categories:write'), section: 'admin' as const },
    { href: '/dashboard/admin/tags', icon: Tag, label: 'Tags & Topics', show: can(role, 'tags:write'), section: 'admin' as const },
    { href: '/dashboard/admin/newsletter', icon: Mail, label: 'Newsletter', show: can(role, 'users:read'), section: 'admin' as const },
  ]

  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase()

  const mainItems = navItems.filter((item) => item.show && item.section === 'main')
  const adminItems = navItems.filter((item) => item.show && item.section === 'admin')

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-[#38bdf8]/40 shadow-sm shrink-0">
            <Image
              src="/logo.jpg"
              alt="Versatile Scientist"
              width={36}
              height={36}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-base tracking-tight leading-none">
              Versatile <span className="text-[#38bdf8]">Scientist</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#93c5fd]/70 uppercase mt-1">
              Editorial Console
            </span>
          </div>
        </Link>
        <button
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Editorial Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#93c5fd]/60 mb-2">
            Content & Publishing
          </p>
          {mainItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors',
                  isActive
                    ? 'bg-[#1d4ed8] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.isNew && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#38bdf8]/20 text-[#7dd3fc] border border-[#38bdf8]/30 px-1.5 py-0.5 rounded">
                    Create
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Administration Section */}
        {adminItems.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-white/5">
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#93c5fd]/60 mb-2">
              Administration
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors',
                    isActive
                      ? 'bg-[#1d4ed8] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Footer Controls & User profile */}
      <div className="p-3 border-t border-white/10 bg-black/20 space-y-2">
        {/* Quick Link to Live Website */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/5"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Website
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        {/* User Info */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
        >
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name ?? profile.email}
              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/20"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1d4ed8] text-white text-xs font-black shrink-0 border border-white/20">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-[#38bdf8] transition-colors">
              {profile.full_name ?? profile.email}
            </p>
            <p className="text-[10px] font-semibold text-[#93c5fd]/70 capitalize tracking-wider mt-0.5">
              {profile.role}
            </p>
          </div>
        </Link>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{isPending ? 'Signing out…' : 'Sign out'}</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 bg-[#07163d] border-b border-white/10 shadow-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt="Versatile Scientist"
            width={30}
            height={30}
            className="rounded-lg object-cover shrink-0 border border-[#38bdf8]/40"
          />
          <span className="font-extrabold text-white text-sm tracking-tight">
            Versatile <span className="text-[#38bdf8]">Scientist</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-[#07163d] flex flex-col border-r border-[#1d4ed8]/20 transition-transform duration-200 ease-in-out',
          'md:relative md:translate-x-0 md:z-auto md:h-auto md:min-h-screen shrink-0',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
