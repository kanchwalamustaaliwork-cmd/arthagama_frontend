'use client'
import React, { useMemo } from 'react'
import type { MtfDailyTotal } from '@/src/types/mtf'
import { formatCr, formatDate } from '@/src/utils/mtf/formatters'

interface BookTrendChartProps {
  data: MtfDailyTotal[]
  loading?: boolean
}

export function BookTrendChart({ data, loading }: BookTrendChartProps) {
  const combined = useMemo(() => {
    return data
      .filter((d) => d.exchange === 'COMBINED' || d.exchange === 'NSE')
      .sort((a, b) => a.trade_date.localeCompare(b.trade_date))
  }, [data])

  if (loading) {
    return <div className="h-64 rounded-xl border bg-white p-4 animate-pulse" />
  }

  if (combined.length === 0) {
    return (
      <div className="h-64 rounded-xl border bg-white p-4 flex items-center justify-center text-sm text-gray-400">
        No MTF book trend data available
      </div>
    )
  }

  const values = combined.map((d) => d.outstanding_cr ?? 0)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal || 1

  const width = 600
  const height = 220
  const padL = 45
  const padR = 15
  const padT = 20
  const padB = 30
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  const points = combined.map((d, i) => {
    const x = padL + (i / (combined.length - 1 || 1)) * plotW
    const y = padT + plotH - (((d.outstanding_cr ?? 0) - minVal) / range) * plotH
    return { x, y, date: d.trade_date, val: d.outstanding_cr }
  })

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padT + plotH} L ${points[0].x} ${padT + plotH} Z`

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Total MTF Book Trend</h3>
          <p className="text-xs text-gray-500">Combined market margin debt over time</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-purple-700">{formatCr(values[values.length - 1])}</span>
          <p className="text-[10px] text-gray-400">Latest Book</p>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Y Axis Grid */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = padT + plotH * (1 - pct)
            const val = minVal + range * pct
            return (
              <g key={idx}>
                <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#f3f4f6" strokeDasharray="3 3" />
                <text x={padL - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-gray-400">
                  {Math.round(val / 1000)}k
                </text>
              </g>
            )
          })}
          {/* Area & Line */}
          <path d={areaD} fill="url(#bookGrad)" />
          <path d={pathD} fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
          {/* X Axis Labels */}
          {points.length > 1 && (
            <>
              <text x={points[0].x} y={height - 8} textAnchor="start" className="text-[9px] fill-gray-400">
                {formatDate(points[0].date)}
              </text>
              <text x={points[points.length - 1].x} y={height - 8} textAnchor="end" className="text-[9px] fill-gray-400">
                {formatDate(points[points.length - 1].date)}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  )
}

