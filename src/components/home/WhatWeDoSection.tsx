import { motion, type Transition } from 'framer-motion'

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const viewTransition: Transition = { duration: 1, ease: easing }
const viewMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: viewTransition,
  viewport: { once: true as const, margin: '-100px' },
}

export default function WhatWeDoSection() {
  return (
    <section id="about" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Top divider */}
        <div className="w-full h-px bg-stroke mb-16 md:mb-24" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          {/* Left Column: Heading */}
          <motion.div 
            className="md:col-span-5"
            {...viewMotion}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Core Philosophy</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-body font-light text-text-primary leading-tight">
              What we <em className="font-display italic text-text-primary">do</em>
            </h2>
          </motion.div>

          {/* Right Column: Description Text */}
          <motion.div 
            className="md:col-span-7"
            {...viewMotion}
            transition={{ ...viewTransition, delay: 0.15 }}
          >
            <p className="text-lg md:text-xl font-body font-light text-muted leading-relaxed max-w-2xl">
              <span className="text-text-primary font-medium">Arthagama</span> is an algorithmic trading firm based in Mumbai that researches, develops, and deploys systematic trading strategies using technology, quantitative analysis, and market data. We combine automation, disciplined execution, and robust risk management to identify opportunities across financial markets and generate sustainable, data-driven returns.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
