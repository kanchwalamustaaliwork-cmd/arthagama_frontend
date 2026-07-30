"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'

interface StepItem {
  stepNumber?: number | null
  title: string
  description: string | null
}

interface HiringProcessProps {
  heading?: string | null
  steps?: StepItem[]
}

const DEFAULT_STEPS: StepItem[] = [
  { stepNumber: 1, title: 'Application Review', description: 'We review your background, GitHub projects, or research papers.' },
  { stepNumber: 2, title: 'Technical Conversation', description: 'A 45-minute discussion on system design, data structures, or quantitative modeling.' },
  { stepNumber: 3, title: 'Practical Coding / Research Challenge', description: 'A real-world problem statement testing your ability to write clean, performant code.' },
  { stepNumber: 4, title: 'Final Team Chat & Offer', description: 'Meet the founding team and align on goals, compensation, and start date.' },
]

export default function HiringProcess({ heading, steps }: HiringProcessProps) {
  const list = steps && steps.length > 0 ? steps : DEFAULT_STEPS
  const title = heading ?? 'Our Hiring Process'

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 overflow-hidden">
      <div className="mx-auto max-w-[1000px]">
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
          {list.map((step, i) => (
            <motion.div
              key={step.title + i}
              className="step-card rounded-2xl p-6 relative flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#122124] text-[#EAF1EC] text-xs font-bold mb-4">
                  {step.stepNumber ?? i + 1}
                </span>
                <h3 className="text-base font-semibold text-[#1B3236] mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#244147]/85 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .step-card {
          background: rgba(184, 206, 194, 0.88);
          backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
        }
      `}</style>
    </section>
  )
}
