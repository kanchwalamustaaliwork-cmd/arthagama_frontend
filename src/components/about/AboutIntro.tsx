import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'

const maskContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }
const maskWord = {
    hidden: { clipPath: 'inset(0 0 100% 0)', y: 34, opacity: 0 },
    visible: {
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: easing },
    },
}

const blurContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.02, delayChildren: 0.1 } } }
const blurWord = {
    hidden: { opacity: 0, filter: 'blur(6px)', y: 8 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.5, ease: easing } },
}

function MaskHeading({ text }: { text: string }) {
    const words = text.split(' ')
    return (
        <motion.h2
            className="flex flex-wrap gap-x-3 font-body text-3xl font-light leading-tight text-[#EAF1EC] sm:text-4xl md:text-5xl"
            variants={maskContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
        >
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden">
                    <motion.span
                        variants={maskWord}
                        className={
                            word.toLowerCase() === 'arthagama' ? 'inline-block font-display italic' : 'inline-block'
                        }
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </motion.h2>
    )
}

function BlurParagraph({ text }: { text: string }) {
    const words = useMemo(() => text.split(' '), [text])
    return (
        <motion.p
            className="max-w-2xl text-base leading-relaxed text-[#244147]/85 sm:text-lg"
            variants={blurContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
        >
            {words.map((word, i) => (
                <motion.span key={i} variants={blurWord} className="mr-[0.28em] inline-block">
                    {word}
                </motion.span>
            ))}
        </motion.p>
    )
}

export default function AboutIntro() {
    return (
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-16">
            <div className="section-backing absolute inset-x-4 inset-y-6 -z-10 rounded-3xl sm:inset-x-6" />

            <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-16">
                <motion.div
                    className="md:col-span-5"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easing }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-px w-8 bg-[#B8CEC2]/40" />
                        <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8CEC2]/80 sm:text-xs">
                            Who We Are
                        </span>
                    </div>
                    <MaskHeading text="Built on Arthagama's philosophy" />
                </motion.div>

                <motion.div
                    className="md:col-span-7"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easing, delay: 0.15 }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <div className="mint-card rounded-3xl p-6 sm:p-8">
                        <BlurParagraph
                            text={`Arthagama was founded with a simple yet disciplined vision: to manage capital through systematic, rule-based investing driven by data, research, and technology rather than emotion. By developing and continuously refining quantitative trading strategies, we have built a strong foundation focused on consistency, risk management, and long-term performance.\n\nAs our expertise grew, so did our mission. Today, Arthagama partners with traders, investors, and institutions to transform their ideas into robust algorithmic trading solutions. We specialize in designing custom strategies tailored to each client's objectives, supported by comprehensive historical data, rigorous backtesting, and reliable server infrastructure for development, testing, and deployment.\n\nOur philosophy is straightforward—every strategy should be measurable, every decision should be data-driven, and every solution should be built with precision, transparency, and scalability at its core.`}
                        />
                    </div>
                </motion.div>
            </div>

            <style>{`
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          backdrop-filter: blur(28px) saturate(1.1);
          -webkit-backdrop-filter: blur(28px) saturate(1.1);
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(184, 206, 194, 0.15);
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