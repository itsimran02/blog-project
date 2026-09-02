import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Map,
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

const impactStats = [
  { value: '26+', label: 'peer-reviewed publications', icon: Microscope },
  { value: '500K+', label: 'students and families reached', icon: Users },
  { value: '20M+', label: 'social reach across platforms', icon: Sparkles },
  { value: '400+', label: 'students at Gaav Te Global', icon: GraduationCap },
]

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

const routeMarkers = [
  { place: 'Jalkot', detail: 'First-generation learner', align: 'left-8 top-12' },
  { place: 'Nagpur', detail: 'Ph.D. training', align: 'right-10 top-32' },
  { place: 'Penn State', detail: 'Neuroimmunology research', align: 'left-16 bottom-24' },
  { place: 'Rural Maharashtra', detail: 'Guidance in Marathi and English', align: 'right-8 bottom-8' },
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
    <div className="animate-page bg-[#eef6ff] text-[#0b1220]">
      <section className="relative isolate overflow-hidden border-b border-[#1d4ed8]/15 bg-[#eef6ff]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.22),transparent_30%),linear-gradient(135deg,#eef6ff_0%,#f8fbff_52%,#dbeafe_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(#1d4ed8_1px,transparent_1px),linear-gradient(90deg,#1d4ed8_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 border border-[#1d4ed8]/25 bg-white/85 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#1d4ed8] shadow-[4px_4px_0_#93c5fd]">
              <ShieldCheck className="h-4 w-4" />
              Research Meets Mentorship
            </div>
            <h1 className="text-5xl font-black leading-[0.92] tracking-tight text-[#07163d] sm:text-6xl lg:text-7xl">
              Every rural student deserves a clear route into science.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#334155] sm:text-xl">
              Versatile Scientist turns Dr. Namdev Shivaji Togre&apos;s research journey from Jalkot to Penn State
              into practical, bilingual guidance for students who are talented, ambitious, and too often left without
              a map.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 bg-[#1d4ed8] px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[6px_6px_0_#0b1f4d] transition hover:bg-[#0b1f4d]"
              >
                Explore Guidance <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center justify-center gap-2 border border-[#1d4ed8]/35 bg-white px-6 py-4 text-sm font-black uppercase tracking-wide text-[#0b1f4d] transition hover:border-[#1d4ed8] hover:bg-[#dbeafe]"
              >
                The Man Behind <Route className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[560px] overflow-hidden border border-[#1d4ed8]/25 bg-[#081a3f] shadow-[14px_14px_0_#93c5fd]">
            <img src={heroImage} alt="Students studying together in a library" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,22,61,0.94)_0%,rgba(7,22,61,0.72)_38%,rgba(29,78,216,0.18)_100%)]" />
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(#bfdbfe_1px,transparent_1px),linear-gradient(90deg,#bfdbfe_1px,transparent_1px)] [background-size:54px_54px]" />
            <div className="relative z-10 flex h-full min-h-[560px] flex-col justify-between p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex h-16 w-16 items-center justify-center border border-white/25 bg-white/10 text-[#bfdbfe] backdrop-blur">
                  <Map className="h-8 w-8" />
                </div>
                <div className="max-w-48 border border-white/20 bg-white/10 p-3 text-right text-xs font-black uppercase tracking-[0.18em] text-[#dbeafe] backdrop-blur">
                  Village to global lab pathway
                </div>
              </div>

              <div className="relative mt-16 grid gap-4 sm:grid-cols-2">
                {routeMarkers.map((marker) => (
                  <div key={marker.place} className="border border-white/20 bg-white/92 p-4 text-[#0b1f4d] shadow-[6px_6px_0_rgba(147,197,253,0.34)]">
                    <div className="mb-3 h-2 w-2 rounded-full bg-[#2563eb] ring-4 ring-[#bfdbfe]" />
                    <p className="text-lg font-black">{marker.place}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#475569]">{marker.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {['Research', 'Roadmaps', 'Reach'].map((item) => (
                  <div key={item} className="border border-white/15 bg-white/10 p-3 text-center text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#1d4ed8]/15 bg-[#07163d] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 px-4 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
          {impactStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="px-3 py-8 sm:px-6">
                <Icon className="mb-5 h-6 w-6 text-[#7dd3fc]" />
                <p className="text-4xl font-black tracking-tight">{stat.value}</p>
                <p className="mt-2 max-w-40 text-sm font-semibold leading-5 text-white/70">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-white py-20" id="opportunities">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#1d4ed8]">Our Work</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#07163d] sm:text-5xl">
                Credibility in the lab. Clarity in the classroom.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                The platform does not speak from the sidelines. It turns active research experience into practical
                mentorship, career roadmaps, and opportunity awareness for students who deserve better access.
              </p>
            </div>
            <div className="grid gap-5">
              {workPillars.map((pillar, index) => {
                const Icon = pillar.icon
                return (
                  <article
                    key={pillar.title}
                    className="grid gap-5 border border-[#1d4ed8]/15 bg-[#eff6ff] p-5 shadow-[6px_6px_0_rgba(37,99,235,0.12)] sm:grid-cols-[88px_1fr]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center border border-[#93c5fd] bg-white text-[#1d4ed8]">
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

      <section className="bg-[#eef6ff] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#1d4ed8]">Success Stories</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[#07163d] sm:text-5xl">
                Guidance that changes the next application, the next degree, the next country.
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#475569]">
              <CheckCircle2 className="h-5 w-5 text-[#2563eb]" />
              Real student and parent outcomes
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((story) => (
              <figure key={story.name} className="border border-[#1d4ed8]/15 bg-white p-6 shadow-[6px_6px_0_rgba(37,99,235,0.10)]">
                <Quote className="h-7 w-7 text-[#2563eb]" />
                <blockquote className="mt-5 text-lg font-semibold leading-8 text-[#0f172a]">{story.quote}</blockquote>
                <figcaption className="mt-6 border-t border-[#1d4ed8]/10 pt-4">
                  <p className="font-black text-[#07163d]">{story.name}</p>
                  <p className="text-sm font-semibold text-[#2563eb]">{story.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="border border-[#1d4ed8] bg-[#dbeafe] p-4 shadow-[10px_10px_0_#07163d]">
            <Image src='/the-man.jpeg' alt="Dr. Namdev Shivaji Togre" className="aspect-[5/6] w-full object-cover" />
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

      <section className="bg-[#07163d] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center border border-white/20 bg-white/10">
              <Route className="h-7 w-7 text-[#7dd3fc]" />
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">For the student asking, &quot;What now?&quot;</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Scholarship and fellowship awareness before deadlines disappear.',
              'Research career explanations without gatekeeping language.',
              'Visual infographics that make hard science easier to remember.',
              'Career camps, college partnerships, and public roadmaps for rural students.',
            ].map((item) => (
              <div key={item} className="border border-white/12 bg-white/[0.06] p-5">
                <BookOpen className="mb-5 h-5 w-5 text-[#7dd3fc]" />
                <p className="text-base font-bold leading-7 text-white/84">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingSection />

    </div>
  )
}
