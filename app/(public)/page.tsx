import Link from 'next/link'
import {
  Users,
  Globe,
  BookOpen,
  GraduationCap,
  Award,
  Briefcase,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Mail,
  Video,
} from 'lucide-react'
import { HeroSlider } from '@/components/landing/HeroSlider'
import { TestimonialSlider } from '@/components/landing/TestimonialSlider'
import { MediaGallery } from '@/components/landing/MediaGallery'
import { MentorDiscovery } from '@/components/landing/MentorDiscovery'
import { BookingSection } from '@/components/landing/BookingSection'
import { SubscribeForm } from '@/components/newsletter/SubscribeForm'

export default function HomePage() {
  return (
    <div className="animate-page space-y-0 bg-background text-foreground">
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. STATS SECTION */}
      <section className="py-12 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-border">
            <div className="flex flex-col items-center text-center px-4">
              <div className="p-3 bg-muted text-primary rounded-xl mb-3 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-2xl text-foreground">10,000+</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Students Guided</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="p-3 bg-muted text-primary rounded-xl mb-3 shadow-xs">
                <Globe className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-2xl text-foreground">50+</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Global Programs</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="p-3 bg-muted text-primary rounded-xl mb-3 shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-2xl text-foreground">500+</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Resources & Articles</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="p-3 bg-muted text-primary rounded-xl mb-3 shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-2xl text-foreground">24/7</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Mentorship Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AUDIENCE SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Who Is This For?</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'students', title: 'School / College Students', img: 'https://lh3.googleusercontent.com/d/1pmAUcOw4plu6Q_Ij2p45QjRkYES_3ehv' },
              { id: 'graduates', title: 'Graduates', img: 'https://lh3.googleusercontent.com/d/1tj49z4H1KSZnGW-IUeyKO-6aPveL9Feg' },
              { id: 'researchers', title: 'Researchers', img: 'https://lh3.googleusercontent.com/d/1Ox-zKUlts4ZAxPMAWFnoxVwwaxs4O2bh' },
              { id: 'educators', title: 'Educators', img: 'https://lh3.googleusercontent.com/d/1J9-rKEFUgaQL_rCEIb4Zy34qEtshL5MZ' },
            ].map((audience) => (
              <div
                key={audience.id}
                className="bg-card p-6 rounded-2xl border border-border/80 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col items-center text-center hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
                  <img src={audience.img} alt={audience.title} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="font-bold text-foreground">{audience.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED OPPORTUNITIES */}
      <section id="opportunities" className="py-20 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Featured Opportunities</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Scholarship Card */}
            <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center hover:-translate-y-1">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Scholarships Closing Soon</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                Discover fully-funded undergraduate and postgraduate grants globally before their deadlines pass.
              </p>
              <Link
                href="/blog"
                className="mt-auto px-6 py-3 bg-muted text-foreground border border-border font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2 w-full text-sm"
              >
                View Articles & Scholarships <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Internships Card */}
            <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Latest Internships</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                Gain hands-on experience with remote and on-site research internships at top-tier institutions.
              </p>
              <Link
                href="/blog"
                className="mt-auto px-6 py-3 bg-muted text-foreground border border-border font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2 w-full text-sm"
              >
                View Internships <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Jobs Card */}
            <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <ArrowUpRight className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Trending Jobs</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                Launch your career with entry-level positions and post-doc roles across academia and industry.
              </p>
              <Link
                href="/blog"
                className="mt-auto px-6 py-3 bg-muted text-foreground border border-border font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2 w-full text-sm"
              >
                View Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MENTOR DISCOVERY */}
      <MentorDiscovery />

      {/* 6. MEDIA GALLERY */}
      <MediaGallery />

      {/* 7. WHY SECTION */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Why Versatile Scientist?</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-start gap-4 bg-background/5 p-6 rounded-xl border border-background/10 backdrop-blur-md">
              <div className="text-primary mt-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Focused Guidance</h3>
                <p className="opacity-80 text-sm leading-relaxed">
                  Tailored mentorship programs designed to navigate complex academic and career pathways.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-background/5 p-6 rounded-xl border border-background/10 backdrop-blur-md">
              <div className="text-primary mt-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">For Underrepresented Learners</h3>
                <p className="opacity-80 text-sm leading-relaxed">
                  Committed to leveling the playing field for minority and disadvantaged students globally.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-background/5 p-6 rounded-xl border border-background/10 backdrop-blur-md">
              <div className="text-primary mt-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Global Exposure</h3>
                <p className="opacity-80 text-sm leading-relaxed">
                  Connect with international opportunities, grants, and leading research institutions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-background/5 p-6 rounded-xl border border-background/10 backdrop-blur-md">
              <div className="text-primary mt-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Practical Resources</h3>
                <p className="opacity-80 text-sm leading-relaxed">
                  Actionable templates, application guides, and interview prep kits ready to use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SUCCESS STORIES / TESTIMONIALS */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Success Stories</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* 9. ABOUT THE FOUNDER */}
      <section id="about" className="py-20 bg-muted/40 border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3">
              <div className="aspect-square bg-card rounded-3xl overflow-hidden shadow-md border-4 border-border relative hover:-translate-y-1 transition-transform duration-500">
                <img
                  src="https://lh3.googleusercontent.com/d/1xbvAxgVShs7Xsxa3pBIgXIpiqTHeIXhH"
                  alt="Dr. Namdev Shivajirao Togre"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">About the Founder</h2>
              <div className="w-16 h-1 bg-primary rounded-full mb-6"></div>
              <h3 className="text-xl font-bold text-foreground mb-4">Dr. Namdev Shivajirao Togre</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Dedicated to bridging the gap between talent and opportunity, I started Versatile Scientist to ensure that no passionate researcher is left behind due to a lack of resources or guidance. Having navigated the complex world of academic funding myself, I know firsthand the barriers that exist for underrepresented learners.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground font-medium text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> Former Research Fellow at Oxford
                </li>
                <li className="flex items-center gap-3 text-foreground font-medium text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> Global Educational Advocate
                </li>
                <li className="flex items-center gap-3 text-foreground font-medium text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> Mentored 1,000+ Students Worldwide
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. BOOKING SECTION */}
      <BookingSection />

      {/* 11. SOCIAL CHANNELS */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Learn & Stay Updated</h2>
          </div>
          <p className="opacity-80 text-lg max-w-2xl mx-auto mb-12">
            Follow us across our social channels for daily guidance, opportunities, and insights directly from our experts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background/10 border border-background/20 p-8 rounded-3xl hover:bg-background/20 transition-all hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Instagram className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">Instagram</h3>
              <p className="opacity-70 text-sm">Daily tips & updates</p>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background/10 border border-background/20 p-8 rounded-3xl hover:bg-background/20 transition-all hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Linkedin className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">LinkedIn</h3>
              <p className="opacity-70 text-sm">Daily updates & networking</p>
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background/10 border border-background/20 p-8 rounded-3xl hover:bg-background/20 transition-all hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Youtube className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">YouTube</h3>
              <p className="opacity-70 text-sm">In-depth guidance & sessions</p>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background/10 border border-background/20 p-8 rounded-3xl hover:bg-background/20 transition-all hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Facebook className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">Facebook</h3>
              <p className="opacity-70 text-sm">Community & announcements</p>
            </a>
          </div>
        </div>
      </section>

      {/* 12. NEWSLETTER */}
      <section className="py-20 bg-muted/40 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">Join Our Newsletter</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Get the latest scholarships, remote internships, and career tips delivered straight to your inbox every week.
          </p>
          <div className="max-w-md mx-auto">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </div>
  )
}
