"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp'

import { easing } from '../../constans/animation'

const STATS = [
    { target: 1.84, decimals: 2, label: 'Avg. Sharpe Ratio', suffix: '' },
    { target: 62, decimals: 0, label: 'Win Rate', suffix: '%' },
    { target: 8.4, decimals: 1, label: 'Max Drawdown', suffix: '%' },
    { target: 12, decimals: 0, label: 'Years Backtested', suffix: '+' },
]

function StatCounter({ target, decimals, label, suffix }: (typeof STATS)[number]) {
    const ref = useCountUp(target, decimals)
    return (
        <div className="stat-block rounded-2xl p-6 text-center">
            <div className="text-3xl font-display italic text-[#1B3236] sm:text-4xl">
                <span ref={ref}>0</span>{suffix}
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#244147]/65">{label}</p>
        </div>
    )
}

const CHART_PATH = 'M0,140 C40,130 60,110 90,115 C130,120 150,80 190,85 C230,90 250,50 290,55 C330,60 350,20 400,15'

export default function BacktestPage() {
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
                        Backtest your <em className="font-display italic">edge</em>
                    </h1>
                    <p className="text-shadow-soft max-w-lg text-sm leading-relaxed text-[#DCE7E1]/85 sm:text-base">
                        Before a strategy ever touches live capital, it's run against years of historical data — cost-aware, slippage-modeled, and stress-tested across market regimes.
                    </p>
                </motion.div>

                {/* Chart Drawing Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easing }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="chart-card relative mt-16 overflow-hidden rounded-3xl p-6 sm:p-8"
                >
                    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#244147]/55">Sample Equity Curve</p>
                    <svg viewBox="0 0 400 160" className="h-40 w-full sm:h-48">
                        <motion.path
                            d={CHART_PATH}
                            fill="none"
                            stroke="#244147"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.6, ease: easing }}
                            viewport={{ once: true, margin: '-100px' }}
                        />
                    </svg>
                </motion.div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easing }}
                    viewport={{ once: true }}
                    className="cta-card mt-16 rounded-3xl p-8 text-center sm:p-10"
                >
                    <h2 className="mb-3 text-xl font-body font-semibold text-[#1B3236] sm:text-2xl">
                        Want to see your idea backtested?
                    </h2>
                    <Link
                        href="/contact"
                        scroll={false}
                        className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#244147] px-6 py-3 text-sm font-medium text-[#EAF1EC] transition-transform hover:scale-105"
                    >
                        Request a backtest
                    </Link>
                </motion.div>
            </div>

            <style>{`
        .text-shadow-soft { text-shadow: 0 2px 14px rgba(0,0,0,0.4); }
        .chart-card, .stat-block, .cta-card { background: rgba(184,206,194,0.9); border: 1px solid rgba(184,206,194,1); }
        .chart-card { box-shadow: 0 20px 50px -20px rgba(18,33,36,0.35); }
      `}</style>
        </div>
    )
}