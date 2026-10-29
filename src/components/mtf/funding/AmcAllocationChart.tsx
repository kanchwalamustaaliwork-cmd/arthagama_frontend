'use client'

import React from 'react'
import type { MtfAmcAllocation } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'
import { PieChart } from 'lucide-react'

interface AmcAllocationChartProps {
  data: MtfAmcAllocation[]
  loading?: boolean
}

export function AmcAllocationChart({ data, loading }: AmcAllocationChartProps) {
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

  if (data.length === 0) {
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
        No AMC allocation data available
      </div>
    )
  }

  const top = [...data].sort((a, b) => (b.allocation_cr ?? 0) - (a.allocation_cr ?? 0)).slice(0, 8)
  const maxVal = top[0]?.allocation_cr ?? 1

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
        <PieChart size={15} color="var(--db-mint, #B8CEC2)" />
        <div>
          <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
            Top Mutual Fund Houses by CP Exposure
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
            Fund house aggregate investment in broker margin commercial paper
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {top.map((amc) => {
          const pct = Math.round(((amc.allocation_cr ?? 0) / maxVal) * 100)
          return (
            <div key={amc.amc} style={{ fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--db-text-2, #A5B7B3)', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {amc.amc}
                </span>
                <span style={{ fontWeight: 700, fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                  {formatCr(amc.allocation_cr)}
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
                    background: 'var(--db-mint, #B8CEC2)',
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
