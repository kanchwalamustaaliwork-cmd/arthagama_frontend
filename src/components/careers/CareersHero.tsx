import { motion } from 'framer-motion'
import CultureStack from './CultureStack'
import { easing } from '../../constans/animation'
import TypewriterRole from '../ui/TypewriterRole'


export default function CareersHero() {
    return (
        <section className="cv-section relative">
            <div className="px-5 pt-32 pb-16 sm:px-6 sm:pt-36 md:px-10 lg:px-16">
                <div className="mx-auto max-w-[1200px]">
                    {/* Hero */}
                    <div className="mb-16 text-center sm:mb-20">
                        <motion.div
                            className="mb-5 flex items-center justify-center gap-3"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: easing }}
                        >
                            <div className="h-px w-8 bg-[#B8CEC2]/40" />
                            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8CEC2]/80">
                                Careers
                            </span>
                        </motion.div>

                        {/* Gradient Text Animation on the main heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: easing, delay: 0.15 }}
                            className="gradient-text-anim mx-auto max-w-3xl font-body text-4xl font-light leading-[1.1] sm:text-5xl md:text-6xl"
                        >
                            Build the future of{' '}
                            <span className="block sm:inline">algorithmic trading</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: easing, delay: 0.55 }}
                            className="text-shadow-soft mx-auto mt-6 max-w-lg text-sm text-[#DCE7E1]/85 sm:text-base"
                        >
                            We're hiring across <TypewriterRole /> — join a team that ships real
                            systems, not slideware.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Life at Arthagama — scroll-pinned stacked card layers */}
            <CultureStack />

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