'use client'
import React from 'react'
import type { MtfAmcAllocation } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'

interface AmcAllocationChartProps {
  data: MtfAmcAllocation[]
  loading?: boolean
}

export function AmcAllocationChart({ data, loading }: AmcAllocationChartProps) {
  if (loading) return <div className="h-60 rounded-xl border bg-white p-4 animate-pulse" />
  if (data.length === 0) {
    return (
      <div className="h-60 rounded-xl border bg-white p-4 flex items-center justify-center text-xs text-gray-400">
        No AMC allocation data available
      </div>
    )
  }

  const top = [...data].sort((a, b) => (b.allocation_cr ?? 0) - (a.allocation_cr ?? 0)).slice(0, 8)
  const maxVal = top[0]?.allocation_cr ?? 1

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Top Mutual Fund Houses by CP Exposure</h3>
          <p className="text-xs text-gray-500">Fund house aggregate investment in broker paper</p>
        </div>
      </div>
      <div className="space-y-2 pt-1">
        {top.map((amc) => {
          const pct = Math.round(((amc.allocation_cr ?? 0) / maxVal) * 100)
          return (
            <div key={amc.amc} className="text-xs">
              <div className="flex justify-between font-medium text-gray-700 mb-1">
                <span className="truncate max-w-[240px]">{amc.amc}</span>
                <span className="font-bold text-gray-900">{formatCr(amc.allocation_cr)}</span>
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

