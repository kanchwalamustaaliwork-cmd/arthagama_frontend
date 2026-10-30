'use client'

import React from 'react'
import Link from 'next/link'
import type { MtfStockSnapshot } from '@/src/types/mtf'
import { formatCr, formatPct, toNum } from '@/src/utils/mtf/formatters'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

interface MtfStocksTableProps {
  items: MtfStockSnapshot[]
  loading?: boolean
}

export function MtfStocksTable({ items, loading }: MtfStocksTableProps) {
  if (loading) {
    return <TableSkeleton rows={8} cols={8} />
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
              <th style={{ padding: '12px 16px' }}>Security</th>
              <th style={{ padding: '12px 16px' }}>ISIN</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>MTF Book</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Market Cap</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Leverage %</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>30d Change</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Class</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Exch</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: '36px 16px',
                    textAlign: 'center',
                    color: 'var(--db-text-muted, #708482)',
                    fontSize: '13px',
                  }}
                >
                  No securities matched the selected filter criteria.
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const change30dNum = toNum(row.change_30d_pct)
                const isPos30d = (change30dNum ?? 0) >= 0
                const leverageNum = toNum(row.leverage_pct)

                return (
                  <tr
                    key={`${row.isin}-${row.exchange}`}
                    style={{
                      borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Security Symbol */}
                    <td style={{ padding: '12px 16px' }}>
                      <Link
                        href={`/admin/mtf/stocks/${row.isin}`}
                        style={{
                          fontWeight: 600,
                          color: 'var(--db-mint, #B8CEC2)',
                          textDecoration: 'none',
                        }}
                      >
                        {row.symbol ?? row.isin}
                      </Link>
                    </td>

                    {/* ISIN */}
                    <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                      {row.isin}
                    </td>

                    {/* MTF Book */}
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontFamily: 'Consolas, monospace',
                        fontWeight: 600,
                        color: 'var(--db-text, #F7FAF9)',
                      }}
                    >
                      {formatCr(row.book_cr)}
                    </td>

                    {/* Market Cap */}
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontFamily: 'Consolas, monospace',
                        color: 'var(--db-text-2, #A5B7B3)',
                      }}
                    >
                      {formatCr(row.mcap_cr)}
                    </td>

                    {/* Leverage % */}
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontFamily: 'Consolas, monospace',
                        fontWeight: 600,
                        color: (leverageNum ?? 0) > 3 ? '#FBBF24' : 'var(--db-mint, #B8CEC2)',
                      }}
                    >
                      {formatPct(row.leverage_pct)}
                    </td>

                    {/* 30d Change */}
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontFamily: 'Consolas, monospace',
                        fontWeight: 600,
                        color: isPos30d ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
                      }}
                    >
                      {row.change_30d_pct !== undefined ? (
                        <>
                          {isPos30d ? '+' : ''}
                          {formatPct(row.change_30d_pct)}
                        </>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Class */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background:
                            row.asset_class === 'FNO'
                              ? 'rgba(184, 206, 194, 0.12)'
                              : row.asset_class === 'ETF'
                              ? 'rgba(251, 191, 36, 0.12)'
                              : 'rgba(56, 189, 248, 0.12)',
                          color:
                            row.asset_class === 'FNO'
                              ? 'var(--db-mint, #B8CEC2)'
                              : row.asset_class === 'ETF'
                              ? '#FBBF24'
                              : '#38BDF8',
                          border: '1px solid rgba(184, 206, 194, 0.1)',
                        }}
                      >
                        {row.asset_class ?? '—'}
                      </span>
                    </td>

                    {/* Exchange */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'Consolas, monospace',
                          color: 'var(--db-text-muted, #708482)',
                        }}
                      >
                        {row.exchange}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
