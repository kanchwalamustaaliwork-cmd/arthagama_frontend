import { useState } from 'react'
import { motion, type Transition } from 'framer-motion'

interface Strategy {
  name: string
  description: string
}

const STRATEGIES: Strategy[] = [
  {
    name: 'Momentum Strategy',
    description: 'Captures medium-term market trends using quantitative signals.',
  },
  {
    name: 'Mean Reversion',
    description: 'Identifies temporary price deviations and trades toward equilibrium.',
  },
  {
    name: 'Breakout Strategy',
    description: 'Executes trades when price breaks significant support or resistance levels.',
  },
  {
    name: 'Statistical Arbitrage',
    description: 'Uses quantitative models to identify pricing inefficiencies.',
  },
  {
    name: 'Options Volatility Strategy',
    description: 'Trades based on changes in implied and historical volatility.',
  },
  {
    name: 'Trend Following',
    description: 'Systematically follows long-term market trends using rule-based execution.',
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

export default function StrategiesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="strategies" className="bg-[#244147] py-16 sm:py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col mb-10 sm:mb-12 md:mb-16"
          {...viewMotion}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#B8CEC2]/40" />
            <span className="text-[11px] sm:text-xs text-[#B8CEC2]/70 uppercase tracking-[0.3em]">
              Trading Models
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-body font-light text-[#B8CEC2]">
            Strategies <em className="font-display italic text-[#B8CEC2]">Deployed</em>
          </h2>
          <p className="text-sm text-[#B8CEC2]/60 mt-3 max-w-sm">
            Research-driven systematic modules running continuously across global markets.
          </p>
        </motion.div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {STRATEGIES.map((strategy, i) => (
            <motion.div
              key={i}
              className="relative bg-[#B8CEC2]/[0.06] border border-[#B8CEC2]/15 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 overflow-hidden group cursor-pointer transition-colors duration-300 hover:border-[#B8CEC2]/35"
              {...viewMotion}
              transition={{
                ...viewMotion.transition,
                delay: i * 0.08,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Halftone / Dot background effect on card hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] mix-blend-overlay pointer-events-none transition-opacity duration-500"
                style={{
                  backgroundImage: 'radial-gradient(circle, #B8CEC2 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              {/* Number indicator */}
              <div className="flex items-center justify-between">
                <span className="font-display italic text-xl text-[#B8CEC2]/30 group-hover:text-[#B8CEC2]/80 transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Visual Accent Circle */}
                <div className="w-2 h-2 rounded-full bg-[#B8CEC2]/30 group-hover:bg-[#B8CEC2] transition-all duration-300" />
              </div>

              {/* Strategy Name */}
              <h3 className="text-lg font-body font-medium text-[#B8CEC2] mt-2">
                {strategy.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#B8CEC2]/60 leading-relaxed font-body">
                {strategy.description}
              </p>

              {/* Hover bottom line accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent transition-all duration-300"
                style={{
                  background: hoveredIndex === i ? '#B8CEC2' : 'transparent',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}