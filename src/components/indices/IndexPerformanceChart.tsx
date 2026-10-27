'use client'

/**
 * src/components/indices/IndexPerformanceChart.tsx
 *
 * Interactive SVG performance chart with time range selector and cursor tooltip.
 */

import { useState, useMemo, useRef } from 'react'
import { IndexPeriod } from '@/src/types/indices'
import { useIndexPerformance } from '@/src/hooks/indices/useIndexPerformance'
import { formatIndexValue } from '@/src/utils/indices/format-index-value'

interface IndexPerformanceChartProps {
    indexId: number
    initialPeriod?: IndexPeriod
}

const PERIODS: IndexPeriod[] = ['1D', '1W', '1M', '3M', '6M', '1Y', 'YTD', 'MAX']

export default function IndexPerformanceChart({
    indexId,
    initialPeriod = '1M',
}: IndexPerformanceChartProps) {
    const { period, setPeriod, history, loading } = useIndexPerformance(indexId, initialPeriod)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Chart dimensions
    const width = 800
    const height = 300
    const padTop = 20
    const padBottom = 35
    const padLeft = 10
    const padRight = 55

    const { minVal, maxVal, pathD, areaD, points, isPositive } = useMemo(() => {
        if (!history || history.length === 0) {
            return { minVal: 0, maxVal: 0, pathD: '', areaD: '', points: [], isPositive: true }
        }

        const values = history.map(p => p.value)
        const min = Math.min(...values)
        const max = Math.max(...values)
        const range = max - min || 1

        const chartW = width - padLeft - padRight
        const chartH = height - padTop - padBottom

        const pts = history.map((pt, idx) => {
            const x = padLeft + (idx / (history.length - 1)) * chartW
            const y = padTop + (1 - (pt.value - min) / range) * chartH
            return { x, y, pt }
        })

        const pathStr = pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
        const lastX = pts[pts.length - 1]?.x ?? width
        const firstX = pts[0]?.x ?? 0
        const bottomY = height - padBottom
        const areaStr = `${pathStr} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`

        const startVal = values[0]
        const endVal = values[values.length - 1]
        const positive = endVal >= startVal

        return {
            minVal: min,
            maxVal: max,
            pathD: pathStr,
            areaD: areaStr,
            points: pts,
            isPositive: positive,
        }
    }, [history, width, height, padTop, padBottom, padLeft, padRight])

    const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!containerRef.current || points.length === 0) return
        const rect = containerRef.current.getBoundingClientRect()
        const mouseX = ((e.clientX - rect.left) / rect.width) * width
        // Find closest point
        let closestIdx = 0
        let minDiff = Infinity
        points.forEach((p, idx) => {
            const diff = Math.abs(p.x - mouseX)
            if (diff < minDiff) {
                minDiff = diff
                closestIdx = idx
            }
        })
        setHoverIndex(closestIdx)
    }

    const strokeColor = isPositive ? 'var(--db-profit)' : 'var(--db-loss)'
    const gradientId = `index_chart_grad_${indexId}`

    return (
        <div className="db-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Toolbar: Title & Period Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)' }}>
                        Historical Performance
                    </h4>
                    {activePoint && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--db-text)' }}>
                                {formatIndexValue(activePoint.pt.value)}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                                ({activePoint.pt.date})
                            </span>
                        </div>
                    )}
                </div>

                {/* Period Filter Tabs */}
                <div
                    style={{
                        display: 'flex',
                        background: 'var(--db-elevated)',
                        borderRadius: 'var(--db-radius-sm)',
                        padding: '3px',
                        gap: '2px',
                    }}
                >
                    {PERIODS.map(p => {
                        const active = period === p
                        return (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                style={{
                                    border: 'none',
                                    background: active ? 'var(--db-teal)' : 'transparent',
                                    color: active ? 'var(--db-text)' : 'var(--db-text-muted)',
                                    fontWeight: active ? 600 : 500,
                                    fontSize: '11.5px',
                                    padding: '4px 10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'all var(--db-transition)',
                                }}
                            >
                                {p}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Chart Area */}
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: `${height}px`,
                    minHeight: '260px',
                }}
            >
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div className="db-skeleton" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                    </div>
                ) : points.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--db-text-muted)', fontSize: '13px' }}>
                        No chart history available for this period.
                    </div>
                ) : (
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        preserveAspectRatio="none"
                        style={{ width: '100%', height: '100%', overflow: 'visible', cursor: 'crosshair' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                            </linearGradient>
                        </defs>

                        {/* Horizontal Price Guidelines */}
                        <line
                            x1={padLeft}
                            y1={padTop}
                            x2={width - padRight}
                            y2={padTop}
                            stroke="var(--db-border)"
                            strokeDasharray="4 4"
                        />
                        <text
                            x={width - padRight + 8}
                            y={padTop + 4}
                            fill="var(--db-text-muted)"
                            fontSize="10"
                        >
                            {formatIndexValue(maxVal, 1)}
                        </text>

                        <line
                            x1={padLeft}
                            y1={height - padBottom}
                            x2={width - padRight}
                            y2={height - padBottom}
                            stroke="var(--db-border)"
                            strokeDasharray="4 4"
                        />
                        <text
                            x={width - padRight + 8}
                            y={height - padBottom + 4}
                            fill="var(--db-text-muted)"
                            fontSize="10"
                        >
                            {formatIndexValue(minVal, 1)}
                        </text>

                        {/* Gradient Area Fill */}
                        <path d={areaD} fill={`url(#${gradientId})`} />

                        {/* Main Trend Line */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Interactive Crosshair & Tooltip Point */}
                        {activePoint && (
                            <g>
                                <line
                                    x1={activePoint.x}
                                    y1={padTop}
                                    x2={activePoint.x}
                                    y2={height - padBottom}
                                    stroke="var(--db-mint)"
                                    strokeWidth="1"
                                    strokeDasharray="2 2"
                                />
                                <circle
                                    cx={activePoint.x}
                                    cy={activePoint.y}
                                    r="4.5"
                                    fill="var(--db-bg)"
                                    stroke={strokeColor}
                                    strokeWidth="2.5"
                                />
                            </g>
                        )}

                        {/* Time labels on bottom axis */}
                        {points.length > 1 && (
                            <>
                                <text
                                    x={points[0].x}
                                    y={height - 10}
                                    fill="var(--db-text-muted)"
                                    fontSize="10"
                                >
                                    {points[0].pt.date}
                                </text>
                                <text
                                    x={points[Math.floor(points.length / 2)].x}
                                    y={height - 10}
                                    textAnchor="middle"
                                    fill="var(--db-text-muted)"
                                    fontSize="10"
                                >
                                    {points[Math.floor(points.length / 2)].pt.date}
                                </text>
                                <text
                                    x={points[points.length - 1].x}
                                    y={height - 10}
                                    textAnchor="end"
                                    fill="var(--db-text-muted)"
                                    fontSize="10"
                                >
                                    {points[points.length - 1].pt.date}
                                </text>
                            </>
                        )}
                    </svg>
                )}
            </div>
        </div>
    )
}
