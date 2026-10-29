'use client'

import React from 'react'
import type { MtfMover } from '@/src/types/mtf'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'
import Link from 'next/link'

interface MoversTableProps {
  gainers: MtfMover[]
  losers: MtfMover[]
}

export function MoversTable({ gainers, losers }: MoversTableProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px' }}>
      {/* Top Gainers */}
      <div
        style={{
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.1))',
            background: 'rgba(34, 197, 94, 0.08)',
          }}
        >
          <h4
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--db-gain, #22C55E)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            Top Book Build-Ups (Inflow)
          </h4>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr
              style={{
                background: 'var(--db-surface-2, #1E3438)',
                borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                fontSize: '10.5px',
                color: 'var(--db-text-muted, #708482)',
                textTransform: 'uppercase',
              }}
            >
              <th style={{ padding: '10px 14px' }}>Security</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Book</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Delta</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>% Delta</th>
            </tr>
          </thead>
          <tbody>
            {gainers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px 14px', textAlign: 'center', color: 'var(--db-text-muted, #708482)' }}>
                  No significant gainers recorded.
                </td>
              </tr>
            ) : (
              gainers.map((m) => (
                <tr
                  key={m.isin}
                  style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.05))' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 14px' }}>
                    <Link
                      href={`/admin/mtf/stocks/${m.isin}`}
                      style={{ fontWeight: 600, color: 'var(--db-text, #F7FAF9)', textDecoration: 'none' }}
                    >
                      {m.symbol ?? m.isin}
                    </Link>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text-2, #A5B7B3)' }}>
                    {formatCr(m.book_cr)}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-gain, #22C55E)' }}>
                    +{formatCr(m.change_cr)}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 700, color: 'var(--db-gain, #22C55E)' }}>
                    +{formatPct(m.change_pct)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Top Losers */}
      <div
        style={{
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.1))',
            background: 'rgba(227, 93, 106, 0.08)',
          }}
        >
          <h4
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--db-loss, #E35D6A)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            Top Liquidations (Unwinding)
          </h4>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr
              style={{
                background: 'var(--db-surface-2, #1E3438)',
                borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                fontSize: '10.5px',
                color: 'var(--db-text-muted, #708482)',
                textTransform: 'uppercase',
              }}
            >
              <th style={{ padding: '10px 14px' }}>Security</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Book</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Delta</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>% Delta</th>
            </tr>
          </thead>
          <tbody>
            {losers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px 14px', textAlign: 'center', color: 'var(--db-text-muted, #708482)' }}>
                  No liquidations recorded.
                </td>
              </tr>
            ) : (
              losers.map((m) => (
                <tr
                  key={m.isin}
                  style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.05))' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 14px' }}>
                    <Link
                      href={`/admin/mtf/stocks/${m.isin}`}
                      style={{ fontWeight: 600, color: 'var(--db-text, #F7FAF9)', textDecoration: 'none' }}
                    >
                      {m.symbol ?? m.isin}
                    </Link>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text-2, #A5B7B3)' }}>
                    {formatCr(m.book_cr)}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-loss, #E35D6A)' }}>
                    {formatCr(m.change_cr)}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 700, color: 'var(--db-loss, #E35D6A)' }}>
                    {formatPct(m.change_pct)}
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
