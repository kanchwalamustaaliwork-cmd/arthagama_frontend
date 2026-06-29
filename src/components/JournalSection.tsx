import { useState } from 'react'
import { motion, type Transition } from 'framer-motion'

interface JournalEntry {
  title: string
  image: string
  readTime: string
  date: string
  tag: string
}

const ENTRIES: JournalEntry[] = [
  {
    title: 'The Art of Systematic Thinking in Design',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&q=80',
    readTime: '5 min read',
    date: 'Mar 12, 2026',
    tag: 'Design',
  },
  {
    title: 'Building With Intention: Notes on Creative Process',
    image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=200&q=80',
    readTime: '7 min read',
    date: 'Feb 28, 2026',
    tag: 'Process',
  },
  {
    title: 'Why Constraint Is the Greatest Creative Force',
    image: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=200&q=80',
    readTime: '4 min read',
    date: 'Jan 15, 2026',
    tag: 'Thoughts',
  },
  {
    title: 'Fullstack in 2026: What Actually Matters',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80',
    readTime: '8 min read',
    date: 'Dec 03, 2025',
    tag: 'Dev',
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

export default function JournalSection() {
  return (
    <section id="journal" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6"
          {...viewMotion}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Journal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-body font-light text-text-primary">
              Recent <em className="font-display italic">thoughts</em>
            </h2>
            <p className="text-sm text-muted mt-3 max-w-sm">
              Writing about design, development, and the creative process.
            </p>
          </div>
          <ViewAllButton className="hidden md:inline-flex" />
        </motion.div>

        {/* Journal Entries */}
        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <JournalEntry key={i} entry={entry} index={i} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 flex justify-center md:hidden">
          <ViewAllButton />
        </div>
      </div>
    </section>
  )
}

function JournalEntry({ entry, index }: { entry: JournalEntry; index: number }) {
  return (
    <motion.a
      href="#"
      className="flex items-center gap-6 p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-all duration-300 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Image */}
      <img
        src={entry.image}
        alt={entry.title}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
        loading="lazy"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted/60 uppercase tracking-[0.15em]">{entry.tag}</span>
        </div>
        <p className="text-sm sm:text-base text-text-primary font-body font-medium truncate group-hover:text-text-primary transition-colors">
          {entry.title}
        </p>
      </div>

      {/* Meta */}
      <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs text-muted">{entry.readTime}</span>
        <span className="text-xs text-muted/60">{entry.date}</span>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full border border-stroke flex items-center justify-center text-muted group-hover:border-text-primary/30 group-hover:text-text-primary transition-all duration-200">
        <span className="text-xs">→</span>
      </div>
    </motion.a>
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
        View all <span className="text-base leading-none">→</span>
      </button>
    </div>
  )
}
