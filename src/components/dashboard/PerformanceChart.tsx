'use client'

import { useState, useMemo } from 'react'
import FilterBar from './ui/FilterBar'

interface DataPoint { date: string; value: number }

interface PerformanceChartProps {
    data?: DataPoint[]
    height?: number
}

const TIME_FILTERS = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'ALL', value: 'ALL' },
]

// Generate smooth mock equity data
function generateMockData(points: number, startVal = 100000, volatility = 0.008, trend = 0.0006): DataPoint[] {
    const data: DataPoint[] = []
    let val = startVal
    const now = new Date()
    for (let i = points; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        val = val * (1 + trend + (Math.random() - 0.45) * volatility)
        data.push({ date: d.toISOString().slice(0, 10), value: Math.round(val) })
    }
    return data
}

const ALL_DATA = generateMockData(365)

const FILTER_SLICE: Record<string, number> = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'ALL': 365 }

export default function PerformanceChart({ height = 220 }: PerformanceChartProps) {
    const [filter, setFilter] = useState('1M')
    const [hoverIdx, setHoverIdx] = useState<number | null>(null)

    const data = useMemo(() => {
        const n = FILTER_SLICE[filter] ?? 30
        return ALL_DATA.slice(-n - 1)
    }, [filter])

    const minVal = Math.min(...data.map(d => d.value))
    const maxVal = Math.max(...data.map(d => d.value))
    const range = maxVal - minVal || 1

    const W = 800, H = height
    const PAD = { top: 16, right: 12, bottom: 28, left: 60 }
    const cW = W - PAD.left - PAD.right
    const cH = H - PAD.top - PAD.bottom

    const pts = data.map((d, i) => ({
        x: PAD.left + (i / (data.length - 1)) * cW,
        y: PAD.top + (1 - (d.value - minVal) / range) * cH,
        ...d,
    }))

    // Bezier curve path
    const path = pts.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`
        const prev = pts[i - 1]
        const cpx = (prev.x + p.x) / 2
        return `${acc} C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
    }, '')

    const areaPath = `${path} L ${pts[pts.length - 1].x} ${H - PAD.bottom} L ${PAD.left} ${H - PAD.bottom} Z`

    const hovPt = hoverIdx !== null ? pts[hoverIdx] : null
    const isProfit = data.length > 1 && data[data.length - 1].value >= data[0].value

    const fmt = (v: number) =>
        v >= 1000000 ? `₹${(v / 1000000).toFixed(2)}M` : `₹${(v / 1000).toFixed(1)}K`

    return (
        <div className="db-card" style={{ padding: '20px' }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.02em' }}>
                        {fmt(data[data.length - 1]?.value ?? 0)}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '3px', color: isProfit ? 'var(--db-profit)' : 'var(--db-loss)' }}>
                        {isProfit ? '▲' : '▼'} {fmt(Math.abs(data[data.length - 1]?.value - data[0]?.value))} ({
                            (((data[data.length - 1]?.value - data[0]?.value) / data[0]?.value) * 100).toFixed(2)
                        }%) this period
                    </div>
                </div>
                <FilterBar options={TIME_FILTERS} active={filter} onChange={setFilter} />
            </div>

            {/* SVG Chart */}
            <div style={{ position: 'relative' }}>
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
                    onMouseLeave={() => setHoverIdx(null)}
                    onMouseMove={e => {
                        const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
                        const relX = ((e.clientX - rect.left) / rect.width) * W
                        let closest = 0
                        let minDist = Infinity
                        pts.forEach((p, i) => {
                            const d = Math.abs(p.x - relX)
                            if (d < minDist) { minDist = d; closest = i }
                        })
                        setHoverIdx(closest)
                    }}
                >
                    <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isProfit ? '#38D996' : '#E35D6A'} stopOpacity="0.22" />
                            <stop offset="100%" stopColor={isProfit ? '#38D996' : '#E35D6A'} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    {[0.25, 0.5, 0.75, 1].map(r => (
                        <line
                            key={r}
                            x1={PAD.left} x2={W - PAD.right}
                            y1={PAD.top + r * cH} y2={PAD.top + r * cH}
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth={1}
                        />
                    ))}

                    {/* Y-axis labels */}
                    {[0, 0.5, 1].map(r => (
                        <text
                            key={r}
                            x={PAD.left - 8}
                            y={PAD.top + (1 - r) * cH + 4}
                            textAnchor="end"
                            fontSize={10}
                            fill="var(--db-text-muted)"
                        >
                            {fmt(minVal + r * range)}
                        </text>
                    ))}

                    {/* Area fill */}
                    <path d={areaPath} fill="url(#chartGrad)" />

                    {/* Line */}
                    <path
                        d={path}
                        fill="none"
                        stroke={isProfit ? 'var(--db-profit)' : 'var(--db-loss)'}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Hover line + dot */}
                    {hovPt && (
                        <>
                            <line
                                x1={hovPt.x} x2={hovPt.x}
                                y1={PAD.top} y2={H - PAD.bottom}
                                stroke="var(--db-border-hover)"
                                strokeWidth={1}
                                strokeDasharray="4 3"
                            />
                            <circle
                                cx={hovPt.x} cy={hovPt.y}
                                r={4.5}
                                fill={isProfit ? 'var(--db-profit)' : 'var(--db-loss)'}
                                stroke="var(--db-bg)"
                                strokeWidth={2}
                            />
                            {/* Tooltip */}
                            <foreignObject
                                x={Math.min(hovPt.x + 8, W - 130)}
                                y={Math.max(hovPt.y - 44, PAD.top)}
                                width={120}
                                height={40}
                            >
                                <div
                                    style={{
                                        background: 'var(--db-elevated)',
                                        border: '1px solid var(--db-border)',
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                        fontSize: '11px',
                                    }}
                                >
                                    <div style={{ color: 'var(--db-text-muted)' }}>{hovPt.date}</div>
                                    <div style={{ color: 'var(--db-text)', fontWeight: 600 }}>{fmt(hovPt.value)}</div>
                                </div>
                            </foreignObject>
                        </>
                    )}
                </svg>
            </div>
        </div>
    )
}
