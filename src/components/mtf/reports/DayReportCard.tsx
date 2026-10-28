'use client'
import React from 'react'
import type { MtfDayReport } from '@/src/types/mtf'
import { formatCr, formatPct, formatDate } from '@/src/utils/mtf/formatters'

interface DayReportCardProps {
  report: MtfDayReport
}

export function DayReportCard({ report }: DayReportCardProps) {
  const tiles = [
    { label: 'Headline Book', val: formatCr(report.total_book_cr) },
    { label: 'NSE Book', val: formatCr(report.nse_book_cr) },
    { label: 'BSE Book', val: formatCr(report.bse_book_cr) },
    {
      label: 'Net Flow',
      val: formatCr(report.net_flow_cr),
      color: (report.net_flow_cr ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600',
    },
    { label: 'Funded Securities', val: `${report.stocks_funded_count ?? '—'} stocks` },
    { label: 'Top 10 Concentration', val: formatPct(report.concentration_top10_pct) },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border bg-white p-3.5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{t.label}</p>
            <p className={`text-base font-bold mt-1 ${t.color ?? 'text-gray-900'}`}>{t.val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

