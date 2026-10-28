'use client'
import React from 'react'
import type { MtfBrokerHistory } from '@/src/types/mtf'
import { formatCr, formatDate } from '@/src/utils/mtf/formatters'

interface BrokerHistoryChartProps {
  brokerName: string
  data: MtfBrokerHistory[]
  loading?: boolean
}

export function BrokerHistoryChart({ brokerName, data, loading }: BrokerHistoryChartProps) {
  const sorted = [...data].sort((a, b) => a.as_of.localeCompare(b.as_of))

  if (loading) return <div className="h-56 rounded-xl border bg-white p-4 animate-pulse" />
  if (sorted.length === 0) {
    return (
      <div className="h-56 rounded-xl border bg-white p-4 flex items-center justify-center text-xs text-gray-400">
        Select a broker to view historical disclosed MTF book
      </div>
    )
  }

  const values = sorted.map((d) => d.book_cr ?? 0)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal || 1

  const width = 500
  const height = 180
  const padL = 40
  const padR = 10
  const padT = 20
  const padB = 25
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  const points = sorted.map((d, i) => {
    const x = padL + (i / (sorted.length - 1 || 1)) * plotW
    const y = padT + plotH - (((d.book_cr ?? 0) - minVal) / range) * plotH
    return { x, y, date: d.as_of, val: d.book_cr }
  })

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">{brokerName} Disclosed Book History</h4>
        <span className="text-xs font-bold text-purple-700">{formatCr(values[values.length - 1])}</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <path d={pathD} fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
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

