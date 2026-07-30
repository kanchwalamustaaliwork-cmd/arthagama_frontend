"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'

interface StatNumber {
  number: string
  label: string
}

interface CompanyNumbersSectionProps {
  numbers?: StatNumber[]
}

const DEFAULT_NUMBERS: StatNumber[] = [
  { number: '25+', label: 'Quantitative Strategies' },
  { number: '99.9%', label: 'API Uptime' },
  { number: '5+ Yrs', label: 'Backtest History' },
  { number: '100%', label: 'Rule-Based Execution' },
]

export default function CompanyNumbersSection({ numbers }: CompanyNumbersSectionProps) {
  const items = numbers && numbers.length > 0 ? numbers : DEFAULT_NUMBERS

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label + i}
              className="stat-card rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: easing, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl sm:text-4xl font-display italic text-[#1B3236] mb-2">{item.number}</div>
              <div className="text-xs uppercase tracking-[0.15em] text-[#244147]/75 font-medium">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .stat-card {
          background: rgba(184, 206, 194, 0.85);
          backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
          box-shadow: 0 2px 16px rgba(18, 33, 36, 0.2);
        }
      `}</style>
    </section>
  )
}
