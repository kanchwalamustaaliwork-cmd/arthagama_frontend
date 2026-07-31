"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'

interface ValueItem {
  title: string
  description: string | null
}

interface CompanyValuesSectionProps {
  values?: ValueItem[]
}

const DEFAULT_VALUES: ValueItem[] = [
  { title: 'Data Over Emotion', description: 'Every strategy is grounded in systematic empirical research, removing psychological bias from execution.' },
  { title: 'Disciplined Risk Controls', description: 'Risk parameters are strictly programmed into our code, protecting capital across volatile market regimes.' },
  { title: 'Institutional Scale', description: 'Built for high performance with robust server infrastructure and resilient broker API pipelines.' },
]

export default function CompanyValuesSection({ values }: CompanyValuesSectionProps) {
  const items = values && values.length > 0 ? values : DEFAULT_VALUES

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-16">
      <div className="section-backing absolute inset-x-4 inset-y-6 -z-10 rounded-3xl sm:inset-x-6" />

      <div className="mx-auto max-w-[1200px]">
        <motion.div
          className="mb-10 sm:mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easing }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-3xl font-body font-light text-[#EAF1EC] sm:text-4xl md:text-5xl">
            Core <em className="font-display italic text-[#EAF1EC]">values</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          {items.map((v, i) => (
            <motion.div
              key={v.title || i}
              className="value-card rounded-3xl p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easing, delay: i * 0.12 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <h3 className="mb-3 text-lg font-semibold text-[#1B3236] sm:text-xl">{v.title}</h3>
              <p className="text-sm text-[#244147]/85 leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          backdrop-filter: blur(28px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.1);
        }
        .value-card {
          background: rgba(184, 206, 194, 0.85);
          backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
          box-shadow: 0 2px 16px rgba(18, 33, 36, 0.25);
        }
      `}</style>
    </section>
  )
}
