'use client'

import React from 'react'
import type { MtfDematHolding, MtfMarketCapHistory } from '@/src/types/mtf'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'
import { PieChart } from 'lucide-react'

interface BookVsFreeFloatChartProps {
  demat: MtfDematHolding[]
  marketCap: MtfMarketCapHistory[]
  loading?: boolean
}

export function BookVsFreeFloatChart({ demat, marketCap, loading }: BookVsFreeFloatChartProps) {
  if (loading) {
    return (
      <div
        style={{
          height: '180px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          animation: 'pulse 1.8s infinite',
        }}
      />
    )
  }

  const latestDemat = demat[0]
  const latestMcap = marketCap[marketCap.length - 1]

  const metrics = [
    {
      label: 'Free Float Market Cap',
      val: formatCr(latestMcap?.free_float_mcap_cr),
      sub: 'Daily floating mcap',
      color: 'var(--db-text, #F7FAF9)',
    },
    {
      label: 'Demat Free Float Equity',
      val: formatCr(latestDemat?.free_float_cr),
      sub: 'CDSL + NSDL BO aggregates',
      color: 'var(--db-mint, #B8CEC2)',
    },
    {
      label: 'Promoter Proxy Holdings',
      val: formatCr(latestDemat?.promoter_proxy_cr),
      sub: 'Locked insider equity estimate',
      color: 'var(--db-text-2, #A5B7B3)',
    },
    {
      label: 'Free Float Proportion %',
      val: formatPct(latestDemat?.free_float_pct),
      sub: 'Non-promoter liquidity share',
      color: '#38BDF8',
    },
  ]

  return (
    <div
      style={{
        borderRadius: '14px',
        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
        background: 'var(--db-surface, #18282C)',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <PieChart size={15} color="var(--db-mint, #B8CEC2)" />
        <div>
          <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
            MTF Leverage vs Non-Promoter Free Float
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
            Systemic margin debt measured against secondary market float liquidity
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              borderRadius: '10px',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
              background: 'var(--db-surface-2, #1E3438)',
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
    </div>
  )
}
