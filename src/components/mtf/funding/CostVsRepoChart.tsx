'use client'
import React from 'react'
import type { CostVsRepoPoint } from '@/src/types/mtf'
import { formatPct, formatDate } from '@/src/utils/mtf/formatters'

interface CostVsRepoChartProps {
  data: CostVsRepoPoint[]
  loading?: boolean
}

export function CostVsRepoChart({ data, loading }: CostVsRepoChartProps) {
  const sorted = [...data].sort((a, b) => a.as_of.localeCompare(b.as_of))

  if (loading) return <div className="h-60 rounded-xl border bg-white p-4 animate-pulse" />
  if (sorted.length === 0) {
    return (
      <div className="h-60 rounded-xl border bg-white p-4 flex items-center justify-center text-xs text-gray-400">
        No borrowing cost vs repo rate data available
      </div>
    )
  }

  const costs = sorted.map((d) => d.borrowing_cost_pct ?? 0)
  const repos = sorted.map((d) => d.repo_rate_pct ?? 0)
  const minVal = Math.min(...costs, ...repos)
  const maxVal = Math.max(...costs, ...repos)
  const range = maxVal - minVal || 1

  const width = 550
  const height = 180
  const padL = 35
  const padR = 10
  const padT = 20
  const padB = 25
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  const toPoints = (vals: (number | null)[]) =>
    sorted.map((d, i) => ({
      x: padL + (i / (sorted.length - 1 || 1)) * plotW,
      y: padT + plotH - (((vals[i] ?? 0) - minVal) / range) * plotH,
    }))

  const costPoints = toPoints(costs)
  const repoPoints = toPoints(repos)

  const toD = (pts: { x: number; y: number }[]) =>
    pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Borrowing Cost vs RBI Repo Rate</h3>
          <p className="text-xs text-gray-500">Broker CP issuance yields vs benchmark policy rate</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-purple-700 font-medium">
            <span className="w-2.5 h-0.5 bg-purple-600 inline-block" /> CP Cost
          </span>
          <span className="flex items-center gap-1 text-gray-500 font-medium">
            <span className="w-2.5 h-0.5 bg-gray-400 inline-block stroke-dash" /> Repo Rate
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <path d={toD(costPoints)} fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
        <path d={toD(repoPoints)} fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x={padL} y={height - 5} textAnchor="start" className="text-[9px] fill-gray-400">
          {formatDate(sorted[0].as_of)}
        </text>
        <text x={width - padR} y={height - 5} textAnchor="end" className="text-[9px] fill-gray-400">
          {formatDate(sorted[sorted.length - 1].as_of)}
        </text>
      </svg>
    </div>
  )
}

