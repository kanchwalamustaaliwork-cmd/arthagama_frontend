import { useState } from 'react'
import { motion, type Transition } from 'framer-motion'

interface Project {
  title: string
  span: string
  aspect: string
  image: string
  year: string
}

const PROJECTS: Project[] = [
  {
    title: 'Automotive Motion',
    span: 'md:col-span-7',
    aspect: 'aspect-[4/3]',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    year: '2025',
  },
  {
    title: 'Urban Architecture',
    span: 'md:col-span-5',
    aspect: 'aspect-[3/4]',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    year: '2025',
  },
  {
    title: 'Human Perspective',
    span: 'md:col-span-5',
    aspect: 'aspect-[3/4]',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    year: '2024',
  },
  {
    title: 'Brand Identity',
    span: 'md:col-span-7',
    aspect: 'aspect-[4/3]',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    year: '2024',
  },
]

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const viewTransition: Transition = { duration: 1, ease: easing }
const viewMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: viewTransition,
  viewport: { once: true as const, margin: '-100px' },
}

export default function WorksSection() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6"
          {...viewMotion}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Selected Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-body font-light text-text-primary">
              Featured <em className="font-display italic">projects</em>
            </h2>
            <p className="text-sm text-muted mt-3 max-w-sm">
              A selection of projects I've worked on, from concept to launch.
            </p>
          </div>

          {/* View all — desktop only */}
          <ViewAllButton className="hidden md:inline-flex" />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>

        {/* View all — mobile */}
        <div className="mt-8 flex justify-center md:hidden">
          <ViewAllButton />
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={`${project.span} ${project.aspect} relative bg-surface border border-stroke rounded-3xl overflow-hidden group cursor-pointer`}
      {...viewMotion}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Halftone overlay */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />

      {/* Dark base overlay */}
      <div className="absolute inset-0 bg-bg/30 pointer-events-none" />

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 bg-bg/70 backdrop-blur-lg transition-opacity duration-400 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Year — top left */}
      <div className="absolute top-5 left-5 text-xs text-muted/70 z-10">
        {project.year}
      </div>

      {/* Hover pill label */}
      <div
        className={`absolute bottom-5 left-5 right-5 flex justify-center transition-all duration-300 z-10 ${
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="relative">
          {/* Gradient border */}
          <span className="absolute inset-[-2px] rounded-full accent-gradient" />
          <div className="relative bg-white/95 text-bg rounded-full px-5 py-2 text-sm font-body">
            View —{' '}
            <em className="font-display italic">{project.title}</em>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ViewAllButton({ className = '' }: { className?: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="absolute inset-[-2px] rounded-full accent-gradient transition-opacity duration-300 pointer-events-none"
        style={{ opacity: hovered ? 1 : 0 }}
      />
      <button className="relative z-10 flex items-center gap-2 text-xs text-muted uppercase tracking-[0.2em] rounded-full px-6 py-3 border border-stroke bg-bg hover:text-text-primary transition-colors duration-200">
        View all work <span className="text-base leading-none">→</span>
      </button>
    </div>
  )
}
