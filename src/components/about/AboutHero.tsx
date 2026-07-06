"use client"

import { motion } from 'framer-motion'
import TiltImage from '../ui/TiltImage'
import { easing } from '../../constans/animation'

export default function AboutHero() {
    return (
        <section className="relative px-4 pt-28 sm:px-6 sm:pt-32 md:px-10 lg:px-16">
            <div className="hero-banner relative mx-auto max-w-[1200px] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
                {/* Ambient looping visual — mesh gradient + drifting blobs, echoes the global video's palette */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full bg-[#B8CEC2]/25 blur-[110px]"
                        animate={{ x: [0, 50, -20, 0], y: [0, 30, -20, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute -bottom-32 -right-16 h-[420px] w-[420px] rounded-full bg-[#244147]/60 blur-[120px]"
                        animate={{ x: [0, -40, 20, 0], y: [0, -30, 20, 0] }}
                        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #B8CEC2 1px, transparent 1px)',
                            backgroundSize: '5px 5px',
                        }}
                    />
                </div>

                <div className="relative z-10 flex min-h-[62vh] flex-col items-center justify-center gap-8 px-6 py-24 text-center sm:min-h-[70vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 90, filter: 'blur(14px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.3, ease: easing, delay: 0.15 }}
                    >
                        <TiltImage
                            src="/assets/arthagama_name.png"
                            alt="Arthagama"
                            className="mx-auto w-full max-w-[280px] sm:max-w-[420px] lg:max-w-[520px]"
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: easing, delay: 0.7 }}
                        className="max-w-lg text-sm uppercase tracking-[0.3em] text-[#EAF1EC]/70 sm:text-base"
                    >
                        Where research meets execution
                    </motion.p>
                </div>
            </div>

            <style>{`
        .hero-banner {
          background: rgba(18, 33, 36, 0.55);
          backdrop-filter: blur(40px) saturate(1.1);
          -webkit-backdrop-filter: blur(40px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.15);
          box-shadow: 0 30px 90px -30px rgba(0, 0, 0, 0.55),
            inset 0 1px 1px rgba(184, 206, 194, 0.15);
        }
      `}</style>
        </section>
    )
}