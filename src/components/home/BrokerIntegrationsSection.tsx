import React, { useRef, useEffect } from 'react'
import { motion, type Transition } from 'framer-motion'
import gsap from 'gsap'

interface Broker {
  name: string
  logo: React.ReactNode
  color: string
}

const BROKERS: Broker[] = [
  {
    name: 'Zerodha Kite',
    color: 'group-hover:text-[#448AFF]',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M12 3L5 12l7 9 7-9-7-9z" fill="currentColor" fillOpacity="0.05" />
        <path d="M12 3v18M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Angel One',
    color: 'group-hover:text-[#FF9100]',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M12 4L4 16h6l2-3 2 3h6L12 4z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
      </svg>
    ),
  },
  {
    name: 'Upstox',
    color: 'group-hover:text-[#8E24AA]',
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
    color: 'group-hover:text-[#FF3D00]',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
        <path d="M8 12l3-3 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Alice Blue',
    color: 'group-hover:text-[#00E5FF]',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="currentColor" fillOpacity="0.05" />
        <path d="M8 12a4 4 0 118 0 4 4 0 01-8 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Fyers',
    color: 'group-hover:text-[#00E676]',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" />
      </svg>
    ),
  },
  {
    name: 'Sharekhan',
    color: 'group-hover:text-[#F44336]',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M3 17l4-8 4 5 3-3 4 6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="5" r="2" fill="currentColor" fillOpacity="0.1" />
      </svg>
    ),
  },
  {
    name: 'Kotak Neo',
    color: 'group-hover:text-[#E91E63]',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Dhan',
    color: 'group-hover:text-[#76FF03]',
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
    <div className="flex-1 overflow-hidden relative" style={{ height: 480 }}>
      <div
        className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--bg)), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, hsl(var(--bg)), transparent)' }}
      />
      <div ref={trackRef} className="flex flex-col gap-4 pt-2">
        {items.map((broker, i) => (
          <div
            key={i}
            className="bg-surface border border-stroke rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 group cursor-pointer transition-all duration-300 hover:border-white/20 mx-1"
          >
            <div className={`text-muted transition-colors duration-300 ${broker.color}`}>
              {broker.logo}
            </div>
            <span className="text-xs font-body font-medium text-muted group-hover:text-text-primary transition-colors duration-300 leading-tight">
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
    <section id="integrations" className="bg-bg py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          <motion.div
            className="lg:w-[42%] flex flex-col justify-center lg:sticky lg:top-24"
            {...viewMotion}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Connectivity</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-body font-light text-text-primary leading-[1.1] mb-5">
              Broker{' '}
              <em className="font-display italic text-text-primary">Integrations</em>
            </h2>

            <p className="text-sm text-muted leading-relaxed mb-8 max-w-sm">
              Seamless API integrations with India's leading stockbrokers for
              sub-millisecond order execution. Our infrastructure connects
              directly to broker APIs, enabling fully automated, low-latency
              trade routing across multiple platforms simultaneously.
            </p>

            <div className="flex gap-8 mb-10">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-display italic text-text-primary">9+</span>
                <span className="text-xs text-muted uppercase tracking-[0.15em]">Brokers</span>
              </div>
              <div className="w-px bg-stroke" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-display italic text-text-primary">&lt;5ms</span>
                <span className="text-xs text-muted uppercase tracking-[0.15em]">Latency</span>
              </div>
              <div className="w-px bg-stroke" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-display italic text-text-primary">24/7</span>
                <span className="text-xs text-muted uppercase tracking-[0.15em]">Uptime</span>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted hover:text-text-primary transition-colors duration-200 group"
            >
              <span>View all integrations</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>

          <motion.div
            className="lg:w-[58%] flex gap-4"
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

// import React, { useRef, useEffect } from 'react'
// import { motion, type Transition } from 'framer-motion'
// import gsap from 'gsap'

// interface Broker {
//   name: string
//   logo: React.ReactNode
//   color: string
// }

// const BROKERS: Broker[] = [
//   {
//     name: 'Zerodha Kite',
//     color: 'group-hover:text-[#448AFF]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <path d="M12 3L5 12l7 9 7-9-7-9z" fill="currentColor" fillOpacity="0.05" />
//         <path d="M12 3v18M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
//   {
//     name: 'Angel One',
//     color: 'group-hover:text-[#FF9100]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <path d="M12 4L4 16h6l2-3 2 3h6L12 4z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
//       </svg>
//     ),
//   },
//   {
//     name: 'Upstox',
//     color: 'group-hover:text-[#8E24AA]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <rect x="4" y="14" width="3" height="6" rx="1" fill="currentColor" fillOpacity="0.05" />
//         <rect x="10" y="9" width="3" height="11" rx="1" fill="currentColor" fillOpacity="0.05" />
//         <rect x="16" y="4" width="3" height="16" rx="1" fill="currentColor" fillOpacity="0.05" />
//         <path d="M4 14l6-5 6-5 4 4" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
//   {
//     name: 'ICICI Direct',
//     color: 'group-hover:text-[#FF3D00]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
//         <path d="M8 12l3-3 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
//   {
//     name: 'Alice Blue',
//     color: 'group-hover:text-[#00E5FF]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="currentColor" fillOpacity="0.05" />
//         <path d="M8 12a4 4 0 118 0 4 4 0 01-8 0z" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
//   {
//     name: 'Fyers',
//     color: 'group-hover:text-[#00E676]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" strokeLinecap="round" strokeLinejoin="round" />
//         <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" />
//       </svg>
//     ),
//   },
//   {
//     name: 'Sharekhan',
//     color: 'group-hover:text-[#F44336]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <path d="M3 17l4-8 4 5 3-3 4 6" strokeLinecap="round" strokeLinejoin="round" />
//         <circle cx="19" cy="5" r="2" fill="currentColor" fillOpacity="0.1" />
//       </svg>
//     ),
//   },
//   {
//     name: 'Kotak Neo',
//     color: 'group-hover:text-[#E91E63]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
//   {
//     name: 'Dhan',
//     color: 'group-hover:text-[#76FF03]',
//     logo: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
//         <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
// ]

// // Split brokers into 3 columns
// const COL_1 = [...BROKERS.slice(0, 3), ...BROKERS.slice(6, 9)]   // 6 items — fast
// const COL_2 = [...BROKERS.slice(3, 6), ...BROKERS.slice(0, 3)]   // 6 items — slow
// const COL_3 = [...BROKERS.slice(6, 9), ...BROKERS.slice(3, 6)]   // 6 items — medium

// // Speeds: duration in seconds for one full loop (smaller = faster)
// const SPEEDS = { col1: 12, col2: 22, col3: 17 }

// const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
// const viewTransition: Transition = { duration: 1, ease: easing }
// const viewMotion = {
//   initial: { opacity: 0, y: 30 },
//   whileInView: { opacity: 1, y: 0 },
//   transition: viewTransition,
//   viewport: { once: true as const, margin: '-100px' },
// }

// // ─── Vertical Scroll Column ────────────────────────────────────────────────
// interface ScrollColProps {
//   brokers: Broker[]
//   duration: number   // seconds per full cycle
//   reversed?: boolean // scroll upward (default) or downward
// }

// function ScrollCol({ brokers, duration, reversed = false }: ScrollColProps) {
//   const trackRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const track = trackRef.current
//     if (!track) return

//     // Duplicate items are already in the array (×2) so we animate exactly 50%
//     const ctx = gsap.context(() => {
//       gsap.to(track, {
//         yPercent: reversed ? 50 : -50,
//         duration,
//         ease: 'none',
//         repeat: -1,
//       })
//     })
//     return () => ctx.revert()
//   }, [duration, reversed])

//   // Render items twice so the loop is seamless
//   const items = [...brokers, ...brokers]

//   return (
//     <div className="flex-1 overflow-hidden relative" style={{ height: 480 }}>
//       {/* Top fade */}
//       <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
//         style={{ background: 'linear-gradient(to bottom, hsl(var(--bg)), transparent)' }} />
//       {/* Bottom fade */}
//       <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
//         style={{ background: 'linear-gradient(to top, hsl(var(--bg)), transparent)' }} />

//       <div ref={trackRef} className="flex flex-col gap-4 pt-2">
//         {items.map((broker, i) => (
//           <div
//             key={i}
//             className="bg-surface border border-stroke rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 group cursor-pointer transition-all duration-300 hover:border-white/20 mx-1"
//           >
//             <div className={`text-muted transition-colors duration-300 ${broker.color}`}>
//               {broker.logo}
//             </div>
//             <span className="text-xs font-body font-medium text-muted group-hover:text-text-primary transition-colors duration-300 leading-tight">
//               {broker.name}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // ─── Main Section ──────────────────────────────────────────────────────────
// export default function BrokerIntegrationsSection() {
//   return (
//     <section id="integrations" className="bg-bg py-16 md:py-24 overflow-hidden">
//       <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
//         <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

//           {/* ── Left Column: Text ── */}
//           <motion.div
//             className="lg:w-[42%] flex flex-col justify-center lg:sticky lg:top-24"
//             {...viewMotion}
//           >
//             {/* Label */}
//             <div className="flex items-center gap-3 mb-5">
//               <div className="w-8 h-px bg-stroke" />
//               <span className="text-xs text-muted uppercase tracking-[0.3em]">Connectivity</span>
//             </div>

//             {/* Heading */}
//             <h2 className="text-4xl md:text-5xl font-body font-light text-text-primary leading-[1.1] mb-5">
//               Broker{' '}
//               <em className="font-display italic text-text-primary">
//                 Integrations
//               </em>
//             </h2>

//             {/* Description */}
//             <p className="text-sm text-muted leading-relaxed mb-8 max-w-sm">
//               Seamless API integrations with India's leading stockbrokers for
//               sub-millisecond order execution. Our infrastructure connects
//               directly to broker APIs, enabling fully automated, low-latency
//               trade routing across multiple platforms simultaneously.
//             </p>

//             {/* Stats row */}
//             <div className="flex gap-8 mb-10">
//               <div className="flex flex-col gap-1">
//                 <span className="text-2xl font-display italic text-text-primary">9+</span>
//                 <span className="text-xs text-muted uppercase tracking-[0.15em]">Brokers</span>
//               </div>
//               <div className="w-px bg-stroke" />
//               <div className="flex flex-col gap-1">
//                 <span className="text-2xl font-display italic text-text-primary">&lt;5ms</span>
//                 <span className="text-xs text-muted uppercase tracking-[0.15em]">Latency</span>
//               </div>
//               <div className="w-px bg-stroke" />
//               <div className="flex flex-col gap-1">
//                 <span className="text-2xl font-display italic text-text-primary">24/7</span>
//                 <span className="text-xs text-muted uppercase tracking-[0.15em]">Uptime</span>
//               </div>
//             </div>

//             {/* CTA */}
//             <a
//               href="#contact"
//               className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted hover:text-text-primary transition-colors duration-200 group"
//             >
//               <span>View all integrations</span>
//               <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
//             </a>
//           </motion.div>

//           {/* ── Right Column: 3 scrolling broker columns ── */}
//           <motion.div
//             className="lg:w-[58%] flex gap-4"
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1, ease: easing, delay: 0.2 }}
//             viewport={{ once: true, margin: '-100px' }}
//           >
//             {/* Col 1 — Fast, scrolls up */}
//             <ScrollCol brokers={COL_1} duration={SPEEDS.col1} />

//             {/* Col 2 — Slow, scrolls down */}
//             <ScrollCol brokers={COL_2} duration={SPEEDS.col2} reversed />

//             {/* Col 3 — Medium, scrolls up */}
//             <ScrollCol brokers={COL_3} duration={SPEEDS.col3} />
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   )
// }