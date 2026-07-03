import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'

import { easing } from '../../constans/animation'

const STEPS = [
    { title: 'Tell us your objective', body: 'Share your risk appetite, capital, and target market — equities, derivatives, or multi-asset.' },
    { title: 'We design the strategy', body: 'Our quant team builds a systematic model tailored to your constraints, grounded in research, not guesswork.' },
    { title: 'Backtest & validate', body: 'The strategy is stress-tested across historical regimes before you ever see it deployed live.' },
    { title: 'Deploy & monitor', body: 'Once approved, it runs live with continuous monitoring and risk oversight from our team.' },
]

export default function CustomStrategyBuilderPage() {
    return (
        <div className="relative min-h-screen w-full pb-24 pt-32 sm:pt-36">
            <div className="mx-auto max-w-[900px] px-5 sm:px-6">
                <Link to="/services" className="mb-8 inline-flex items-center gap-2 text-xs text-[#DCE7E1]/70 hover:text-[#EAF1EC]">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Services
                </Link>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easing }}>
                    <span className="mb-4 inline-block rounded-full bg-[#B8CEC2]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#B8CEC2]/80">
                        Service
                    </span>
                    <h1 className="text-shadow-soft mb-5 max-w-xl font-body text-4xl font-light leading-[1.1] text-[#EAF1EC] sm:text-5xl">
                        Custom Strategy <em className="font-display italic">Builder</em>
                    </h1>
                    <p className="text-shadow-soft max-w-lg text-sm leading-relaxed text-[#DCE7E1]/85 sm:text-base">
                        A trading strategy designed around you — your capital, your risk tolerance, your market view — built and validated by our research desk from day one.
                    </p>
                </motion.div>

                {/* Timeline Progress Animation */}
                <div className="relative mt-20 flex flex-col gap-14 pl-2">
                    <motion.div
                        className="absolute left-[19px] top-2 w-px origin-top bg-[#B8CEC2]/25"
                        style={{ height: 'calc(100% - 16px)' }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 1.4, ease: easing }}
                        viewport={{ once: true, margin: '-100px' }}
                    />

                    {STEPS.map((step, i) => (
                        <motion.div
                            key={step.title}
                            className="relative flex gap-6"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: easing, delay: i * 0.15 }}
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <motion.div
                                className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#B8CEC2] text-[#1B3236]"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: i * 0.15 + 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Check className="h-4 w-4" />
                            </motion.div>
                            <div className="pt-1.5">
                                <h3 className="mb-1.5 text-base font-semibold text-[#EAF1EC] sm:text-lg">{step.title}</h3>
                                <p className="max-w-md text-sm leading-relaxed text-[#DCE7E1]/75">{step.body}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easing }}
                    viewport={{ once: true }}
                    className="cta-card mt-20 rounded-3xl p-8 text-center sm:p-10"
                >
                    <h2 className="mb-3 text-xl font-body font-semibold text-[#1B3236] sm:text-2xl">
                        Ready to build your strategy?
                    </h2>
                    <p className="mx-auto mb-6 max-w-sm text-sm text-[#244147]/75">
                        Start a conversation with our research team — no commitment required.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 rounded-full bg-[#244147] px-6 py-3 text-sm font-medium text-[#EAF1EC] transition-transform hover:scale-105"
                    >
                        Get in touch
                    </Link>
                </motion.div>
            </div>

            <style>{`
        .text-shadow-soft { text-shadow: 0 2px 14px rgba(0,0,0,0.4); }
        .cta-card { background: rgba(184,206,194,0.92); border: 1px solid rgba(184,206,194,1); }
      `}</style>
        </div>
    )
}