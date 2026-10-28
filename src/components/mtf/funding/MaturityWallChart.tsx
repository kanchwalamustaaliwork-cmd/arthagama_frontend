'use client'
import React from 'react'
import type { MaturityWallBucket } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'

interface MaturityWallChartProps {
  buckets: MaturityWallBucket[]
  loading?: boolean
}

export function MaturityWallChart({ buckets, loading }: MaturityWallChartProps) {
  if (loading) return <div className="h-60 rounded-xl border bg-white p-4 animate-pulse" />
  if (buckets.length === 0) {
    return (
      <div className="h-60 rounded-xl border bg-white p-4 flex items-center justify-center text-xs text-gray-400">
        No CP maturity wall data available
      </div>
    )
  }

  const maxAmt = Math.max(...buckets.map((b) => b.amount_cr), 1)

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Commercial Paper Maturity Wall</h3>
          <p className="text-xs text-gray-500">Scheduled CP refinancing maturities by tenor bucket</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {buckets.map((b) => {
          const pct = Math.round((b.amount_cr / maxAmt) * 100)
          return (
            <div key={b.bucket_label} className="rounded-lg border p-3 bg-gray-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-700">{b.bucket_label}</span>
                <p className="text-lg font-bold text-purple-700 mt-1">{formatCr(b.amount_cr)}</p>
                <p className="text-[10px] text-gray-400">{b.count} CPs maturing</p>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

