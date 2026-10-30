'use client'

import React from 'react'
import type { MtfDayReport } from '@/src/types/mtf'
import { formatCr, formatPct, toNum } from '@/src/utils/mtf/formatters'

interface DayReportCardProps {
  report: MtfDayReport
}

export function DayReportCard({ report }: DayReportCardProps) {
  const headlineBook = report.headline_book_cr ?? report.total_book_cr
  const netFlow = report.net_flow_cr
  const netFlowNum = toNum(netFlow)
  const isPosFlow = (netFlowNum ?? 0) >= 0
  const stocksFunded = report.stocks_funded ?? report.stocks_funded_count

  const conc = report.concentration
  const top10 = conc?.top10_pct ?? report.concentration_top10_pct
  const top5 = conc?.top5_pct ?? report.concentration_top5_pct

  const tiles = [
    {
      label: 'Headline MTF Book',
      val: formatCr(headlineBook),
      sub: 'Total active margin credit',
      color: 'var(--db-mint, #B8CEC2)',
    },
    {
      label: 'Net Leverage Flow',
      val: formatCr(netFlow),
      sub: (netFlowNum ?? 0) >= 0 ? 'Net daily margin expansion' : 'Net daily margin reduction',
      color: isPosFlow ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
    },
    {
      label: 'Funded Securities',
      val: stocksFunded != null ? `${stocksFunded.toLocaleString('en-IN')} stocks` : '—',
      sub: 'Active equity collateral breadth',
      color: 'var(--db-text, #F7FAF9)',
    },
    {
      label: 'Top 10 Concentration',
      val: top10 != null ? formatPct(top10) : 'Dispersed / N/A',
      sub: top5 != null ? `Top 5: ${formatPct(top5)}` : 'Market-wide exposure',
      color: 'var(--db-text-2, #A5B7B3)',
    },
  ]

  if (report.nse_book_cr != null || report.bse_book_cr != null) {
    if (report.nse_book_cr != null) {
      tiles.push({
        label: 'NSE Book',
        val: formatCr(report.nse_book_cr),
        sub: 'National Stock Exchange',
        color: 'var(--db-text, #F7FAF9)',
      })
    }
    if (report.bse_book_cr != null) {
      tiles.push({
        label: 'BSE Book',
        val: formatCr(report.bse_book_cr),
        sub: 'Bombay Stock Exchange',
        color: 'var(--db-text, #F7FAF9)',
      })
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
      {tiles.map((t) => (
        <div
          key={t.label}
          style={{
            borderRadius: '14px',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            background: 'var(--db-surface, #18282C)',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.18)',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--db-text-muted, #708482)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            {t.label}
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: 'Consolas, monospace',
              color: t.color,
              margin: '2px 0 0 0',
            }}
          >
            {t.val}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>{t.sub}</p>
        </div>
      ))}
    </div>
  )
}
