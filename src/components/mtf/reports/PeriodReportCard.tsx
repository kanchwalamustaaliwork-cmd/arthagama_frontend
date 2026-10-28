'use client'
import React from 'react'
import type { MtfPeriodReport } from '@/src/types/mtf'
import { formatCr, formatPct, formatDate } from '@/src/utils/mtf/formatters'

interface PeriodReportCardProps {
  report: MtfPeriodReport
}

export function PeriodReportCard({ report }: PeriodReportCardProps) {
  const kpis = [
    { label: 'Average Book', val: formatCr(report.avg_book_cr), sub: 'Mean margin debt' },
    {
      label: 'Sequential Growth',
      val: formatPct(report.seq_growth_pct),
      sub: 'vs prior period',
      color: (report.seq_growth_pct ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600',
    },
    {
      label: 'YoY Growth',
      val: formatPct(report.yoy_growth_pct),
      sub: 'Year-over-year drift',
      color: (report.yoy_growth_pct ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600',
    },
    { label: 'ADTO', val: formatCr(report.adto_cr), sub: 'Avg daily traded value' },
    {
      label: 'Net Flow',
      val: formatCr(report.net_flow_cr),
      sub: 'Fresh less liquidated',
      color: (report.net_flow_cr ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600',
    },
    { label: 'Funded Universe', val: `${report.avg_funded_stocks ?? '—'} stocks`, sub: 'Average breadth' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border bg-white p-3.5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{k.label}</p>
            <p className={`text-base font-bold mt-1 ${k.color ?? 'text-gray-900'}`}>{k.val}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {report.top_stocks && report.top_stocks.length > 0 && (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Funded Securities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {report.top_stocks.map((s) => (
              <div key={s.isin} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-xs">
                <span className="font-semibold text-gray-800">
                  #{s.rank} {s.symbol ?? s.isin}
                </span>
                <span className="font-bold text-purple-700">{formatCr(s.book_cr)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

