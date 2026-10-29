'use client'

import React from 'react'
import type { MtfStockDetail } from '@/src/types/mtf'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'

interface StockMtfCardProps {
  stock: MtfStockDetail
}

export function StockMtfCard({ stock }: StockMtfCardProps) {
  const isPos30d = (stock.change_30d_pct ?? 0) >= 0

  const metrics = [
    {
      label: 'MTF Margin Book',
      val: formatCr(stock.book_cr),
      sub: 'Disclosed margin debt',
      color: 'var(--db-mint, #B8CEC2)',
    },
    {
      label: 'Total Market Cap',
      val: formatCr(stock.mcap_cr),
      sub: 'Full capitalization',
      color: 'var(--db-text, #F7FAF9)',
    },
    {
      label: 'Free Float Mcap',
      val: formatCr(stock.free_float_mcap_cr),
      sub: 'Non-promoter float',
      color: 'var(--db-text-2, #A5B7B3)',
    },
    {
      label: 'Leverage Proportion',
      val: formatPct(stock.leverage_pct),
      sub: 'MTF / Free Float %',
      color: (stock.leverage_pct ?? 0) > 3 ? '#FBBF24' : '#38BDF8',
    },
    {
      label: '30-Day Growth',
      val: stock.change_30d_pct !== undefined ? `${isPos30d ? '+' : ''}${formatPct(stock.change_30d_pct)}` : '—',
      sub: 'Monthly book drift',
      color: isPos30d ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
    },
    {
      label: 'Segment Class',
      val: stock.asset_class ?? '—',
      sub: 'Exchange trading tier',
      color: 'var(--db-text, #F7FAF9)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
      {metrics.map((m) => (
        <div
          key={m.label}
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
          <p style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>{m.label}</p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'Consolas, monospace',
              color: m.color,
              margin: '2px 0 0 0',
            }}
          >
            {m.val}
          </p>
          <p style={{ fontSize: '10px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>{m.sub}</p>
        </div>
      ))}
    </div>
  )
}
