'use client'

import { ArrowRight, Building2, GraduationCap, UserRoundCheck } from 'lucide-react'

const pathways = [
  {
    title: 'Student Guidance',
    audience: 'For individual students',
    text: 'Profile review, exam setbacks, research direction, SOP clarity, and step-by-step planning for Masters, PhD, internships, and fellowships.',
    subject: 'Student guidance request',
    icon: UserRoundCheck,
  },
  {
    title: 'Career Camp Sessions',
    audience: 'For colleges and local communities',
    text: 'High-signal talks inspired by Gaav Te Global: research careers, global pathways, application roadmaps, and opportunity literacy.',
    subject: 'Career camp or college session',
    icon: GraduationCap,
  },
  {
    title: 'Institutional Outreach',
    audience: 'For universities and education partners',
    text: 'Custom seminars, bilingual student resources, career brochures, and long-term partnership formats for rural and semi-urban learners.',
    subject: 'Institutional outreach partnership',
    icon: Building2,
  },
]

export function BookingSection() {
  return (
    <section id="booking" className="relative isolate overflow-hidden border-t border-[#1d4ed8]/15 bg-[#eef6ff] py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#eef6ff_0%,#ffffff_52%,#dbeafe_100%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="inline-flex border border-[#1d4ed8]/15 bg-white px-3 py-2 text-sm font-black uppercase tracking-[0.25em] text-[#1d4ed8] shadow-[0_12px_30px_rgba(29,78,216,0.08)]">
              Mentorship Pathways
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#07163d] sm:text-5xl">
              Bring verified career guidance to the exact room that needs it.
            </h2>
          </div>
          <p className="border-l-4 border-[#38bdf8] bg-white/80 p-5 text-lg font-medium leading-8 text-[#475569] shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
            From one student trying to choose the next exam to a college planning a full research-career session,
            Versatile Scientist turns experience into practical direction.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon
            return (
              <article
                key={pathway.title}
                className="group flex min-h-[390px] flex-col border border-[#1d4ed8]/15 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#1d4ed8]/30 hover:shadow-[0_30px_80px_rgba(29,78,216,0.14)]"
              >
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center border border-[#93c5fd] bg-[#eff6ff] transition group-hover:bg-[#1d4ed8]">
                    <Icon className="h-8 w-8 text-[#1d4ed8] transition group-hover:text-white" />
                  </div>
                  <span className="font-mono text-sm font-black text-[#1d4ed8]/30">0{index + 1}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0369a1]">{pathway.audience}</p>
                <h3 className="mt-3 text-2xl font-black text-[#07163d]">{pathway.title}</h3>
                <p className="mt-4 flex-1 text-base leading-7 text-[#475569]">{pathway.text}</p>
                <a
                  href={`mailto:contact@versatilescientist.org?subject=${encodeURIComponent(pathway.subject)}`}
                  className="mt-8 inline-flex items-center justify-center gap-2 border border-[#1d4ed8] bg-[#1d4ed8] px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_34px_rgba(29,78,216,0.22)] transition hover:-translate-y-0.5 hover:bg-[#07163d]"
                >
                  Start the conversation <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
