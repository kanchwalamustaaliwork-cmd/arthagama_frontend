'use client'

import React from 'react'
import type { MtfPeriodReport } from '@/src/types/mtf'
import { formatCr, formatPct, toNum } from '@/src/utils/mtf/formatters'

interface PeriodReportCardProps {
  report: MtfPeriodReport
}

export function PeriodReportCard({ report }: PeriodReportCardProps) {
  const seqGrowth = toNum(report.seq_growth_pct)
  const yoyGrowth = toNum(report.yoy_growth_pct)
  const netFlow = toNum(report.net_flow_cr)
  const fundedStocks = report.stocks_funded_avg ?? report.avg_funded_stocks

  const kpis = [
    { label: 'Average Book', val: formatCr(report.avg_book_cr), sub: 'Mean margin debt' },
    {
      label: 'Sequential Growth',
      val: formatPct(report.seq_growth_pct),
      sub: 'vs prior period',
      color: (seqGrowth ?? 0) >= 0 ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
    },
    {
      label: 'YoY Growth',
      val: formatPct(report.yoy_growth_pct),
      sub: 'Year-over-year drift',
      color: (yoyGrowth ?? 0) >= 0 ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
    },
    { label: 'ADTO', val: formatCr(report.adto_cr), sub: 'Avg daily traded value' },
    {
      label: 'Net Flow',
      val: formatCr(report.net_flow_cr),
      sub: 'Fresh less liquidated',
      color: (netFlow ?? 0) >= 0 ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
    },
    {
      label: 'Funded Universe',
      val: fundedStocks != null ? `${Math.round(fundedStocks).toLocaleString('en-IN')} stocks` : '—',
      sub: 'Average breadth',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {kpis.map((k) => (
          <div
            key={k.label}
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
            <p style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>{k.label}</p>
            <p
              style={{
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'Consolas, monospace',
                color: k.color ?? 'var(--db-text, #F7FAF9)',
                margin: '2px 0 0 0',
              }}
            >
              {k.val}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {report.top_stocks && report.top_stocks.length > 0 && (
        <div
          style={{
            borderRadius: '14px',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            background: 'var(--db-surface, #18282C)',
            padding: '18px',
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: '0 0 12px 0' }}>
            Top Funded Securities for Period
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {report.top_stocks.map((s) => (
              <div
                key={s.isin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--db-surface-2, #1E3438)',
                  border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                  fontSize: '12px',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                  #{s.rank} {s.symbol ?? s.isin}
                </span>
                <span style={{ fontWeight: 700, fontFamily: 'Consolas, monospace', color: 'var(--db-mint, #B8CEC2)' }}>
                  {formatCr(s.book_cr)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
