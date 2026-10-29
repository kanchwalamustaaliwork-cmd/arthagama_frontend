'use client'

import React from 'react'
import type { MtfCpHolder } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

interface CpHoldersTableProps {
  items: MtfCpHolder[]
  loading?: boolean
}

export function CpHoldersTable({ items, loading }: CpHoldersTableProps) {
  if (loading) {
    return <TableSkeleton rows={6} cols={5} />
  }

  return (
    <div
      style={{
        borderRadius: '14px',
        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
        background: 'var(--db-surface, #18282C)',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.1))' }}>
        <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
          Mutual Fund Scheme Disclosed CP Holdings
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
          Specific institutional schemes holding broker margin financing commercial paper
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr
              style={{
                background: 'var(--db-surface-2, #1E3438)',
                borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--db-text-muted, #708482)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <th style={{ padding: '12px 16px' }}>Asset Management Company</th>
              <th style={{ padding: '12px 16px' }}>Mutual Fund Scheme</th>
              <th style={{ padding: '12px 16px' }}>Broker Issuer</th>
              <th style={{ padding: '12px 16px' }}>CP ISIN</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Holding Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: '36px 16px',
                    textAlign: 'center',
                    color: 'var(--db-text-muted, #708482)',
                    fontSize: '13px',
                  }}
                >
                  No mutual fund CP holding disclosures available.
                </td>
              </tr>
            ) : (
              items.map((r, i) => (
                <tr
                  key={`${r.cp_isin}-${r.scheme}-${i}`}
                  style={{
                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                    {r.amc}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--db-text-2, #A5B7B3)' }}>
                    {r.scheme}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--db-mint, #B8CEC2)' }}>
                    {r.broker_id ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                    {r.cp_isin}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontFamily: 'Consolas, monospace',
                      fontWeight: 700,
                      color: 'var(--db-text, #F7FAF9)',
                    }}
                  >
                    {formatCr(r.amount_cr)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
