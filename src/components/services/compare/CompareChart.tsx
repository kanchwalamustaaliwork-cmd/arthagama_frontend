import { motion } from 'framer-motion'
import type { Stock } from '../../../types/compareStocks'

const CHART_WIDTH = 560
const CHART_HEIGHT = 220

function buildPath(values: number[]) {
    const max = 25
    const min = -10
    const stepX = CHART_WIDTH / (values.length - 1)
    return values
        .map((v, i) => {
            const x = i * stepX
            const y = CHART_HEIGHT - ((v - min) / (max - min)) * CHART_HEIGHT
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(' ')
}

export default function CompareChart({ stocks }: { stocks: Stock[] }) {
    return (
        <div className="chart-card rounded-3xl p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#244147]/60">12-Month Performance</p>
                <div className="flex flex-wrap gap-3">
                    {stocks.map((s) => (
                        <span key={s.symbol} className="flex items-center gap-1.5 text-[11px] text-[#244147]/70">
                            <span className="h-1.5 w-4 rounded-full" style={{ background: s.color }} />
                            {s.symbol}
                        </span>
                    ))}
                </div>
            </div>

            <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="h-56 w-full sm:h-64">
                {/* Baseline (0%) */}
                <line
                    x1={0} y1={CHART_HEIGHT - ((0 - -10) / 35) * CHART_HEIGHT}
                    x2={CHART_WIDTH} y2={CHART_HEIGHT - ((0 - -10) / 35) * CHART_HEIGHT}
                    stroke="#244147" strokeOpacity={0.15} strokeWidth={1} strokeDasharray="4 4"
                />

                {stocks.map((stock, si) => (
                    <motion.path
                        key={stock.symbol}
                        d={buildPath(stock.performance.map((p) => p.value))}
                        fill="none"
                        stroke={stock.color}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: si * 0.15 }}
                    />
                ))}
            </svg>

            <style>{`.chart-card { background: rgba(184,206,194,0.92); border: 1px solid rgba(184,206,194,1); box-shadow: 0 20px 50px -20px rgba(18,33,36,0.35); }`}</style>
        </div>
    )
}