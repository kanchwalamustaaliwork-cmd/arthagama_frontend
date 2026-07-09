// ContactHero.tsx
"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'
import AmbientGlassPanel from '@/src/components/backgrounds/AmbientGlassPanel'

export default function ContactHero() {
    return (
        <AmbientGlassPanel
            sectionClassName="cv-section pt-32 pb-14 sm:pt-36"
        >
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
                {/* Clip Path Reveal — whole heading wipes open left to right, not word-by-word */}
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ duration: 1.1, ease: easing, delay: 0.15 }}
                        className="text-2xl font-semibold leading-tight text-[#EAF1EC] sm:text-5xl md:text-3xl lg:text-5xl mx-auto max-w-3xl text-shadow-soft font-body"
                    >
                        Let's start a <em className="font-bold text-[#B8CEC2]">conversation</em>
                    </motion.h1>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easing, delay: 0.7 }}
                    className="mx-auto max-w-2xl text-sm italic tracking-wide text-[#B8CEC2]/90 sm:text-base"
                >
                    Whether you're exploring strategies, evaluating a partnership, or just have a
                    question — our team typically responds within one business day.
                </motion.p>
            </div>

            <style>{`
                .text-shadow-soft { text-shadow: 0 2px 14px rgba(0, 0, 0, 0.4); }
            `}</style>
        </AmbientGlassPanel>
    )
}