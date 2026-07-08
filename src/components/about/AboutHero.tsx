// app/about/AboutHero.tsx
"use client"

import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'
import AmbientGlassPanel from '@/src/components/backgrounds/AmbientGlassPanel'

export default function AboutHero() {
    return (
        <AmbientGlassPanel sectionClassName="pt-28 sm:pt-32">
            <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 90, filter: 'blur(14px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.3, ease: easing, delay: 0.15 }}
                    className="max-w-5xl space-y-6 text-center"
                >
                    <h1 className="text-2xl font-semibold leading-tight text-[#EAF1EC] sm:text-5xl md:text-3xl lg:text-5xl">
                        Building the Future of{" "}
                        <span className="font-bold text-[#B8CEC2]">Algorithmic Trading</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easing, delay: 0.7 }}
                    className="mx-auto max-w-2xl text-sm italic tracking-wide text-[#B8CEC2]/90 sm:text-base"
                >
                    "Where innovation meets precision, and every decision is backed by data."
                </motion.p>
            </div>
        </AmbientGlassPanel>
    )
}