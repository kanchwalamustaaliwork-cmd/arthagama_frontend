'use client'

import React from 'react'
import type { MaturityWallBucket } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'
import { CalendarRange } from 'lucide-react'

interface MaturityWallChartProps {
  buckets: MaturityWallBucket[]
  loading?: boolean
}

export function MaturityWallChart({ buckets, loading }: MaturityWallChartProps) {
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

  if (buckets.length === 0) {
    return (
      <div
        style={{
          height: '180px',
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
        No CP maturity wall data available
      </div>
    )
  }

  const maxAmt = Math.max(...buckets.map((b) => b.amount_cr), 1)

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarRange size={15} color="var(--db-mint, #B8CEC2)" />
            <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
              Commercial Paper Refinancing Maturity Wall
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
            Scheduled CP maturities grouped by refinancing tenor window
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {buckets.map((b) => {
          const pct = Math.round((b.amount_cr / maxAmt) * 100)
          return (
            <div
              key={b.bucket_label}
              style={{
                borderRadius: '10px',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                background: 'var(--db-surface-2, #1E3438)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--db-text-2, #A5B7B3)' }}>
                  {b.bucket_label}
                </span>
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    fontFamily: 'Consolas, monospace',
                    color: 'var(--db-mint, #B8CEC2)',
                    margin: '4px 0 2px 0',
                  }}
                >
                  {formatCr(b.amount_cr)}
                </p>
                <p style={{ fontSize: '10.5px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>
                  {b.count} CPs maturing
                </p>
              </div>

              <div
                style={{
                  width: '100%',
                  background: 'rgba(184, 206, 194, 0.1)',
                  height: '6px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: 'var(--db-mint, #B8CEC2)',
                    height: '100%',
                    borderRadius: '10px',
                    width: `${pct}%`,
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
