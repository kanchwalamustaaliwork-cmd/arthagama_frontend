"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'

import { easing } from '../../constans/animation'

const TOPICS = [
    { title: 'Market Regime Analysis', body: 'A monthly breakdown of prevailing volatility, trend, and correlation regimes across major indices.' },
    { title: 'Factor Performance Review', body: 'How momentum, value, and volatility factors performed over the past month, and what it signals going forward.' },
    { title: 'Strategy Viability Notes', body: 'Which strategy archetypes are structurally favored by current market conditions.' },
]

const GALLERY = [
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590650153855-d9e808231d41?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
]

function AccordionItem({
    title, body, isOpen, onToggle,
}: { title: string; body: string; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="accordion-item overflow-hidden rounded-2xl">
            <button onClick={onToggle} className="flex w-full items-center justify-between px-6 py-5 text-left">
                <span className="text-sm font-semibold text-[#1B3236] sm:text-base">{title}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: easing }}>
                    <ChevronDown className="h-4 w-4 text-[#244147]/60" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: easing }}
                    >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-[#244147]/75">{body}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function ResearchReportPage() {
    const [openIndex, setOpenIndex] = useState(0)
    const [activeImage, setActiveImage] = useState(0)

    return (
        <div className="relative min-h-screen w-full pb-24 pt-32 sm:pt-36">
            <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
                <Link href="/services" scroll={false} className="mb-8 inline-flex items-center gap-2 text-xs text-[#DCE7E1]/70 hover:text-[#EAF1EC]">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Services
                </Link>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easing }}>
                    <span className="mb-4 inline-block rounded-full bg-[#B8CEC2]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#B8CEC2]/80">
                        Service
                    </span>
                    <h1 className="text-shadow-soft mb-5 max-w-xl font-body text-4xl font-light leading-[1.1] text-[#EAF1EC] sm:text-5xl">
                        Research <em className="font-display italic">Report</em>
                    </h1>
                    <p className="text-shadow-soft max-w-lg text-sm leading-relaxed text-[#DCE7E1]/85 sm:text-base">
                        Data-driven research on market regimes, factor performance, and strategy viability — published monthly by our research desk.
                    </p>
                </motion.div>

                <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: easing }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-3"
                    >
                        {TOPICS.map((topic, i) => (
                            <AccordionItem
                                key={topic.title}
                                {...topic}
                                isOpen={openIndex === i}
                                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: easing, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={GALLERY[activeImage]}
                                    alt="Report preview"
                                    className="absolute inset-0 h-full w-full object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6, ease: easing }}
                                    loading="lazy"
                                />
                            </AnimatePresence>
                        </div>
                        <div className="mt-4 flex justify-center gap-2">
                            {GALLERY.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === i ? 'w-6 bg-[#B8CEC2]' : 'w-1.5 bg-[#B8CEC2]/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easing }}
                    viewport={{ once: true }}
                    className="cta-card mt-16 rounded-3xl p-8 text-center sm:p-10"
                >
                    <h2 className="mb-3 text-xl font-body font-semibold text-[#1B3236] sm:text-2xl">
                        Get the report in your inbox
                    </h2>
                    <Link
                        href="/contact"
                        scroll={false}
                        className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#244147] px-6 py-3 text-sm font-medium text-[#EAF1EC] transition-transform hover:scale-105"
                    >
                        Subscribe
                    </Link>
                </motion.div>
            </div>

            <style>{`
        .text-shadow-soft { text-shadow: 0 2px 14px rgba(0,0,0,0.4); }
        .accordion-item, .cta-card { background: rgba(184,206,194,0.9); border: 1px solid rgba(184,206,194,1); }
      `}</style>
        </div>
    )
}