/**
 * src/components/stockdashboard/shared/PriceChart.tsx
 *
 * High-performance vector SVG stock price chart with smooth gradient fill,
 * interactive crosshair cursor, hover tooltip, timeframe range switcher,
 * and integrated volume bars.
 */

'use client'

import React, { useState, useMemo } from 'react'
import { HistoricalCandle } from '@/src/types/stockdashboard'
import { formatStockPrice } from '@/src/utils/stockdashboard/formatters'

interface PriceChartProps {
    candles: HistoricalCandle[]
    range: string
    onRangeChange: (range: string) => void
    height?: number
    symbol?: string
}

const RANGES = ['1D', '1W', '1M', '3M', '1Y', '5Y', 'ALL']

export function PriceChart({
    candles,
    range,
    onRangeChange,
    height = 340,
    symbol = 'RELIANCE',
}: PriceChartProps) {
    const [hoverIdx, setHoverIdx] = useState<number | null>(null)

    // Derived statistics
    const { minPrice, maxPrice, priceRange, isPositive } = useMemo(() => {
        if (!candles || candles.length === 0) {
            return { minPrice: 0, maxPrice: 100, priceRange: 100, isPositive: true }
        }
        const prices = candles.map(c => c.close)
        const min = Math.min(...prices)
        const max = Math.max(...prices)
        const f = candles[0].close
        const l = candles[candles.length - 1].close
        return {
            minPrice: min,
            maxPrice: max,
            priceRange: max - min || 1,
            isPositive: l >= f,
        }
    }, [candles])

    const maxVolume = useMemo(() => {
        if (!candles || candles.length === 0) return 1
        return Math.max(...candles.map(c => c.volume)) || 1
    }, [candles])

    const strokeColor = isPositive ? '#38D996' : '#E35D6A'
    const gradientId = `chartGradient_${symbol}_${isPositive ? 'pos' : 'neg'}`

    // SVG coordinates computation
    const svgWidth = 800
    const padLeft = 10
    const padRight = 65
    const padTop = 20
    const chartHeight = height - 90
    const volumeHeight = 50
    const totalSvgHeight = height

    const points = useMemo(() => {
        if (!candles || candles.length === 0) return []
        const n = candles.length
        const usableWidth = svgWidth - padLeft - padRight

        return candles.map((c, i) => {
            const x = padLeft + (i / Math.max(n - 1, 1)) * usableWidth
            const y = padTop + (1 - (c.close - minPrice) / priceRange) * chartHeight
            const volY = totalSvgHeight - (c.volume / maxVolume) * volumeHeight
            return { x, y, volY, candle: c }
        })
    }, [candles, minPrice, priceRange, chartHeight, maxVolume, totalSvgHeight])

    // Generate SVG path strings
    const pathD = useMemo(() => {
        if (points.length === 0) return ''
        return points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')
    }, [points])

    const areaD = useMemo(() => {
        if (points.length === 0) return ''
        const first = points[0]
        const last = points[points.length - 1]
        const bottomY = padTop + chartHeight
        return `${pathD} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
    }, [pathD, points, chartHeight])

    const hoveredPoint = hoverIdx !== null && points[hoverIdx] ? points[hoverIdx] : points[points.length - 1]

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
            }}
        >
            {/* Top Toolbar: Active Price Inspection & Range Tabs */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}
            >
                <div>
                    {hoveredPoint && (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span
                                style={{
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    fontFamily: 'Consolas, monospace',
                                    color: 'var(--db-text, #F7FAF9)',
                                }}
                            >
                                {formatStockPrice(hoveredPoint.candle.close)}
                            </span>
                            <span style={{ fontSize: '11.5px', color: 'var(--db-text-muted, #708482)' }}>
                                {hoveredPoint.candle.date} • Vol: {(hoveredPoint.candle.volume / 100000).toFixed(2)} L
                            </span>
                        </div>
                    )}
                </div>

                {/* Range Filter Buttons */}
                <div
                    style={{
                        display: 'flex',
                        background: 'var(--db-elevated, #20353A)',
                        borderRadius: '8px',
                        padding: '3px',
                        gap: '2px',
                    }}
                >
                    {RANGES.map(r => {
                        const active = range === r
                        return (
                            <button
                                key={r}
                                onClick={() => onRangeChange(r)}
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11.5px',
                                    fontWeight: 600,
                                    background: active ? 'var(--db-teal, #244147)' : 'transparent',
                                    color: active ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {r}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* SVG Chart Area */}
            <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
                <svg
                    viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
                    preserveAspectRatio="none"
                    style={{ width: '100%', height: '100%', overflow: 'visible', cursor: 'crosshair' }}
                    onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const mouseX = e.clientX - rect.left
                        const usableWidth = svgWidth - padLeft - padRight
                        const ratio = Math.max(0, Math.min(1, (mouseX * (svgWidth / rect.width) - padLeft) / usableWidth))
                        const idx = Math.round(ratio * (points.length - 1))
                        setHoverIdx(idx)
                    }}
                    onMouseLeave={() => setHoverIdx(null)}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.28} />
                            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                        </linearGradient>
                    </defs>

                    {/* Horizontal Price Grid Lines & Axis Labels */}
                    {[0, 0.33, 0.66, 1].map((pct, i) => {
                        const y = padTop + pct * chartHeight
                        const priceLabel = maxPrice - pct * priceRange
                        return (
                            <g key={i}>
                                <line
                                    x1={padLeft}
                                    y1={y}
                                    x2={svgWidth - padRight}
                                    y2={y}
                                    stroke="var(--db-border, rgba(184, 206, 194, 0.08))"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={svgWidth - padRight + 8}
                                    y={y + 4}
                                    fill="var(--db-text-muted, #708482)"
                                    fontSize="10"
                                    fontFamily="Consolas, monospace"
                                >
                                    ₹{priceLabel.toFixed(1)}
                                </text>
                            </g>
                        )
                    })}

                    {/* Volume Histogram Bars */}
                    {points.map((pt, i) => (
                        <rect
                            key={`vol_${i}`}
                            x={pt.x - 2}
                            y={pt.volY}
                            width={Math.max(1, (svgWidth - padLeft - padRight) / points.length - 1.5)}
                            height={totalSvgHeight - pt.volY}
                            fill="rgba(184, 206, 194, 0.12)"
                        />
                    ))}

                    {/* Gradient Area Fill */}
                    {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}

                    {/* Line Stroke */}
                    {pathD && (
                        <path
                            d={pathD}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Crosshair Cursor */}
                    {hoveredPoint && (
                        <g>
                            {/* Vertical Line */}
                            <line
                                x1={hoveredPoint.x}
                                y1={padTop}
                                x2={hoveredPoint.x}
                                y2={totalSvgHeight}
                                stroke="var(--db-mint, #B8CEC2)"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                opacity="0.6"
                            />
                            {/* Circle Dot */}
                            <circle
                                cx={hoveredPoint.x}
                                cy={hoveredPoint.y}
                                r="4.5"
                                fill="var(--db-bg, #0F1719)"
                                stroke={strokeColor}
                                strokeWidth="2.5"
                            />
                        </g>
                    )}
                </svg>
            </div>
        </div>
    )
}
