'use client'
import React from 'react'
import type { MtfDematHolding, MtfMarketCapHistory } from '@/src/types/mtf'
import { formatCr, formatPct, formatDate } from '@/src/utils/mtf/formatters'

interface BookVsFreeFloatChartProps {
  demat: MtfDematHolding[]
  marketCap: MtfMarketCapHistory[]
  loading?: boolean
}

export function BookVsFreeFloatChart({ demat, marketCap, loading }: BookVsFreeFloatChartProps) {
  if (loading) return <div className="h-64 rounded-xl border bg-white p-4 animate-pulse" />

  const latestDemat = demat[0]
  const latestMcap = marketCap[marketCap.length - 1]

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">MTF Leverage vs Non-Promoter Free Float</h3>
          <p className="text-xs text-gray-500">Systemic margin debt measured against market float liquidity</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border p-3 bg-gray-50/50">
          <p className="text-[11px] font-medium text-gray-500">Free Float Market Cap</p>
          <p className="text-base font-bold text-gray-900 mt-1">{formatCr(latestMcap?.free_float_mcap_cr)}</p>
          <p className="text-[10px] text-gray-400">Daily mcap series</p>
        </div>
        <div className="rounded-lg border p-3 bg-gray-50/50">
          <p className="text-[11px] font-medium text-gray-500">Demat Free Float Equity</p>
          <p className="text-base font-bold text-gray-900 mt-1">{formatCr(latestDemat?.free_float_cr)}</p>
          <p className="text-[10px] text-gray-400">CDSL + NSDL BO aggregates</p>
        </div>
        <div className="rounded-lg border p-3 bg-gray-50/50">
          <p className="text-[11px] font-medium text-gray-500">Promoter Proxy Holdings</p>
          <p className="text-base font-bold text-gray-900 mt-1">{formatCr(latestDemat?.promoter_proxy_cr)}</p>
          <p className="text-[10px] text-gray-400">Locked equity estimate</p>
        </div>
        <div className="rounded-lg border p-3 bg-gray-50/50">
          <p className="text-[11px] font-medium text-gray-500">Free Float Share %</p>
          <p className="text-base font-bold text-purple-700 mt-1">{formatPct(latestDemat?.free_float_pct)}</p>
          <p className="text-[10px] text-gray-400">Non-promoter proportion</p>
        </div>
      </div>
    </div>
  )
}

