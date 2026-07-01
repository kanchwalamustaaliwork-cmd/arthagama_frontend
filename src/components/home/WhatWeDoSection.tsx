import { useMemo } from 'react'
import { motion, type Transition } from 'framer-motion'

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

// ─── Shared motion presets ───────────────────────────────────────────────────
const sectionTransition: Transition = { duration: 1, ease: easing }
const sectionMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: sectionTransition,
  viewport: { once: true as const, margin: '-100px' },
}

const dividerMotion = {
  initial: { scaleX: 0, opacity: 0 },
  whileInView: { scaleX: 1, opacity: 1 },
  transition: { duration: 1.1, ease: easing },
  viewport: { once: true as const, margin: '-100px' },
}

// Mask reveal wrapper: clip-path slides open like a curtain
const maskContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const maskWord = {
  hidden: { clipPath: 'inset(0 0 100% 0)', y: 40, opacity: 0 },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: easing },
  },
}

// Word-by-word blur reveal for the paragraph
const blurContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.018, delayChildren: 0.1 },
  },
}

const blurWord = {
  hidden: { opacity: 0, filter: 'blur(6px)', y: 8 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.5, ease: easing },
  },
}

function MaskRevealHeading({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <motion.h2
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-light text-[#EAF1EC] leading-tight flex flex-wrap gap-x-3"
      variants={maskContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            variants={maskWord}
            className={
              word.toLowerCase() === 'do'
                ? 'font-display italic text-[#EAF1EC] inline-block'
                : 'inline-block'
            }
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  )
}

function BlurRevealParagraph({ text }: { text: string }) {
  const words = useMemo(() => text.split(' '), [text])
  return (
    <motion.p
      className="text-base sm:text-lg md:text-xl font-body font-light text-[#244147]/85 leading-relaxed max-w-2xl"
      variants={blurContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={blurWord} className="inline-block mr-[0.28em]">
          {word}
        </motion.span>
      ))}
    </motion.p>
  )
}

export default function WhatWeDoSection() {
  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* ---------------- Ambient aurora blobs ---------------- */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[#B8CEC2]/10 blur-[120px]"
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[#244147]/40 blur-[100px]"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 25, -15, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Dark teal backing panel — video shows through, mint card floats on top */}
      <div className="section-backing absolute inset-x-4 inset-y-6 -z-[5] rounded-3xl sm:inset-x-6" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
        {/* Top divider — slide reveal */}
        <motion.div
          className="w-full h-px bg-[#B8CEC2]/20 mb-12 sm:mb-16 md:mb-24 origin-left"
          {...dividerMotion}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-16 items-start">
          {/* Left Column: Heading */}
          <motion.div className="md:col-span-5" {...sectionMotion}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#B8CEC2]/40" />
              <span className="text-[11px] sm:text-xs text-[#B8CEC2]/80 uppercase tracking-[0.3em]">
                Core Philosophy
              </span>
            </div>
            <MaskRevealHeading text="What we do" />
          </motion.div>

          {/* Right Column: Description Text (mint glass card) */}
          <motion.div
            className="md:col-span-7"
            {...sectionMotion}
            transition={{ ...sectionTransition, delay: 0.15 }}
          >
            <div className="mint-card rounded-3xl p-6 sm:p-8">
              <BlurRevealParagraph
                text="Arthagama is an algorithmic trading firm based in Mumbai that researches, develops, and deploys systematic trading strategies using technology, quantitative analysis, and market data. We combine automation, disciplined execution, and robust risk management to identify opportunities across financial markets and generate sustainable, data-driven returns."
              />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          backdrop-filter: blur(28px) saturate(1.1);
          -webkit-backdrop-filter: blur(28px) saturate(1.1);
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2),
            inset 0 1px 1px rgba(184, 206, 194, 0.15);
          border: 1px solid rgba(184, 206, 194, 0.1);
        }

        .mint-card {
          background: rgba(184, 206, 194, 0.85);
          backdrop-filter: blur(14px) saturate(1.1);
          -webkit-backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
          box-shadow: 0 2px 16px rgba(18, 33, 36, 0.25);
        }
      `}</style>
    </section>
  )
}