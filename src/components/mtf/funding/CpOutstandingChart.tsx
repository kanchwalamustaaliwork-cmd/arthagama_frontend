'use client'

import React from 'react'
import type { MtfBrokerCp } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'
import { Landmark } from 'lucide-react'

interface CpOutstandingChartProps {
  items: MtfBrokerCp[]
  loading?: boolean
}

export function CpOutstandingChart({ items, loading }: CpOutstandingChartProps) {
  if (loading) {
    return (
      <div
        style={{
          height: '240px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          animation: 'pulse 1.8s infinite',
        }}
      />
    )
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          height: '240px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12.5px',
          color: 'var(--db-text-muted, #708482)',
        }}
      >
        No active CP issuances available
      </div>
    )
  }

  // Aggregate by broker
  const byBroker: Record<string, number> = {}
  items.forEach((cp) => {
    const b = cp.broker_id || 'Other'
    byBroker[b] = (byBroker[b] || 0) + (cp.amount_cr || 0)
  })

  const sorted = Object.entries(byBroker).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxVal = sorted[0]?.[1] || 1

  return (
    <div
      style={{
        borderRadius: '14px',
        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
        background: 'var(--db-surface, #18282C)',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
        <Landmark size={15} color="#38BDF8" />
        <div>
          <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
            Broker CP Outstanding Book
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
            Commercial paper issued to fund margin credit books
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.map(([broker, amt]) => {
          const pct = Math.round((amt / maxVal) * 100)
          return (
            <div key={broker} style={{ fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--db-text-2, #A5B7B3)' }}>{broker}</span>
                <span style={{ fontWeight: 700, fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                  {formatCr(amt)}
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  background: 'var(--db-surface-2, #1E3438)',
                  height: '7px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: '#38BDF8',
                    height: '100%',
                    borderRadius: '10px',
                    width: `${pct}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
