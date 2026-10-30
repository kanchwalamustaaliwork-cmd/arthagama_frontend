'use client'

import React from 'react'
import type { MtfStockDetail } from '@/src/types/mtf'
import { formatCr, formatPct, toNum } from '@/src/utils/mtf/formatters'

interface StockMtfCardProps {
  stock: MtfStockDetail
}

export function StockMtfCard({ stock }: StockMtfCardProps) {
  const change30dNum = toNum(stock.change_30d_pct)
  const isPos30d = (change30dNum ?? 0) >= 0
  const leverageNum = toNum(stock.leverage_pct)

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
      color: (leverageNum ?? 0) > 3 ? '#FBBF24' : '#38BDF8',
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          style={{
            background: 'var(--db-surface, #18282C)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            borderRadius: '14px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--db-text-muted, #708482)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {m.label}
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'Consolas, monospace',
              color: m.color,
              margin: '2px 0',
            }}
          >
            {m.val}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--db-text-muted, #708482)',
            }}
          >
            {m.sub}
          </span>
        </div>
      ))}
    </div>
  )
}
