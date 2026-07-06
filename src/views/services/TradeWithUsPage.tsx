"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, ShieldCheck, Zap } from 'lucide-react'

import { easing } from '../../constans/animation'

const FEATURES = [
    { icon: Zap, title: 'Automated execution', body: 'Orders route directly to your broker via low-latency APIs — no manual intervention.' },
    { icon: ShieldCheck, title: 'Risk-managed', body: 'Every strategy runs within predefined exposure and drawdown limits.' },
    { icon: TrendingUp, title: 'Transparent reporting', body: 'Live performance dashboards, updated continuously, always visible to you.' },
]

export default function TradeWithUsPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden pb-24 pt-32 sm:pt-36">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
                <Link href="/services" scroll={false} className="mb-8 inline-flex items-center gap-2 text-xs text-[#DCE7E1]/70 hover:text-[#EAF1EC]">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Services
                </Link>

                <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easing }}>
                        <span className="mb-4 inline-block rounded-full bg-[#B8CEC2]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#B8CEC2]/80">
                            Service
                        </span>
                        <h1 className="text-shadow-soft mb-5 font-body text-4xl font-light leading-[1.1] text-[#EAF1EC] sm:text-5xl">
                            Trade <em className="font-display italic">with us</em>
                        </h1>
                        <p className="text-shadow-soft max-w-md text-sm leading-relaxed text-[#DCE7E1]/85 sm:text-base">
                            Let our systematic strategies trade on your behalf through a fully automated, broker-integrated execution pipeline — while you stay in full view of every position.
                        </p>

                        {/* CTA Pulse — subtle */}
                        <motion.div
                            className="mt-8 inline-block"
                            animate={{ opacity: [1, 0.75, 1] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Link
                                href="/contact"
                                scroll={false}
                                className="inline-flex items-center gap-2 rounded-full bg-[#244147] px-6 py-3.5 text-sm font-medium text-[#EAF1EC] transition-transform hover:scale-105"
                            >
                                Start trading with us
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Floating Device / Dashboard Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: easing, delay: 0.2 }}
                    >
                        <motion.div
                            className="dashboard-mock rounded-3xl p-5 sm:p-6"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-xs uppercase tracking-[0.15em] text-[#244147]/60">Live Portfolio</p>
                                <span className="flex items-center gap-1.5 text-[11px] text-[#244147]/70">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#244147] opacity-60" />
                                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#244147]" />
                                    </span>
                                    Live
                                </span>
                            </div>
                            <div className="mb-5 text-3xl font-display italic text-[#1B3236]">+18.6%</div>
                            <div className="flex items-end gap-1.5">
                                {[40, 55, 45, 70, 60, 85, 75, 95].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex-1 rounded-t bg-[#244147]/70"
                                        style={{ height: h }}
                                        initial={{ scaleY: 0 }}
                                        whileInView={{ scaleY: 1 }}
                                        transition={{ duration: 0.5, ease: easing, delay: i * 0.05 }}
                                        viewport={{ once: true }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: easing, delay: i * 0.1 }}
                            viewport={{ once: true, margin: '-80px' }}
                            whileHover={{ y: -4 }}
                            className="feature-card rounded-2xl p-6"
                        >
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#244147]/10 text-[#244147]">
                                <f.icon className="h-4.5 w-4.5" />
                            </div>
                            <h3 className="mb-1.5 text-sm font-semibold text-[#1B3236]">{f.title}</h3>
                            <p className="text-sm leading-relaxed text-[#244147]/75">{f.body}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
        .text-shadow-soft { text-shadow: 0 2px 14px rgba(0,0,0,0.4); }
        .dashboard-mock, .feature-card { background: rgba(184,206,194,0.92); border: 1px solid rgba(184,206,194,1); box-shadow: 0 25px 60px -25px rgba(18,33,36,0.4); }
      `}</style>
        </div>
    )
}