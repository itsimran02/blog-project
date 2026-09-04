import Link from 'next/link'
import Image from 'next/image'
import {
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  MessageCircle,
  Youtube,
} from 'lucide-react'
import { NavAuthButton } from '@/components/NavAuthButton'
import { HeaderSearch } from '@/components/HeaderSearch'
import { MobileNav } from '@/components/MobileNav'
import { SubscribeForm } from '@/components/newsletter/SubscribeForm'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Jobs', href: '/blog/category/jobs' },
  { label: 'Internships', href: '/blog/category/internships' },
  { label: 'Workshops', href: '/blog/category/workshops' },
  { label: 'Scholarships', href: '/blog/category/scholarships' },
  { label: 'All Articles', href: '/blog' },
  { label: 'About Us', href: '/#about' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
]

const socialLinks = [
  { label: 'WhatsApp', href: 'https://wa.me/', icon: MessageCircle },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Learning Community', href: '/blog', icon: GraduationCap },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
      <header className="sticky top-0 z-50 border-b border-[#1d4ed8]/10 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto py-3.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity shrink-0">
            <Image
              src="/logo.jpg"
              alt="Versatile Scientist Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl object-cover shadow-[2px_2px_0_#93c5fd]"
              priority
            />
            <span className="font-extrabold text-xl tracking-tight text-[#07163d]">
              Versatile <span className="text-[#1d4ed8] font-black">Scientist</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#475569]">
            <Link href="/blog/category/jobs" className="hover:text-[#1d4ed8] transition-colors">
              Jobs
            </Link>
            <Link href="/blog/category/internships" className="hover:text-[#1d4ed8] transition-colors">
              Internships
            </Link>
            <Link href="/blog/category/workshops" className="hover:text-[#1d4ed8] transition-colors">
              Workshops
            </Link>
            <Link href="/blog/category/scholarships" className="hover:text-[#1d4ed8] transition-colors">
              Scholarships
            </Link>
            <Link href="/blog" className="hover:text-[#1d4ed8] transition-colors">
              Articles
            </Link>
          </nav>

          {/* Actions: Search, Auth & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <HeaderSearch />
            <NavAuthButton />
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[#1d4ed8]/15 bg-white">
        <section className="relative isolate overflow-hidden bg-[#07163d] py-16 text-white">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#07163d_0%,#0b2c67_100%)]" />
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#7dd3fc]">Stay in the loop</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Newsletter Signup</h2>
            <div className="mt-8">
              <SubscribeForm variant="footer" />
            </div>
          </div>
        </section>

        <section className="border-t border-[#e2e8f0] bg-white py-14 text-[#07163d]">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-[1.15fr_1.35fr_0.8fr] lg:px-8">
            <div>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden border-4 border-[#c7d2fe] shadow-[0_0_0_6px_#eef6ff]">
                <Image
                  src="/logo.jpg"
                  alt="Versatile Scientist Logo"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-8 text-2xl font-black">Versatile Scientist</h3>
              <p className="mt-5 max-w-md text-base font-medium leading-8 text-[#64748b]">
                Explore science careers with us. Find jobs, internships, workshops, and scholarships. Empowering
                researchers and students worldwide.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.22em] text-[#0f172a]">Quick Links</h3>
              <div className="mt-4 h-1 w-11 bg-[#2563eb]" />
              <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-5">
                {quickLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-base font-semibold text-[#475569] transition hover:text-[#1d4ed8]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.22em] text-[#0f172a]">Connect With Us</h3>
              <div className="mt-4 h-1 w-11 bg-[#2563eb]" />
              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={social.label}
                    className="flex h-12 w-12 items-center justify-center border border-[#dbe3ef] bg-[#f8fbff] text-[#475569] transition hover:border-[#93c5fd] hover:bg-[#eff6ff] hover:text-[#1d4ed8]"
                  >
                      <Icon className="h-6 w-6" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="border-t border-[#e2e8f0] pt-8 text-center text-sm font-medium leading-7 text-[#64748b]">
              <span className="font-black text-[#475569]">General Disclaimer:</span> Versatile Scientist is an
              educational portal dedicated to providing insights. Our blog posts and videos are based on research and
              experience, intended as an educational guide.
            </p>
            <p className="mt-6 text-center text-base font-black text-[#0f172a]">
              &copy; {new Date().getFullYear()} Versatile Scientist. All rights reserved.
            </p>
          </div>
        </section>
      </footer>
    </div>
  )
}
