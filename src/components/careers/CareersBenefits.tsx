"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'

interface BenefitItem {
  title: string
  description: string | null
}

interface CareersBenefitsProps {
  heading?: string | null
  items?: BenefitItem[]
}

const DEFAULT_BENEFITS: BenefitItem[] = [
  { title: 'High Ownership & Impact', description: 'Small team size means your code and research models ship directly into live production.' },
  { title: 'Competitive Compensation', description: 'Top-of-market base salary plus performance-linked bonuses tied to strategy execution metrics.' },
  { title: 'Cutting-Edge Infrastructure', description: 'Access to high-frequency tick data, GPU compute clusters, and low-latency API pipelines.' },
  { title: 'Continuous Learning Culture', description: 'Work alongside experienced quantitative researchers and software architects in a collaborative setting.' },
]

export default function CareersBenefits({ heading, items }: CareersBenefitsProps) {
  const list = items && items.length > 0 ? items : DEFAULT_BENEFITS
  const title = heading ?? 'Why Join Us'

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 overflow-hidden">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-body font-light text-[#EAF1EC] sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((item, i) => (
            <motion.div
              key={item.title + i}
              className="benefit-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base font-semibold text-[#1B3236] mb-2">{item.title}</h3>
              <p className="text-sm text-[#244147]/85 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .benefit-card {
          background: rgba(184, 206, 194, 0.85);
          backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
          box-shadow: 0 2px 16px rgba(18, 33, 36, 0.2);
        }
      `}</style>
    </section>
  )
}
