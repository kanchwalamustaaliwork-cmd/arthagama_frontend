"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'

interface CareersIntroProps {
  heading?: string | null
  body?: string | null
}

export default function CareersIntro({ heading, body }: CareersIntroProps) {
  const title = heading ?? 'Engineering at Arthagama'
  const text = body ?? 'We are a small, tight-knit team of engineers and quantitative researchers. We don’t build pitch decks or slide decks — we research strategies, write high-performance C++ and Python modules, and deploy system infrastructure that processes real market data every day.'

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 overflow-hidden">
      <div className="section-backing absolute inset-x-4 inset-y-6 -z-10 rounded-3xl sm:inset-x-6" />

      <div className="mx-auto max-w-[1000px]">
        <motion.div
          className="intro-card rounded-3xl p-8 sm:p-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-body font-light text-[#1B3236] mb-4">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[#244147]/85 max-w-2xl mx-auto leading-relaxed">
            {text}
          </p>
        </motion.div>
      </div>

      <style>{`
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          backdrop-filter: blur(28px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.1);
        }
        .intro-card {
          background: rgba(184, 206, 194, 0.88);
          backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
        }
      `}</style>
    </section>
  )
}
