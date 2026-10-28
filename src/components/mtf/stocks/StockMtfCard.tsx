'use client'
import React from 'react'
import type { MtfStockDetail } from '@/src/types/mtf'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'

interface StockMtfCardProps {
  stock: MtfStockDetail
}

export function StockMtfCard({ stock }: StockMtfCardProps) {
  const metrics = [
    { label: 'MTF Book', val: formatCr(stock.book_cr), sub: 'Disclosed margin debt' },
    { label: 'Market Cap', val: formatCr(stock.mcap_cr), sub: 'Total capitalization' },
    { label: 'Free Float Mcap', val: formatCr(stock.free_float_mcap_cr), sub: 'Non-promoter float' },
    { label: 'Leverage %', val: formatPct(stock.leverage_pct), sub: 'MTF / Free Float' },
    { label: '30-Day Change', val: formatPct(stock.change_30d_pct), sub: 'Sequential book drift' },
    { label: 'Segment Class', val: stock.asset_class ?? '—', sub: 'Exchange eligibility' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl border bg-white p-3.5 shadow-sm">
          <p className="text-xs font-medium text-gray-500">{m.label}</p>
          <p className="text-base font-bold text-gray-900 mt-1">{m.val}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{m.sub}</p>
        </div>
      ))}
    </div>
  )
}

