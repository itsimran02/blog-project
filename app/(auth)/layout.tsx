import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-[#07163d]">
      
      {/* Left Column: Form & Navigation (Full Height) */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen bg-white">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[2px_2px_0_#93c5fd] border border-[#1d4ed8]/20 bg-white group-hover:scale-105 transition-transform">
              <Image
                src="/logo.jpg"
                alt="Versatile Scientist Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#07163d]">
              Versatile <span className="text-[#1d4ed8] font-black">Scientist</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#1d4ed8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>

        {/* Center: Auth Form Component */}
        <div className="my-auto py-8 w-full max-w-md mx-auto">
          {children}
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748b] font-medium">
          <p>&copy; {new Date().getFullYear()} Versatile Scientist.</p>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-[#1d4ed8] transition-colors">Articles</Link>
            <Link href="/blog/category/jobs" className="hover:text-[#1d4ed8] transition-colors">Jobs</Link>
            <Link href="/privacy-policy" className="hover:text-[#1d4ed8] transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>

      {/* Right Column: Editorial Visual Panel (Full-Bleed 100vh) */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-[#07163d] text-white flex-col justify-between p-12 xl:p-16 overflow-hidden border-l border-[#1d4ed8]/15">
        
        {/* Background Visual with Real Photo and Dark Cinematic Gradients */}
        <img
          src="/the-man.jpeg"
          alt="Dr. Namdev Shivaji Togre - Versatile Scientist"
          className="absolute inset-0 w-full h-full object-cover opacity-25 filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07163d] via-[#07163d]/85 to-[#0b1f4d]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.18),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(29,78,216,0.25),transparent_50%)]" />

        {/* Center: Editorial Manifesto */}
        <div className="relative z-10 max-w-2xl space-y-6 my-auto py-12">
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.08] text-white">
            Every rural student deserves a clear roadmap into science.
          </h2>
          <p className="text-lg text-white/80 leading-relaxed font-medium">
            Bridging the gap between village classrooms and global research laboratories. Practical, jargon-free guidance for scholars worldwide.
          </p>

          {/* Dr. Namdev Togre Bio Card */}
          <div className="p-5 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-md shadow-2xl flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#38bdf8]/40 shrink-0 bg-white/10">
              <img
                src="/the-man.jpeg"
                alt="Dr. Namdev Shivaji Togre"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <p className="text-base font-black text-white">Dr. Namdev Shivaji Togre</p>
              <p className="text-xs text-[#7dd3fc] font-bold">Postdoctoral Researcher &bull; Penn State University</p>
              <p className="text-xs text-white/70 mt-1 font-medium italic">
                From Jalkot village to Penn State, mentoring the next generation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Key Pillars */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/15">
          <div className="space-y-1">
            <p className="text-2xl font-black text-[#7dd3fc]">26+</p>
            <p className="text-xs font-bold text-white/75 uppercase tracking-wider">Publications</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-[#7dd3fc]">500K+</p>
            <p className="text-xs font-bold text-white/75 uppercase tracking-wider">Community Reach</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-[#7dd3fc]">Gaav Te Global</p>
            <p className="text-xs font-bold text-white/75 uppercase tracking-wider">Career Camps</p>
          </div>
        </div>

      </div>

    </div>
  )
}
