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
    <section id="booking" className="border-t border-[#1d4ed8]/15 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#1d4ed8]">Mentorship Pathways</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#07163d] sm:text-5xl">
              Bring verified career guidance to the exact room that needs it.
            </h2>
          </div>
          <p className="text-lg leading-8 text-[#475569]">
            From one student trying to choose the next exam to a college planning a full research-career session,
            Versatile Scientist turns experience into practical direction.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {pathways.map((pathway) => {
            const Icon = pathway.icon
            return (
              <article
                key={pathway.title}
                className="flex min-h-[360px] flex-col border border-[#1d4ed8]/15 bg-[#eff6ff] p-6 shadow-[6px_6px_0_rgba(37,99,235,0.10)] transition hover:-translate-y-1 hover:shadow-[9px_9px_0_rgba(29,78,216,0.22)]"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center border border-[#93c5fd] bg-white">
                  <Icon className="h-7 w-7 text-[#1d4ed8]" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0369a1]">{pathway.audience}</p>
                <h3 className="mt-3 text-2xl font-black text-[#07163d]">{pathway.title}</h3>
                <p className="mt-4 flex-1 text-base leading-7 text-[#475569]">{pathway.text}</p>
                <a
                  href={`mailto:contact@versatilescientist.org?subject=${encodeURIComponent(pathway.subject)}`}
                  className="mt-8 inline-flex items-center justify-center gap-2 border border-[#1d4ed8] bg-[#1d4ed8] px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[5px_5px_0_#93c5fd] transition hover:bg-[#07163d]"
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
