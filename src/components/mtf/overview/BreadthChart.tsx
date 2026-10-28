'use client'
import React from 'react'
import type { MtfDailyBreadth } from '@/src/types/mtf'
import { formatDate } from '@/src/utils/mtf/formatters'

interface BreadthChartProps {
  data: MtfDailyBreadth[]
  loading?: boolean
}

export function BreadthChart({ data, loading }: BreadthChartProps) {
  const sorted = [...data].sort((a, b) => a.trade_date.localeCompare(b.trade_date))

  if (loading) return <div className="h-64 rounded-xl border bg-white p-4 animate-pulse" />
  if (sorted.length === 0) {
    return (
      <div className="h-64 rounded-xl border bg-white p-4 flex items-center justify-center text-sm text-gray-400">
        No breadth data available
      </div>
    )
  }

  const counts = sorted.map((d) => d.stocks_funded_count ?? 0)
  const maxCount = Math.max(...counts, 100)
  const minCount = Math.min(...counts, 0)
  const range = maxCount - minCount || 1

  const width = 600
  const height = 220
  const padL = 40
  const padR = 10
  const padT = 20
  const padB = 30
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  const points = sorted.map((d, i) => {
    const x = padL + (i / (sorted.length - 1 || 1)) * plotW
    const y = padT + plotH - (((d.stocks_funded_count ?? 0) - minCount) / range) * plotH
    return { x, y, count: d.stocks_funded_count }
  })

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">MTF Market Breadth</h3>
          <p className="text-xs text-gray-500">Number of funded securities actively holding margin debt</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-blue-600">{counts[counts.length - 1]} stocks</span>
          <p className="text-[10px] text-gray-400">Current breadth</p>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = padT + plotH * (1 - pct)
            const val = Math.round(minCount + range * pct)
            return (
              <g key={idx}>
                <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#f3f4f6" strokeDasharray="3 3" />
                <text x={padL - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-gray-400">
                  {val}
                </text>
              </g>
            )
          })}
          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          {/* X axis */}
          <text x={padL} y={height - 8} textAnchor="start" className="text-[9px] fill-gray-400">
            {formatDate(sorted[0].trade_date)}
          </text>
          <text x={width - padR} y={height - 8} textAnchor="end" className="text-[9px] fill-gray-400">
            {formatDate(sorted[sorted.length - 1].trade_date)}
          </text>
        </svg>
      </div>
    </div>
  )
}

