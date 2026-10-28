'use client'
import React, { useMemo } from 'react'
import type { MtfBookComposition } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'

interface CompositionChartProps {
  data: MtfBookComposition[]
  loading?: boolean
}

export function CompositionChart({ data, loading }: CompositionChartProps) {
  const latestDate = useMemo(() => {
    if (data.length === 0) return ''
    return data.map((d) => d.trade_date).sort().pop() || ''
  }, [data])

  const latestItems = useMemo(() => {
    return data.filter((d) => d.trade_date === latestDate)
  }, [data, latestDate])

  const total = latestItems.reduce((acc, curr) => acc + (curr.book_cr ?? 0), 0) || 1

  const colors: Record<string, { bg: string; fill: string }> = {
    FNO: { bg: 'bg-purple-600', fill: '#9333ea' },
    NON_FNO: { bg: 'bg-blue-500', fill: '#3b82f6' },
    ETF: { bg: 'bg-emerald-500', fill: '#10b981' },
  }

  if (loading) return <div className="h-64 rounded-xl border bg-white p-4 animate-pulse" />
  if (latestItems.length === 0) {
    return (
      <div className="h-64 rounded-xl border bg-white p-4 flex items-center justify-center text-sm text-gray-400">
        No book composition data available
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Book Composition by Asset Class</h3>
          <p className="text-xs text-gray-500">Breakdown into F&O eligible, Non-F&O, and ETFs</p>
        </div>
        <span className="text-xs text-gray-400">As of {latestDate}</span>
      </div>

      {/* Stacked bar */}
      <div className="h-6 w-full rounded-lg overflow-hidden flex bg-gray-100 my-4">
        {latestItems.map((item) => {
          const pct = Math.max(0, ((item.book_cr ?? 0) / total) * 100)
          const c = colors[item.asset_class] ?? { bg: 'bg-gray-400', fill: '#9ca3af' }
          return (
            <div
              key={item.asset_class}
              style={{ width: `${pct}%` }}
              className={`${c.bg} transition-all duration-300`}
              title={`${item.asset_class}: ${pct.toFixed(1)}%`}
            />
          )
        })}
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        {latestItems.map((item) => {
          const pct = ((item.book_cr ?? 0) / total) * 100
          const c = colors[item.asset_class] ?? { bg: 'bg-gray-400', fill: '#9ca3af' }
          return (
            <div key={item.asset_class} className="rounded-lg border p-2.5 bg-gray-50/50">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                <span className="text-xs font-semibold text-gray-700">{item.asset_class}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 mt-1">{formatCr(item.book_cr)}</p>
              <p className="text-[10px] text-gray-500">{pct.toFixed(1)}% of total</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

