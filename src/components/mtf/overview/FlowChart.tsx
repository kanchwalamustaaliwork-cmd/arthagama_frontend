'use client'
import React from 'react'
import type { MtfDailyFlow } from '@/src/types/mtf'
import { formatCr, formatDate } from '@/src/utils/mtf/formatters'

interface FlowChartProps {
  data: MtfDailyFlow[]
  loading?: boolean
}

export function FlowChart({ data, loading }: FlowChartProps) {
  const sorted = [...data].sort((a, b) => a.trade_date.localeCompare(b.trade_date)).slice(-60)

  if (loading) return <div className="h-64 rounded-xl border bg-white p-4 animate-pulse" />
  if (sorted.length === 0) {
    return (
      <div className="h-64 rounded-xl border bg-white p-4 flex items-center justify-center text-sm text-gray-400">
        No leverage flow data available
      </div>
    )
  }

  const flows = sorted.map((d) => d.net_flow_cr ?? 0)
  const maxAbs = Math.max(...flows.map(Math.abs), 10)

  const width = 600
  const height = 220
  const padL = 40
  const padR = 10
  const padT = 20
  const padB = 30
  const plotW = width - padL - padR
  const plotH = height - padT - padB
  const zeroY = padT + plotH / 2

  const barW = Math.max(2, plotW / sorted.length - 1)

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Daily Net Leverage Flow</h3>
          <p className="text-xs text-gray-500">Fresh debt minus liquidations (last 60 sessions)</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Net Inflow
          </span>
          <span className="flex items-center gap-1 text-rose-500 font-medium">
            <span className="w-2 h-2 rounded-sm bg-rose-500 inline-block" /> Net Liquidation
          </span>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Zero Line */}
          <line x1={padL} y1={zeroY} x2={width - padR} y2={zeroY} stroke="#9ca3af" strokeWidth="1" strokeDasharray="2 2" />
          <text x={padL - 6} y={zeroY + 3} textAnchor="end" className="text-[9px] fill-gray-400">
            0
          </text>
          {/* Top/Bottom Grid */}
          <text x={padL - 6} y={padT + 8} textAnchor="end" className="text-[9px] fill-gray-400">
            +{Math.round(maxAbs)}
          </text>
          <text x={padL - 6} y={height - padB} textAnchor="end" className="text-[9px] fill-gray-400">
            -{Math.round(maxAbs)}
          </text>

          {/* Bars */}
          {sorted.map((d, i) => {
            const x = padL + i * (plotW / sorted.length)
            const val = d.net_flow_cr ?? 0
            const barH = (Math.abs(val) / maxAbs) * (plotH / 2)
            const y = val >= 0 ? zeroY - barH : zeroY
            const color = val >= 0 ? '#10b981' : '#f43f5e'
            return <rect key={d.trade_date} x={x} y={y} width={barW} height={Math.max(1, barH)} fill={color} rx="1" />
          })}

          {/* Date Axis */}
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

