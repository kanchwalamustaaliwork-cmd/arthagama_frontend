'use client'

import React from 'react'
import type { MtfDayReport } from '@/src/types/mtf'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'

interface DayReportCardProps {
  report: MtfDayReport
}

export function DayReportCard({ report }: DayReportCardProps) {
  const tiles = [
    { label: 'Headline Book', val: formatCr(report.total_book_cr), sub: 'Combined aggregate' },
    { label: 'NSE Book', val: formatCr(report.nse_book_cr), sub: 'National Stock Exch' },
    { label: 'BSE Book', val: formatCr(report.bse_book_cr), sub: 'Bombay Stock Exch' },
    {
      label: 'Net Leverage Flow',
      val: formatCr(report.net_flow_cr),
      sub: 'Session net delta',
      color: (report.net_flow_cr ?? 0) >= 0 ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
    },
    { label: 'Funded Securities', val: `${report.stocks_funded_count ?? '—'} stocks`, sub: 'Active breadth' },
    { label: 'Top 10 Concentration', val: formatPct(report.concentration_top10_pct), sub: 'Weight of top 10 names' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
      {tiles.map((t) => (
        <div
          key={t.label}
          style={{
            borderRadius: '12px',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            background: 'var(--db-surface, #18282C)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <p style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>{t.label}</p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'Consolas, monospace',
              color: t.color ?? 'var(--db-text, #F7FAF9)',
              margin: '2px 0 0 0',
            }}
          >
            {t.val}
          </p>
          <p style={{ fontSize: '10px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>{t.sub}</p>
        </div>
      ))}
    </div>
  )
}
