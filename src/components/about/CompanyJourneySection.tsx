"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'

interface TimelineEvent {
  year: string
  title: string
  description: string | null
}

interface CompanyJourneySectionProps {
  journey?: {
    heading: string | null
    events: TimelineEvent[]
  }
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  { year: '2021', title: 'Research Desk Founded', description: 'Began developing quantitative strategy models for domestic equity markets.' },
  { year: '2023', title: 'Automated Execution Pipeline', description: 'Built robust server infrastructure and broker API integrations for live deployment.' },
  { year: '2025', title: 'Multi-Asset Expansion', description: 'Expanded systematic trading modules into derivatives, options volatility, and multi-asset models.' },
]

export default function CompanyJourneySection({ journey }: CompanyJourneySectionProps) {
  const events = journey?.events && journey.events.length > 0 ? journey.events : DEFAULT_EVENTS
  const heading = journey?.heading ?? 'Our journey'

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto max-w-[900px]">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-body font-light text-[#EAF1EC] sm:text-4xl md:text-5xl">
            {heading}
          </h2>
        </motion.div>

        <div className="relative border-l border-[#B8CEC2]/25 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
          {events.map((event, i) => (
            <motion.div
              key={event.year + i}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: easing, delay: i * 0.12 }}
              viewport={{ once: true }}
            >
              <div className="absolute -left-[31px] sm:-left-[47px] top-1 h-3.5 w-3.5 rounded-full bg-[#B8CEC2] border-2 border-[#122124]" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B8CEC2]/80">{event.year}</span>
              <h3 className="text-lg font-semibold text-[#EAF1EC] mt-1 mb-2">{event.title}</h3>
              <p className="text-sm text-[#DCE7E1]/75 leading-relaxed max-w-md">{event.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
