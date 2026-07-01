import React from 'react'
import { motion } from 'framer-motion'
import ScrollCol from '../ui/ScrollCol'
import { viewMotion, easing } from '../../constans/animation'


export interface Broker {
  name: string
  logo: React.ReactNode
}

const BROKERS: Broker[] = [
  {
    name: 'Zerodha Kite',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 3L5 12l7 9 7-9-7-9z" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 3v18M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Angel One',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 4L4 16h6l2-3 2 3h6L12 4z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
      </svg>
    ),
  },
  {
    name: 'Upstox',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="4" y="14" width="3" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
        <rect x="10" y="9" width="3" height="11" rx="1" fill="currentColor" fillOpacity="0.1" />
        <rect x="16" y="4" width="3" height="16" rx="1" fill="currentColor" fillOpacity="0.1" />
        <path d="M4 14l6-5 6-5 4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'ICICI Direct',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <path d="M8 12l3-3 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Alice Blue',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="currentColor" fillOpacity="0.1" />
        <path d="M8 12a4 4 0 118 0 4 4 0 01-8 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Fyers',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    name: 'Sharekhan',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 17l4-8 4 5 3-3 4 6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="5" r="2" fill="currentColor" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    name: 'Kotak Neo',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Dhan',
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const COL_1 = [...BROKERS.slice(0, 3), ...BROKERS.slice(6, 9)]
const COL_2 = [...BROKERS.slice(3, 6), ...BROKERS.slice(0, 3)]
const COL_3 = [...BROKERS.slice(6, 9), ...BROKERS.slice(3, 6)]

const SPEEDS = { col1: 12, col2: 22, col3: 17 }


const cascadeContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const cascadeItem = {
  hidden: { opacity: 0, scale: 0.8, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 18 },
  },
}

export default function BrokerIntegrationsSection() {
  return (
    <section id="integrations" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Dark teal backing panel — video shows through, mint cards float on top for contrast */}
      <div className="section-backing absolute inset-x-4 inset-y-6 -z-10 rounded-3xl sm:inset-x-6" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 items-start">
          <motion.div
            className="lg:w-[42%] flex flex-col justify-center lg:sticky lg:top-24"
            {...viewMotion}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#B8CEC2]/40" />
              <span className="text-[11px] sm:text-xs text-[#B8CEC2]/80 uppercase tracking-[0.3em]">
                Connectivity
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-body font-light text-[#EAF1EC] leading-[1.1] mb-5">
              Broker <em className="font-display italic text-[#EAF1EC]">Integrations</em>
            </h2>

            <p className="text-sm text-[#DCE7E1]/85 leading-relaxed mb-8 max-w-sm">
              Seamless API integrations with India's leading stockbrokers for
              sub-millisecond order execution. Our infrastructure connects
              directly to broker APIs, enabling fully automated, low-latency
              trade routing across multiple platforms simultaneously.
            </p>

            {/* <a
              href="#contact"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#DCE7E1]/80 hover:text-white transition-colors duration-200 group"
            >
              <span>View all integrations</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a> */}
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

      <style>{`
        /* Dark teal wash behind the whole section, lets global video read through */
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          background-blend-mode: normal;
          backdrop-filter: blur(28px) saturate(1.1);
          -webkit-backdrop-filter: blur(28px) saturate(1.1);
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2),
            inset 0 1px 1px rgba(184, 206, 194, 0.15);
          border: 1px solid rgba(184, 206, 194, 0.1);
        }

        /* Near-opaque mint glass card — dark teal icon + text sit on top */
        .broker-card-mint {
          background: rgba(184, 206, 194, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(184, 206, 194, 0.95);
          box-shadow: 0 2px 12px rgba(18, 33, 36, 0.22);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .broker-card-mint:hover {
          background: rgba(198, 218, 208, 0.95);
          border-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </section>
  )
}