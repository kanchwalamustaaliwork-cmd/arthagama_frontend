'use client'

import React, { useMemo } from 'react'
import type { MtfBookComposition } from '@/src/types/mtf'
import { formatCr, toNum } from '@/src/utils/mtf/formatters'
import { PieChart } from 'lucide-react'

interface CompositionChartProps {
  data: MtfBookComposition[]
  loading?: boolean
}

export function CompositionChart({ data, loading }: CompositionChartProps) {
  const latestDate = useMemo(() => {
    if (data.length === 0) return ''
    return data.map((d) => d.trade_date).sort().pop() || ''
  }, [data])

  const latestItems = useMemo(() => {
    return data.filter((d) => d.trade_date === latestDate)
  }, [data, latestDate])

  // Coerce Decimal strings → numbers for arithmetic
  const total = latestItems.reduce((acc, curr) => acc + (toNum(curr.book_cr) ?? 0), 0) || 1

  const colors: Record<string, { bg: string; text: string; hex: string }> = {
    FNO: { bg: 'var(--db-mint, #B8CEC2)', text: '#18282C', hex: '#B8CEC2' },
    NON_FNO: { bg: '#38BDF8', text: '#0F191B', hex: '#38BDF8' },
    ETF: { bg: '#FBBF24', text: '#0F191B', hex: '#FBBF24' },
  }

  if (loading) {
    return (
      <div
        style={{
          height: '260px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'pulse 1.8s infinite',
        }}
      >
        <div style={{ height: '18px', width: '40%', background: 'var(--db-surface-2, #1E3438)', borderRadius: '6px' }} />
        <div style={{ flex: 1, background: 'var(--db-surface-2, #1E3438)', borderRadius: '8px' }} />
      </div>
    )
  }

  if (latestItems.length === 0) {
    return (
      <div
        style={{
          height: '260px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          color: 'var(--db-text-muted, #708482)',
        }}
      >
        No book composition data available
      </div>
    )
  }

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
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PieChart size={15} color="#FBBF24" />
              <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                Book Composition by Asset Class
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
              Breakdown into F&amp;O eligible, Non-F&amp;O, and ETFs
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'Consolas, monospace',
              color: 'var(--db-text-muted, #708482)',
              background: 'var(--db-surface-2, #1E3438)',
              padding: '3px 8px',
              borderRadius: '6px',
            }}
          >
            {latestDate}
          </span>
        </div>

        {/* Stacked bar */}
        <div
          style={{
            height: '24px',
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            background: 'var(--db-surface-2, #1E3438)',
            margin: '20px 0',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.1))',
          }}
        >
          {latestItems.map((item) => {
            const bookNum = toNum(item.book_cr) ?? 0
            const pct = Math.max(0, (bookNum / total) * 100)
            const c = colors[item.asset_class] ?? { bg: 'var(--db-mint, #B8CEC2)', text: '#000', hex: '#B8CEC2' }
            return (
              <div
                key={item.asset_class}
                style={{
                  width: `${pct}%`,
                  background: c.hex,
                  transition: 'all 0.3s ease',
                }}
                title={`${item.asset_class}: ${pct.toFixed(1)}% (${formatCr(bookNum)})`}
              />
            )
          })}
        </div>
      </div>

      {/* Legend / Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
        {latestItems.map((item) => {
          const bookNum = toNum(item.book_cr) ?? 0
          const pct = Math.max(0, (bookNum / total) * 100)
          const c = colors[item.asset_class] ?? { bg: 'var(--db-mint, #B8CEC2)', text: '#000', hex: '#B8CEC2' }
          return (
            <div
              key={item.asset_class}
              style={{
                background: 'var(--db-surface-2, #1E3438)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                borderRadius: '8px',
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: c.hex,
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--db-text-2, #A5B7B3)' }}>
                  {item.asset_class}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                {pct.toFixed(1)}%
              </div>
              <div style={{ fontSize: '10.5px', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                {formatCr(bookNum)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
