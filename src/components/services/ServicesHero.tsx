// ServicesHero.tsx
"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'
import { BRAND_ON_DARK } from '@/src/utils/brand'
import AmbientGlassPanel from '@/src/components/backgrounds/AmbientGlassPanel'

export default function ServicesHero() {
    return (
        <AmbientGlassPanel
            sectionClassName="cv-section pt-32 pb-16 sm:pt-36"
        >
            <div
                className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center"
                style={{ perspective: 1200 }}
            >
                {/* Perspective Entrance — tilts in from depth rather than blurring or masking in */}
                <motion.h1
                    initial={{ opacity: 0, rotateX: 35, y: 40 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    transition={{ duration: 1, ease: easing, delay: 0.15 }}
                    style={{ transformOrigin: 'top center' }}
                    className="text-shadow-soft mx-auto max-w-3xl font-semibold text-2xl leading-tight text-[#EAF1EC] sm:text-3xl md:text-5xl"
                >
                    Services built for <em className="font-bold text-[#B8CEC2]">every stage</em> of your trading journey
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easing, delay: 0.6 }}
                    className="mx-auto max-w-2xl text-sm italic tracking-wide text-[#B8CEC2]/90 sm:text-bas"
                >
                    "From building a strategy to trading it live — explore how <strong className={BRAND_ON_DARK}>ARTHAGAMA</strong> can work with you."
                </motion.p>
            </div>

            <style>{`.text-shadow-soft { text-shadow: 0 2px 14px rgba(0,0,0,0.4); }`}</style>
        </AmbientGlassPanel>
    )
}