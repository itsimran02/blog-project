'use client'

import { useState } from 'react'
import { Globe, ArrowRight } from 'lucide-react'

export function MentorDiscovery() {
  const [activeSubject, setActiveSubject] = useState('Artificial Intelligence')

  const subjects = [
    'Artificial Intelligence',
    'Biology & Medicine',
    'Engineering',
    'Business & Management',
    'Physical Sciences',
  ]

  const mentorsList = [
    { id: 1, name: 'Dr. Alan Turing', role: 'AI Researcher', org: 'DeepMind', subject: 'Artificial Intelligence', img: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, name: 'Emily Chen', role: 'ML Engineer', org: 'Google', subject: 'Artificial Intelligence', img: 'https://i.pravatar.cc/150?img=20' },
    { id: 3, name: 'Dr. Rosalind F.', role: 'Genomics Expert', org: 'Oxford University', subject: 'Biology & Medicine', img: 'https://i.pravatar.cc/150?img=32' },
    { id: 4, name: 'Dr. Marcus J.', role: 'Virologist', org: 'Johns Hopkins', subject: 'Biology & Medicine', img: 'https://i.pravatar.cc/150?img=12' },
    { id: 5, name: 'Prof. John Doe', role: 'Mechanical Engineer', org: 'MIT', subject: 'Engineering', img: 'https://i.pravatar.cc/150?img=15' },
    { id: 6, name: 'Lisa Wong', role: 'Robotics Lead', org: 'Boston Dynamics', subject: 'Engineering', img: 'https://i.pravatar.cc/150?img=9' },
    { id: 7, name: 'Sarah Connor', role: 'Product Manager', org: 'TechForward', subject: 'Business & Management', img: 'https://i.pravatar.cc/150?img=5' },
    { id: 8, name: 'David Smith', role: 'Venture Capitalist', org: 'Sequoia', subject: 'Business & Management', img: 'https://i.pravatar.cc/150?img=33' },
    { id: 9, name: 'Dr. Neil T.', role: 'Astrophysicist', org: 'NASA', subject: 'Physical Sciences', img: 'https://i.pravatar.cc/150?img=53' },
    { id: 10, name: 'Dr. Marie Curie', role: 'Quantum Physicist', org: 'CERN', subject: 'Physical Sciences', img: 'https://i.pravatar.cc/150?img=47' },
  ]

  const filteredMentors = mentorsList.filter((m) => m.subject === activeSubject)

  return (
    <section id="mentors" className="py-20 bg-muted/40 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Expert Guidance</span>
          <h2 className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">Find Mentors by Subject</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Whether you are a student exploring career paths, a researcher seeking guidance, or a school looking for expert speakers, connect with top professionals in your field.
          </p>
        </div>

        {/* Subject Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeSubject === sub
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card text-muted-foreground border-border hover:border-border hover:bg-accent hover:text-foreground'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-card p-8 rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group hover:-translate-y-1"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-border shadow-xs group-hover:border-primary transition-colors">
                <img src={mentor.img} alt={mentor.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {mentor.name}
              </h3>
              <p className="text-primary font-semibold text-sm mb-2">{mentor.role}</p>
              <p className="text-muted-foreground text-xs mb-8 flex items-center gap-1.5 justify-center">
                <Globe className="w-3.5 h-3.5 text-muted-foreground/70" /> {mentor.org}
              </p>
              <a
                href="#booking"
                className="w-full py-3 bg-muted text-foreground rounded-xl text-sm font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
              >
                Book Session <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
        {filteredMentors.length === 0 && (
          <p className="text-center text-muted-foreground py-10">More mentors joining soon in this category!</p>
        )}
      </div>
    </section>
  )
}
