import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Microscope,
  Newspaper,
  Quote,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { BookingSection } from '@/components/landing/BookingSection'
import { LatestPostsSection } from '@/components/landing/LatestPostsSection'

const heroImage =
  'https://images.unsplash.com/photo-1762512346988-045f4d5ad2b3?auto=format&fit=crop&q=80&w=1800'
const guidanceImage =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2200'

const impactStats = [
  { value: '26+', label: 'peer-reviewed publications', icon: Microscope },
  { value: '500K+', label: 'students and families reached', icon: Users },
  { value: '20M+', label: 'social reach across platforms', icon: Sparkles },
  { value: '400+', label: 'students at Gaav Te Global', icon: GraduationCap },
]

const proofPoints = ['Bilingual guidance', 'Research-backed roadmaps', 'Rural student access']

const workPillars = [
  {
    title: 'Research',
    text: 'Active work across neuroscience, immunology, infectious disease, neuroinflammation, and blood-brain barrier integrity at Penn State.',
    meta: 'Scientist first',
    icon: Brain,
  },
  {
    title: 'Outreach',
    text: 'Bilingual Marathi and English science guidance for students across rural Maharashtra, shared without paywalls or jargon.',
    meta: 'Knowledge in their language',
    icon: Newspaper,
  },
  {
    title: 'On-the-Ground Impact',
    text: 'Gaav Te Global Career Camp 2026 brought 400+ students, 14 speakers, college partners, brochures, and public career roadmaps together in Kannad.',
    meta: 'From village halls to global labs',
    icon: Landmark,
  },
]

const testimonials = [
  {
    name: 'Amit Kulkarni',
    role: 'Student',
    quote:
      'A truly versatile scientist with a rare gift for breaking complex concepts into something simple and clear. Learning from him made even the toughest topics feel approachable.',
  },
  {
    name: 'Tushar Jadhav',
    role: 'Student',
    quote:
      'Dr. Togre Sir gave the constant motivation that kept me going from a setback at NIT to securing M.Tech in Biomedical Devices at IIT Bhilai.',
  },
  {
    name: 'Arun Dushing',
    role: 'Parent',
    quote:
      'Sir guided my daughter with such care. She completed her M.Sc. from Imperial College London and later received a PhD offer from the University of Wyoming.',
  },
  {
    name: 'Sneha Deshmukh',
    role: 'Student',
    quote:
      "Sir's visual infographics change the way learning happens. Complex ideas become clear, engaging, and much easier to remember.",
  },
]

export default function HomePage() {
  return (
    <div className="animate-page bg-[#f7fbff] text-[#0b1220]">
      <section className="relative isolate overflow-hidden border-b border-[#1d4ed8]/15 bg-[#f7fbff]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,rgba(56,189,248,0.16),transparent_32%),linear-gradient(135deg,#f7fbff_0%,#eef6ff_60%,#dbeafe_100%)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[54%] opacity-[0.08] [background-image:linear-gradient(#1d4ed8_1px,transparent_1px),linear-gradient(90deg,#1d4ed8_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl grid-cols-1 items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 border border-[#1d4ed8]/20 bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#1d4ed8] shadow-[0_10px_30px_rgba(29,78,216,0.08)]">
              <ShieldCheck className="h-4 w-4" />
              Research Meets Mentorship
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.94] tracking-tight text-[#07163d] sm:text-6xl lg:text-7xl">
              Every rural student deserves a clear route into science.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#334155] sm:text-xl">
              Versatile Scientist turns Dr. Namdev Shivaji Togre&apos;s research journey from Jalkot to Penn State
              into practical, bilingual guidance for students who are talented, ambitious, and too often left without
              a map.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {proofPoints.map((point) => (
                <span
                  key={point}
                  className="border border-[#1d4ed8]/15 bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0b1f4d]"
                >
                  {point}
                </span>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 bg-[#1d4ed8] px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_30px_rgba(29,78,216,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0b1f4d]"
              >
                <Briefcase className="h-4 w-4" />
                Explore Jobs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog/category/internships"
                className="inline-flex items-center justify-center gap-2 border border-[#1d4ed8]/30 bg-white px-6 py-4 text-sm font-black uppercase tracking-wide text-[#0b1f4d] transition hover:border-[#1d4ed8] hover:bg-[#dbeafe]"
              >
                <GraduationCap className="h-4 w-4 text-[#1d4ed8]" />
                Internships
              </Link>
            </div>
          </div>

          <div className="relative min-h-[560px] overflow-hidden border border-[#1d4ed8]/20 bg-[#081a3f] shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
            <img src={heroImage} alt="Students studying together in a library" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(7,22,61,0.36)_0%,rgba(7,22,61,0.08)_48%,rgba(37,99,235,0.16)_100%)]" />
            <div className="absolute inset-4 border border-white/20" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#1d4ed8]/15 bg-[#07163d] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {impactStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="relative bg-[#07163d] px-3 py-8 transition hover:bg-[#0b1f4d] sm:px-6">
                <Icon className="mb-5 h-7 w-7 text-[#7dd3fc]" />
                <p className="text-4xl font-black tracking-tight sm:text-5xl">{stat.value}</p>
                <p className="mt-2 max-w-40 text-sm font-semibold leading-5 text-white/70">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-white py-24" id="opportunities">
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-[44%] bg-[#f0f7ff] lg:block" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#1d4ed8]">Our Work</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#07163d] sm:text-5xl">
                Credibility in the lab. Clarity in the classroom.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                The platform does not speak from the sidelines. It turns active research experience into practical
                mentorship, career roadmaps, and opportunity awareness for students who deserve better access.
              </p>
              <div className="mt-8 border-l-4 border-[#38bdf8] bg-[#eef6ff] p-5 text-base font-black leading-7 text-[#07163d]">
                Science is hard enough. Finding the next step should not be.
              </div>
            </div>
            <div className="grid gap-5">
              {workPillars.map((pillar, index) => {
                const Icon = pillar.icon
                return (
                  <article
                    key={pillar.title}
                    className="group grid gap-5 border border-[#1d4ed8]/15 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#1d4ed8]/30 hover:shadow-[0_24px_60px_rgba(29,78,216,0.12)] sm:grid-cols-[88px_1fr]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center border border-[#93c5fd] bg-[#eff6ff] text-[#1d4ed8] transition group-hover:border-[#1d4ed8] group-hover:bg-[#1d4ed8] group-hover:text-white">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-sm font-black text-[#0369a1]">0{index + 1}</span>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563eb]">{pillar.meta}</p>
                      </div>
                      <h3 className="mt-2 text-2xl font-black text-[#07163d]">{pillar.title}</h3>
                      <p className="mt-2 max-w-3xl text-base leading-7 text-[#475569]">{pillar.text}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <LatestPostsSection />

      <section className="relative isolate overflow-hidden bg-[#07163d] py-24 text-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#07163d_0%,#09265c_100%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#7dd3fc]">Success Stories</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Guidance that changes the next application, the next degree, the next country.
              </h2>
            </div>
            <div className="flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white/75 backdrop-blur">
              <CheckCircle2 className="h-5 w-5 text-[#7dd3fc]" />
              Real student and parent outcomes
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((story) => (
              <figure key={story.name} className="border border-white/15 bg-white/[0.07] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:bg-white/[0.11]">
                <Quote className="h-8 w-8 text-[#7dd3fc]" />
                <blockquote className="mt-5 text-lg font-semibold leading-8 text-white/90">{story.quote}</blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-black text-white">{story.name}</p>
                  <p className="text-sm font-semibold text-[#7dd3fc]">{story.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative isolate overflow-hidden bg-white py-24">
        <div className="absolute inset-y-0 left-0 -z-10 hidden w-[40%] bg-[#eef6ff] lg:block" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="relative border border-[#1d4ed8]/20 bg-white p-4 shadow-[0_28px_70px_rgba(15,23,42,0.16)]">
            <img src='/the-man.jpeg'  alt="Dr. Namdev Shivaji Togre" className="aspect-[5/6] w-full object-cover" />
            <div className="absolute -right-4 bottom-8 max-w-56 border border-[#1d4ed8]/20 bg-white p-4 text-sm font-black leading-6 text-[#07163d] shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
              Jalkot village to Penn State, translated into roadmaps for students.
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0369a1]">The Man Behind</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#07163d] sm:text-5xl">
              A first-generation learner building the platform he wished existed.
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-[#475569]">
              <p>
                Dr. Namdev Shivaji Togre is a biochemist and interdisciplinary researcher specializing in
                neuroimmunology, brain research, and environmental neurotoxicology. Born and raised in Jalkot village,
                Latur District, Maharashtra, his path led from Marathwada to a postdoctoral research position at Penn
                State University after earning his Ph.D. from RTM Nagpur University.
              </p>
              <p>
                His journey is the clearest proof of what Versatile Scientist stands for: no student should miss an
                opportunity simply because they did not know it existed.
              </p>
            </div>
            <blockquote className="mt-8 border-l-4 border-[#38bdf8] bg-[#eef6ff] p-5 text-xl font-black leading-8 text-[#07163d]">
              I travelled the path from Jalkot village to Penn State University. My goal is to make sure every student
              who deserves that path knows exactly how to walk it.
            </blockquote>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Penn State researcher', '500K+ followers', 'Marathi/English guidance'].map((item) => (
                <div key={item} className="border border-[#1d4ed8]/15 bg-[#eff6ff] px-4 py-3 text-sm font-black text-[#07163d]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#07163d] text-white">
        <img
          src={guidanceImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-30 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(7,22,61,0.97)_0%,rgba(7,22,61,0.88)_48%,rgba(7,22,61,0.72)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(56,189,248,0.12),transparent_40%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex h-16 w-16 items-center justify-center border border-white/25 bg-white/15 shadow-[8px_8px_0_rgba(125,211,252,0.18)] backdrop-blur-md">
              <Route className="h-8 w-8 text-[#7dd3fc]" />
            </div>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.25em] text-[#7dd3fc]">
              Guidance after confusion
            </p>
            <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
              For the student asking, &quot;What now?&quot;
            </h2>
            <p className="mt-6 max-w-lg text-lg font-semibold leading-8 text-white/75">
              Clear next steps, real opportunities, and research pathways explained before doubt becomes delay.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Scholarships', 'Research paths', 'Career camps'].map((item) => (
                <span
                key={item}
                  className="border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/90"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Scholarship and fellowship awareness before deadlines disappear.',
              'Research career explanations without gatekeeping language.',
              'Visual infographics that make hard science easier to remember.',
              'Career camps, college partnerships, and public roadmaps for rural students.',
            ].map((item, index) => (
              <div
                key={item}
                className="group min-h-[172px] border border-white/15 bg-white/[0.10] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#7dd3fc]/60 hover:bg-white/[0.14]"
              >
                <div className="mb-8 flex items-center justify-between gap-4">
                  <BookOpen className="h-6 w-6 text-[#7dd3fc]" />
                  <span className="font-mono text-xs font-black text-white/38">0{index + 1}</span>
                </div>
                <p className="text-lg font-black leading-8 text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingSection />

    </div>
  )
}
