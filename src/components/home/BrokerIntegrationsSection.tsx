import React, { useRef, useEffect } from 'react'
import { motion, type Transition } from 'framer-motion'
import gsap from 'gsap'

interface Broker {
  name: string
  logo: React.ReactNode
}

const BROKERS: Broker[] = [
  {
    name: 'Zerodha Kite',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M12 3L5 12l7 9 7-9-7-9z" fill="currentColor" fillOpacity="0.05" />
        <path d="M12 3v18M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Angel One',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M12 4L4 16h6l2-3 2 3h6L12 4z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
      </svg>
    ),
  },
  {
    name: 'Upstox',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <rect x="4" y="14" width="3" height="6" rx="1" fill="currentColor" fillOpacity="0.05" />
        <rect x="10" y="9" width="3" height="11" rx="1" fill="currentColor" fillOpacity="0.05" />
        <rect x="16" y="4" width="3" height="16" rx="1" fill="currentColor" fillOpacity="0.05" />
        <path d="M4 14l6-5 6-5 4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'ICICI Direct',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
        <path d="M8 12l3-3 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Alice Blue',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="currentColor" fillOpacity="0.05" />
        <path d="M8 12a4 4 0 118 0 4 4 0 01-8 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Fyers',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" />
      </svg>
    ),
  },
  {
    name: 'Sharekhan',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M3 17l4-8 4 5 3-3 4 6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="5" r="2" fill="currentColor" fillOpacity="0.1" />
      </svg>
    ),
  },
  {
    name: 'Kotak Neo',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Dhan',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const COL_1 = [...BROKERS.slice(0, 3), ...BROKERS.slice(6, 9)]
const COL_2 = [...BROKERS.slice(3, 6), ...BROKERS.slice(0, 3)]
const COL_3 = [...BROKERS.slice(6, 9), ...BROKERS.slice(3, 6)]

const SPEEDS = { col1: 12, col2: 22, col3: 17 }

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const viewTransition: Transition = { duration: 1, ease: easing }
const viewMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: viewTransition,
  viewport: { once: true as const, margin: '-100px' },
}

interface ScrollColProps {
  brokers: Broker[]
  duration: number
  reversed?: boolean
}

function ScrollCol({ brokers, duration, reversed = false }: ScrollColProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const ctx = gsap.context(() => {
      // KEY FIX: fromTo ensures every repeat cycle starts AND ends at the
      // exact same pixel positions, eliminating the jump on loop.
      //
      // Normal   (up):   from yPercent:   0  → to yPercent: -50
      //                  on repeat GSAP snaps back to 0  → seamless ✓
      //
      // Reversed (down): from yPercent: -50  → to yPercent:   0
      //                  on repeat GSAP snaps back to -50 → seamless ✓
      gsap.fromTo(
        track,
        { yPercent: reversed ? -50 : 0 },
        {
          yPercent: reversed ? 0 : -50,
          duration,
          ease: 'none',
          repeat: -1,
        }
      )
    })

    return () => ctx.revert()
  }, [duration, reversed])

  const items = [...brokers, ...brokers]

  return (
    <div className="flex-1 overflow-hidden relative h-[320px] sm:h-[400px] md:h-[480px]">
      <div
        className="absolute top-0 left-0 right-0 h-16 sm:h-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #244147, transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #244147, transparent)' }}
      />
      <div ref={trackRef} className="flex flex-col gap-3 sm:gap-4 pt-2">
        {items.map((broker, i) => (
          <div
            key={i}
            className="bg-[#B8CEC2]/[0.06] border border-[#B8CEC2]/15 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2 sm:gap-3 group cursor-pointer transition-all duration-300 hover:border-[#B8CEC2]/35 mx-1"
          >
            <div className="text-[#B8CEC2]/50 transition-colors duration-300 group-hover:text-[#B8CEC2]">
              {broker.logo}
            </div>
            <span className="text-[10px] sm:text-xs font-body font-medium text-[#B8CEC2]/60 group-hover:text-[#B8CEC2] transition-colors duration-300 leading-tight">
              {broker.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BrokerIntegrationsSection() {
  return (
    <section id="integrations" className="bg-[#244147] py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 items-start">

          <motion.div
            className="lg:w-[42%] flex flex-col justify-center lg:sticky lg:top-24"
            {...viewMotion}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#B8CEC2]/40" />
              <span className="text-[11px] sm:text-xs text-[#B8CEC2]/70 uppercase tracking-[0.3em]">
                Connectivity
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-body font-light text-[#B8CEC2] leading-[1.1] mb-5">
              Broker{' '}
              <em className="font-display italic text-[#B8CEC2]">Integrations</em>
            </h2>

            <p className="text-sm text-[#B8CEC2]/60 leading-relaxed mb-8 max-w-sm">
              Seamless API integrations with India's leading stockbrokers for
              sub-millisecond order execution. Our infrastructure connects
              directly to broker APIs, enabling fully automated, low-latency
              trade routing across multiple platforms simultaneously.
            </p>

            <div className="flex flex-wrap gap-6 sm:gap-8 mb-10">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-display italic text-[#B8CEC2]">9+</span>
                <span className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.15em]">Brokers</span>
              </div>
              <div className="w-px bg-[#B8CEC2]/20" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-display italic text-[#B8CEC2]">&lt;5ms</span>
                <span className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.15em]">Latency</span>
              </div>
              <div className="w-px bg-[#B8CEC2]/20" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-display italic text-[#B8CEC2]">24/7</span>
                <span className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.15em]">Uptime</span>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B8CEC2]/60 hover:text-[#B8CEC2] transition-colors duration-200 group"
            >
              <span>View all integrations</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>

          <motion.div
            className="lg:w-[58%] w-full flex gap-3 sm:gap-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: easing, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <ScrollCol brokers={COL_1} duration={SPEEDS.col1} />
            <ScrollCol brokers={COL_2} duration={SPEEDS.col2} reversed />
            <ScrollCol brokers={COL_3} duration={SPEEDS.col3} />
          </motion.div>

        </div>
      </div>
    </section>
  )
}