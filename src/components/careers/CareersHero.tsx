"use client"

import { motion } from 'framer-motion'
import CultureStack from './CultureStack'
import { easing } from '../../constans/animation'
import TypewriterRole from '../ui/TypewriterRole'
import AmbientGlassPanel from '@/src/components/backgrounds/AmbientGlassPanel'

interface CareersHeroProps {
  heading?: string | null
  subtitle?: string | null
  culturePoints?: Array<{ title: string; body: string }>
  typewriterRoles?: string[]
}

export default function CareersHero({
  heading,
  subtitle,
  culturePoints,
  typewriterRoles,
}: CareersHeroProps) {
  const mainHeading = heading ?? (
    <>
      Don't just find a <span className="font-bold text-[#B8CEC2]">Job</span>.
      <br />
      Build what moves the markets.
    </>
  )

  return (
    <section className="relative">
      <AmbientGlassPanel sectionClassName="cv-section pt-32 pb-16 sm:pt-36">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easing, delay: 0.15 }}
            className="text-2xl font-semibold leading-tight text-[#EAF1EC] sm:text-5xl md:text-3xl lg:text-5xl gradient-text-anim mx-auto max-w-4xl pb-2"
          >
            {mainHeading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing, delay: 0.55 }}
            className="mx-auto max-w-2xl text-sm italic tracking-wide text-[#B8CEC2]/90 sm:text-base"
          >
            {subtitle ? (
              subtitle
            ) : (
              <>
                "We're hiring across <TypewriterRole roles={typewriterRoles} /> — join a team that ships real systems, not slideware."
              </>
            )}
          </motion.p>
        </div>

        <style>{`
          .gradient-text-anim {
            background: linear-gradient(90deg, #EAF1EC 0%, #B8CEC2 25%, #EAF1EC 50%, #B8CEC2 75%, #EAF1EC 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradientShift 6s linear infinite;
          }
          @keyframes gradientShift {
            to { background-position: 200% center; }
          }
          .typewriter-cursor {
            display: inline-block;
            margin-left: 2px;
            animation: blink 0.9s step-end infinite;
          }
          @keyframes blink { 50% { opacity: 0; } }
        `}</style>
      </AmbientGlassPanel>

      <CultureStack culturePoints={culturePoints} />
    </section>
  )
}