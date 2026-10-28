'use client'
import React from 'react'
import type { MtfBrokerCp } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'

interface CpOutstandingChartProps {
  items: MtfBrokerCp[]
  loading?: boolean
}

export function CpOutstandingChart({ items, loading }: CpOutstandingChartProps) {
  if (loading) return <div className="h-60 rounded-xl border bg-white p-4 animate-pulse" />
  if (items.length === 0) {
    return (
      <div className="h-60 rounded-xl border bg-white p-4 flex items-center justify-center text-xs text-gray-400">
        No active CP issuances available
      </div>
    )
  }

  // Aggregate by broker
  const byBroker: Record<string, number> = {}
  items.forEach((cp) => {
    const b = cp.broker_id || 'Other'
    byBroker[b] = (byBroker[b] || 0) + (cp.amount_cr || 0)
  })

  const sorted = Object.entries(byBroker).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxVal = sorted[0]?.[1] || 1

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Broker CP Outstanding Book</h3>
          <p className="text-xs text-gray-500">Commercial paper issued to fund margin books</p>
        </div>
      </div>
      <div className="space-y-2 pt-1">
        {sorted.map(([broker, amt]) => {
          const pct = Math.round((amt / maxVal) * 100)
          return (
            <div key={broker} className="text-xs">
              <div className="flex justify-between font-medium text-gray-700 mb-1">
                <span>{broker}</span>
                <span className="font-bold text-gray-900">{formatCr(amt)}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

