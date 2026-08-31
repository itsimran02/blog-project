'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Flame, Rocket, Sparkles } from 'lucide-react'

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      badge: 'Welcome to Versatile Scientist',
      icon: Sparkles,
      title: 'Empowering Students & Young Researchers',
      description: 'Discover scholarships, remote internships, and expert career guidance tailored for your academic success.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
      primaryCTA: 'Explore Opportunities',
      secondaryCTA: 'Browse Articles',
      primaryLink: '/#opportunities',
      secondaryLink: '/blog',
    },
    {
      id: 2,
      badge: 'Exam & Application Guidance',
      icon: BookOpen,
      title: 'How to Ace the Global STEM Scholarship 2026',
      description: 'Read our comprehensive new blog post detailing step-by-step strategies, proposal templates, and interview tips.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80',
      primaryCTA: 'Read Articles',
      secondaryCTA: 'View Opportunities',
      primaryLink: '/blog',
      secondaryLink: '/#opportunities',
    },
    {
      id: 3,
      badge: 'New Study Released',
      icon: Flame,
      title: 'The Future of AI in Healthcare Research',
      description: 'Our latest published study explores emerging career paths and essential skills needed for the next decade of medical innovation.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80',
      primaryCTA: 'Read Articles',
      secondaryCTA: 'Find Mentors',
      primaryLink: '/blog',
      secondaryLink: '/#mentors',
    },
    {
      id: 4,
      badge: 'Trending Opportunity',
      icon: Rocket,
      title: 'Summer Research Internships at Top Labs',
      description: 'Applications are now open for remote and on-site internships at leading global research institutions. Don\'t miss out!',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
      primaryCTA: 'View Opportunities',
      secondaryCTA: 'Read Articles',
      primaryLink: '/#opportunities',
      secondaryLink: '/blog',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))

  return (
    <section className="relative w-full h-[550px] lg:h-[650px] bg-foreground text-background overflow-hidden border-b border-border/40">
      {slides.map((slide, index) => {
        const BadgeIcon = slide.icon
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image & Gradient Overlay */}
            <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30 dark:from-background dark:via-background/90 dark:to-background/40"></div>

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl space-y-6" key={`content-${currentSlide}`}>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm bg-primary text-primary-foreground">
                    <BadgeIcon className="w-3.5 h-3.5" />
                    {slide.badge}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <Link
                      href={slide.primaryLink}
                      className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      {slide.primaryCTA} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={slide.secondaryLink}
                      className="w-full sm:w-auto px-8 py-3.5 bg-background/80 text-foreground border border-border backdrop-blur-md rounded-xl font-semibold hover:bg-accent transition-all text-center"
                    >
                      {slide.secondaryCTA}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Prev / Next Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-background/60 hover:bg-background text-foreground border border-border rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-background/60 hover:bg-background text-foreground border border-border rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide ? 'w-8 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-muted-foreground/40 hover:bg-muted-foreground'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
