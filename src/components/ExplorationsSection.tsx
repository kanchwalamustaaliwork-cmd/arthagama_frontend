import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ExplorationItem {
  image: string
  rotation: number
  label: string
}

const ITEMS: ExplorationItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    rotation: -2,
    label: 'Form Study 01',
  },
  {
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    rotation: 3,
    label: 'Neon Geometry',
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    rotation: -1,
    label: 'Landscape 04',
  },
  {
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80',
    rotation: 2,
    label: 'Gradient Dream',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    rotation: -3,
    label: 'Minimal Space',
  },
  {
    image: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=600&q=80',
    rotation: 1,
    label: 'Night Sky',
  },
]

export default function ExplorationsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !col1Ref.current || !col2Ref.current) return

    const ctx = gsap.context(() => {
      // Parallax columns
      gsap.fromTo(
        col1Ref.current,
        { y: 0 },
        {
          y: -200,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
      gsap.fromTo(
        col2Ref.current,
        { y: 200 },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const col1 = ITEMS.filter((_, i) => i % 2 === 0)
  const col2 = ITEMS.filter((_, i) => i % 2 !== 0)

  return (
    <section
      ref={sectionRef}
      id="explorations"
      className="relative bg-bg overflow-hidden"
      style={{ minHeight: '300vh' }}
    >
      {/* Layer 1: Pinned center content */}
      <div
        ref={contentRef}
        className="sticky top-0 h-screen flex items-center justify-center z-10 pointer-events-none"
      >
        <div className="text-center px-6 pointer-events-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Explorations</span>
            <div className="w-8 h-px bg-stroke" />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-body font-light text-text-primary mb-4">
            Visual <em className="font-display italic">playground</em>
          </h2>
          <p className="text-sm text-muted max-w-sm mx-auto mb-8">
            A collection of experimental visuals, textures, and motion studies.
          </p>
          <DribbbleButton />
        </div>
      </div>

      {/* Layer 2: Parallax columns */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 h-full">
          <div className="grid grid-cols-2 gap-12 md:gap-40 h-full">
            {/* Column 1 */}
            <div ref={col1Ref} className="flex flex-col gap-8 pt-32 pointer-events-auto">
              {col1.map((item, i) => (
                <ExplorationCard
                  key={i}
                  item={item}
                  onClick={() => setLightbox(item.image)}
                />
              ))}
            </div>
            {/* Column 2 */}
            <div ref={col2Ref} className="flex flex-col gap-8 pt-[50vh] pointer-events-auto">
              {col2.map((item, i) => (
                <ExplorationCard
                  key={i}
                  item={item}
                  onClick={() => setLightbox(item.image)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt="Exploration"
              className="max-w-full max-h-full object-contain rounded-2xl"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ExplorationCard({
  item,
  onClick,
}: {
  item: ExplorationItem
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative aspect-square max-w-[320px] rounded-2xl overflow-hidden cursor-pointer group"
      style={{ transform: `rotate(${item.rotation}deg)` }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.image}
        alt={item.label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div
        className={`absolute inset-0 bg-bg/60 backdrop-blur-sm flex items-end p-4 transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="text-sm text-text-primary font-body">{item.label}</span>
      </div>
    </div>
  )
}

function DribbbleButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="absolute inset-[-2px] rounded-full accent-gradient transition-opacity duration-300 pointer-events-none"
        style={{ opacity: hovered ? 1 : 0 }}
      />
      <a
        href="https://dribbble.com"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center gap-2 text-xs text-muted uppercase tracking-[0.2em] rounded-full px-6 py-3 border border-stroke bg-bg hover:text-text-primary transition-colors duration-200"
      >
        View on Dribbble <span className="text-base leading-none">↗</span>
      </a>
    </div>
  )
}
