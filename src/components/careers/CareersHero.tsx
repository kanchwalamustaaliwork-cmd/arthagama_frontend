// CareersHero.tsx
"use client"

import { motion } from 'framer-motion'
import CultureStack from './CultureStack'
import { easing } from '../../constans/animation'
import TypewriterRole from '../ui/TypewriterRole'
import AmbientGlassPanel from '@/src/components/backgrounds/AmbientGlassPanel'

export default function CareersHero() {
  return (
    <section className="relative">
      <AmbientGlassPanel
        sectionClassName="cv-section pt-32 pb-16 sm:pt-36"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
          {/* Gradient Text Animation on the main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easing, delay: 0.15 }}
            className="text-2xl font-semibold leading-tight text-[#EAF1EC] sm:text-5xl md:text-3xl lg:text-5xl gradient-text-anim mx-auto max-w-4xl pb-2 "
          >
            Don't just find a <span className="font-bold text-[#B8CEC2]">Job</span>.
            <br />
            Build what moves the markets.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing, delay: 0.55 }}
            className="mx-auto max-w-2xl text-sm italic tracking-wide text-[#B8CEC2]/90 sm:text-base"
          >
            "We're hiring across <TypewriterRole /> — join a team that ships real
            systems, not slideware."
          </motion.p>
        </div>

        <style>{`
                    .text-shadow-soft { text-shadow: 0 2px 14px rgba(0, 0, 0, 0.4); }

                    .gradient-text-anim {
                        background: linear-gradient(90deg, #EAF1EC 0%, #B8CEC2 25%, #EAF1EC 50%, #B8CEC2 75%, #EAF1EC 100%);
                        background-size: 200% auto;
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                        animation: gradientShift 6s linear infinite;
                        text-shadow: none;
                    }
                    @keyframes gradientShift {
                        to { background-position: 200% center; }
                    }

                    .typewriter-cursor {
                        display: inline-block;
                        margin-left: 2px;
                        animation: blink 0.9s step-end infinite;
                    }
                    @keyframes blink {
                        50% { opacity: 0; }
                    }
                `}</style>
      </AmbientGlassPanel>

      {/* Life at Arthagama — scroll-pinned stacked card layers, kept outside the glass panel */}
      <CultureStack />

      <style>{`
                .culture-card {
                    background: rgba(184, 206, 194, 0.9);
                    border: 1px solid rgba(184, 206, 194, 1);
                    box-shadow: 0 4px 18px rgba(18, 33, 36, 0.15);
                    will-change: transform, opacity;
                }

                .carousel-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 9999px;
                    background: rgba(184, 206, 194, 0.3);
                    transition: width 0.3s ease, background 0.3s ease;
                }
                .carousel-dot-active {
                    width: 22px;
                    background: #B8CEC2;
                }
            `}</style>
    </section>
  )
}