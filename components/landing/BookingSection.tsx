'use client'

import { User, Users, GraduationCap, ArrowRight } from 'lucide-react'

export function BookingSection() {
  return (
    <section id="booking" className="py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Premium Mentorship</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">Book a Personalized Session</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Accelerate your journey with our paid consultation sessions. Tailored to provide maximum impact, whether you are an individual aiming for a top university, or an institution seeking expert seminars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Individual Session */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-xs hover:shadow-lg transition-all group flex flex-col h-full hover:-translate-y-1">
            <div className="w-16 h-16 bg-muted text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">1-on-1 Guidance</h3>
            <p className="text-primary font-semibold text-sm mb-4">For Individual Students • $49/hr</p>
            <p className="text-muted-foreground mb-8 flex-grow">
              Personalized profile evaluation, SOP drafting, interview prep, and direct fellowship application strategy tailored exactly to your academic goals.
            </p>
            <a
              href="mailto:contact@versatilescientist.org?subject=Book 1-on-1 Guidance Session"
              className="w-full py-4 bg-muted text-foreground border border-border rounded-xl font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2"
            >
              Book Session <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Private Coaching */}
          <div className="bg-card rounded-3xl p-8 border-2 border-primary/50 shadow-md transition-all group flex flex-col h-full hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wide">
              Most Popular
            </div>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Group Workshops</h3>
            <p className="text-primary font-semibold text-sm mb-4">For Private Coaching Classes • $199/session</p>
            <p className="text-muted-foreground mb-8 flex-grow">
              Host specialized, interactive group workshops for your coaching center. We cover competitive exam roadmaps, research methodologies, and global opportunity mapping.
            </p>
            <a
              href="mailto:contact@versatilescientist.org?subject=Book Group Workshop"
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Book Workshop <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Universities */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-xs hover:shadow-lg transition-all group flex flex-col h-full hover:-translate-y-1">
            <div className="w-16 h-16 bg-muted text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Institutional Seminars</h3>
            <p className="text-primary font-semibold text-sm mb-4">For Private Colleges & Universities • $499/day</p>
            <p className="text-muted-foreground mb-8 flex-grow">
              Bring industry-leading researchers to your campus (virtual or on-site). Designed to boost student placements in top global PhD and Master&apos;s programs.
            </p>
            <a
              href="mailto:contact@versatilescientist.org?subject=Book Institutional Seminar"
              className="w-full py-4 bg-muted text-foreground border border-border rounded-xl font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2"
            >
              Book Seminar <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
