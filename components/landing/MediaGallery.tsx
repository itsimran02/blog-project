'use client'

import { useState } from 'react'
import { Play, X } from 'lucide-react'

export function MediaGallery() {
  const [filter, setFilter] = useState('All')
  const [selectedMedia, setSelectedMedia] = useState<{
    id: number
    category: string
    type: string
    src: string
    videoUrl?: string
    title: string
  } | null>(null)

  const categories = ['All', 'Workshops', 'Sessions', 'Testimonials']

  const mediaItems = [
    {
      id: 1,
      category: 'Workshops',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1200&q=80',
      title: 'Data Science Bootcamp in Mumbai',
    },
    {
      id: 2,
      category: 'Sessions',
      type: 'video',
      src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: '1-on-1 Mentorship with Dr. Chen',
    },
    {
      id: 3,
      category: 'Testimonials',
      type: 'video',
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'Anil Kumar shares his fellowship journey',
    },
    {
      id: 4,
      category: 'Workshops',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
      title: 'Research Proposal Writing Seminar',
    },
    {
      id: 5,
      category: 'Sessions',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
      title: 'Group Lab Tour & Faculty Q&A',
    },
    {
      id: 6,
      category: 'Testimonials',
      type: 'video',
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      title: 'Alumni networking event in London',
    },
  ]

  const filteredItems = filter === 'All' ? mediaItems : mediaItems.filter((item) => item.category === filter)

  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Visual Trust Builder</span>
          <h2 className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">Impact in Action</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            See how we&apos;re transforming lives through hands-on workshops, expert sessions, and real success stories from our community.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                filter === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-card border border-border shadow-xs hover:shadow-lg transition-all"
            >
              <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity"></div>

              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center text-foreground border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all transform group-hover:scale-110">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform">
                <span className="inline-block px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded mb-2 shadow-xs">
                  {item.category}
                </span>
                <h3 className="text-foreground font-bold text-lg leading-tight">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {selectedMedia && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md p-4 animate-fade-in"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-muted text-foreground border border-border hover:bg-accent rounded-full flex items-center justify-center transition-colors focus:outline-none z-50 shadow-md"
              aria-label="Close media modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-5xl w-full max-h-[85vh] relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.videoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[80vh] rounded-2xl shadow-2xl ring-1 ring-border bg-black outline-none"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={selectedMedia.src} alt={selectedMedia.title} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl ring-1 ring-border" />
              )}

              <div className="absolute -bottom-12 sm:-bottom-16 left-0 right-0 text-center px-4">
                <h3 className="text-foreground font-bold text-xl sm:text-2xl drop-shadow-sm">{selectedMedia.title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
