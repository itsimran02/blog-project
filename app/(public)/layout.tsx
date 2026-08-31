import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { NavAuthButton } from '@/components/NavAuthButton'
import { HeaderSearch } from '@/components/HeaderSearch'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
      <header className="border-b border-border/60 sticky top-0 z-50 bg-background/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto py-3.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              Versatile <span className="text-primary font-black">Scientist</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors flex items-center gap-1">
              Articles
            </Link>
            <Link href="/#opportunities" className="hover:text-foreground transition-colors">
              Opportunities
            </Link>
            <Link href="/#mentors" className="hover:text-foreground transition-colors">
              Mentors
            </Link>
            <Link href="/#about" className="hover:text-foreground transition-colors">
              About
            </Link>
          </nav>

          {/* Actions: Search & Auth */}
          <div className="flex items-center gap-3">
            <HeaderSearch />
            <NavAuthButton />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-card border-t border-border text-muted-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-foreground">Versatile Scientist</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Empowering students, young researchers, and scholars worldwide with resources, mentorship, and opportunities.
          </p>
          <div className="flex justify-center gap-6 text-sm pt-2 font-medium">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Articles</Link>
            <Link href="/#opportunities" className="hover:text-foreground transition-colors">Opportunities</Link>
            <Link href="/#mentors" className="hover:text-foreground transition-colors">Mentors</Link>
          </div>
          <p className="text-xs text-muted-foreground/70 pt-4 border-t border-border/60">
            &copy; {new Date().getFullYear()} Versatile Scientist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
