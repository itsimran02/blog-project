'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(3)

  const testimonials = [
    {
      id: 1,
      quote: "The mentorship I received helped me refine my research proposal. Within two months, I secured a fully-funded PhD position in Europe. This platform truly changes lives.",
      name: "Sarah Jenkins",
      role: "PhD Candidate, Tech University",
      img: "https://i.pravatar.cc/150?img=32"
    },
    {
      id: 2,
      quote: "I was struggling to find internships that fit my background. Versatile Scientist's opportunity board highlighted remote positions I never knew existed.",
      name: "David Chen",
      role: "Undergraduate Researcher",
      img: "https://i.pravatar.cc/150?img=11"
    },
    {
      id: 3,
      quote: "Coming from a farming family, studying abroad felt impossible. The guidance and zero-cost support here gave me the confidence to apply and win a major scholarship.",
      name: "Anil Kumar",
      role: "First-Gen Scholar",
      img: "https://i.pravatar.cc/150?img=8"
    },
    {
      id: 4,
      quote: "The expert reviews on my SOP were game-changing. They pointed out exactly what admissions committees are looking for, making my application stand out.",
      name: "Maria Garcia",
      role: "Master's Student, MIT",
      img: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 5,
      quote: "Finding reliable research grants was a nightmare until I started using the AI Matchmaker. It perfectly aligned my profile with three active grants.",
      name: "James Wilson",
      role: "Post-Doc Researcher",
      img: "https://i.pravatar.cc/150?img=12"
    },
    {
      id: 6,
      quote: "The 1-on-1 mentorship session gave me the exact clarity I needed for my career transition from academia to industry data science.",
      name: "Priya Patel",
      role: "Data Scientist",
      img: "https://i.pravatar.cc/150?img=20"
    }
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2)
      } else {
        setItemsToShow(3)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - itemsToShow)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 4500)
    return () => clearInterval(timer)
  }, [maxIndex])

  const nextSlide = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  const goToSlide = (index: number) => setCurrentIndex(index)

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-12">
      <div className="overflow-hidden relative rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="flex-shrink-0 px-2 sm:px-4" style={{ width: `${100 / itemsToShow}%` }}>
              <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-xs h-full flex flex-col justify-between items-center text-center">
                <div className="flex flex-col items-center">
                  <div className="flex text-amber-400 mb-4 gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground italic mb-8 leading-relaxed text-sm lg:text-base">"{t.quote}"</p>
                </div>
                <div className="flex flex-col items-center gap-3 mt-auto">
                  <div className="w-14 h-14 bg-muted rounded-full overflow-hidden shrink-0 border-2 border-border shadow-xs">
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{t.name}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-card border border-border text-foreground rounded-full flex items-center justify-center shadow-xs hover:bg-accent transition-all z-10 focus:outline-none group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-card border border-border text-foreground rounded-full flex items-center justify-center shadow-all z-10 focus:outline-none group hover:bg-accent transition-all"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-2.5 hover:bg-muted-foreground/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
