'use client'

import React from 'react'
import { useMtfStock, useMtfStockHistory } from '@/src/hooks/mtf/useMtfStocks'
import { StockMtfCard } from '@/src/components/mtf/stocks/StockMtfCard'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { formatPct, formatDate } from '@/src/utils/mtf/formatters'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { MetricCardsSkeleton, TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import { ShieldAlert, History } from 'lucide-react'

interface Props {
  isin: string
}

export function MtfStockDetailView({ isin }: Props) {
  const { data: stock, loading } = useMtfStock(isin)
  const { data: history } = useMtfStockHistory(isin)

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ height: '100px', background: 'var(--db-surface, #18282C)', borderRadius: '18px' }} />
        <MetricCardsSkeleton count={6} />
      </div>
    )
  }

  if (!stock) {
    return (
      <div
        style={{
          padding: '48px',
          textAlign: 'center',
          background: 'var(--db-surface, #18282C)',
          borderRadius: '16px',
          color: 'var(--db-text-muted, #708482)',
          fontSize: '13.5px',
        }}
      >
        Security details could not be found for ISIN {isin}.
      </div>
    )
  }

  const flags = stock.surveillance_flags
  const activeFlags = flags ? (['asm', 'gsm', 'esm', 'ibc', 'ban'] as const).filter((k) => flags[k]) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(46, 85, 96, 0.28) 0%, rgba(15, 23, 25, 0.7) 80%)',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {stock.symbol ?? isin}
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'Consolas, monospace',
                fontWeight: 600,
                color: 'var(--db-mint, #B8CEC2)',
                background: 'rgba(184, 206, 194, 0.1)',
                border: '1px solid rgba(184, 206, 194, 0.2)',
                borderRadius: '6px',
                padding: '2px 8px',
              }}
            >
              {stock.exchange}
            </span>
          </div>
          <p
            style={{
              fontSize: '12px',
              fontFamily: 'Consolas, monospace',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
            }}
          >
            {isin}
          </p>
        </div>

        <AsOfBadge asOf={stock.snapshot_date} />
      </div>

      {/* Metrics Strip */}
      <StockMtfCard stock={stock} />

      {/* Surveillance Alerts Banner if active */}
      {activeFlags.length > 0 && (
        <div
          style={{
            borderRadius: '14px',
            border: '1px solid rgba(227, 93, 106, 0.3)',
            background: 'rgba(227, 93, 106, 0.08)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} color="var(--db-loss, #E35D6A)" />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--db-loss, #E35D6A)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Active Exchange Surveillance Measure
            </span>
            {flags?.severity && (
              <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                ({flags.severity} severity)
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {activeFlags.map((f) => (
              <span
                key={f}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: 'rgba(227, 93, 106, 0.2)',
                  color: 'var(--db-loss, #E35D6A)',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Historical Track Info in LazyViewport */}
      {history && (
        <LazyViewport minHeight="120px">
          <div
            style={{
              borderRadius: '14px',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              background: 'var(--db-surface, #18282C)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={16} color="var(--db-mint, #B8CEC2)" />
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                  Historical MTF Book Coverage
                </h3>
                <p style={{ fontSize: '11.5px', color: 'var(--db-text-muted, #708482)', margin: '2px 0 0 0' }}>
                  Coverage established since {formatDate(history.history_since)}
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: '12px',
                fontFamily: 'Consolas, monospace',
                color: 'var(--db-text-2, #A5B7B3)',
                background: 'var(--db-surface-2, #1E3438)',
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              {history.items.length} sessions logged
            </span>
          </div>
        </LazyViewport>
      )}

      {/* Promoter Pledge History in LazyViewport */}
      {stock.pledge_history && stock.pledge_history.length > 0 && (
        <LazyViewport minHeight="220px" fallback={<TableSkeleton rows={4} cols={4} />}>
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
                Promoter Pledge Disclosures
              </h3>
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
                    }}
                  >
                    <th style={{ padding: '12px 16px' }}>Period</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Pledged %</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Pledged Shares</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Shares</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.pledge_history.map((p) => (
                    <tr
                      key={p.period}
                      style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                        {p.period}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 700, color: 'var(--db-loss, #E35D6A)' }}>
                        {formatPct(p.pledged_pct)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text-2, #A5B7B3)' }}>
                        {p.pledged_shares?.toLocaleString() ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                        {p.total_shares?.toLocaleString() ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </LazyViewport>
      )}

      <SourceAttribution />
    </div>
  )
}
