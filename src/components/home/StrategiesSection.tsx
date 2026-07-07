import { useState } from 'react'
import { motion } from 'framer-motion'
import StrategyCard from '../ui/StrategyCard'
import { viewMotion } from '../../constans/animation'

export interface Strategy {
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

export default function StrategiesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="strategies" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Dark teal backing panel — video shows through, mint cards float on top for contrast */}
      <div className="section-backing absolute inset-x-4 inset-y-6 -z-10 rounded-3xl sm:inset-x-6" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
        {/* Header — slide up reveal */}
        <motion.div className="flex flex-col mb-10 sm:mb-12 md:mb-16" {...viewMotion}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-body font-light text-[#EAF1EC]">
            Strategies <em className="font-display italic text-[#EAF1EC]">Deployed</em>
          </h2>
          <p className="text-sm text-[#DCE7E1]/85 mt-3 max-w-sm">
            Research-driven systematic modules running continuously across global markets.
          </p>
        </motion.div>

        {/* Strategies Grid — stagger reveal via per-card delay */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {STRATEGIES.map((strategy, i) => (
            <StrategyCard
              key={i}
              strategy={strategy}
              index={i}
              isHovered={hoveredIndex === i}
              onEnter={() => setHoveredIndex(i)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>

      <style>{`
        /* Dark teal wash behind the whole grid, lets global video read through */
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          backdrop-filter: blur(28px) saturate(1.1);
          -webkit-backdrop-filter: blur(28px) saturate(1.1);
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2),
            inset 0 1px 1px rgba(184, 206, 194, 0.15);
          border: 1px solid rgba(184, 206, 194, 0.1);
        }

        /* Near-opaque mint glass card — dark teal text sits on top */
        .strategy-card-mint {
          background: rgba(184, 206, 194, 0.85);
          backdrop-filter: blur(14px) saturate(1.1);
          -webkit-backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
          box-shadow: 0 2px 16px rgba(18, 33, 36, 0.25);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .strategy-card-mint:hover {
          background: rgba(198, 218, 208, 0.94);
          border-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </section>
  )
}