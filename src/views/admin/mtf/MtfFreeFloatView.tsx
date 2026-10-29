'use client'

import React from 'react'
import { useFreefloatSeries, useMarketCapHistory } from '@/src/hooks/mtf/useMtfData'
import { BookVsFreeFloatChart } from '@/src/components/mtf/freefloat/BookVsFreeFloatChart'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import { PieChart } from 'lucide-react'

export function MtfFreeFloatView() {
  const { data: demat, loading: dl } = useFreefloatSeries()
  const { data: mcap, loading: ml } = useMarketCapHistory()

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="var(--db-mint, #B8CEC2)" />
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Free Float &amp; Demat Liquidity Analytics
            </h2>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
            }}
          >
            Beneficiary owner holdings, promoter proxy estimates, and market float depth from CDSL &amp; NSDL.
          </p>
        </div>

        <AsOfBadge asOf={demat?.as_of} />
      </div>

      {/* Metrics Strip */}
      <BookVsFreeFloatChart demat={demat?.items ?? []} marketCap={mcap?.items ?? []} loading={dl || ml} />

      {/* Demat Historical Table in LazyViewport */}
      <LazyViewport minHeight="300px" rootMargin="100px" fallback={<TableSkeleton rows={6} cols={6} />}>
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
              Monthly Demat BO Aggregate Holdings (CDSL + NSDL)
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
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '12px 16px' }}>Month</th>
                  <th style={{ padding: '12px 16px' }}>Investor Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Equity</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Promoter Proxy</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Free Float</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Free Float %</th>
                </tr>
              </thead>
              <tbody>
                {dl ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} style={{ padding: '12px 16px' }}>
                        <div style={{ height: '16px', background: 'var(--db-surface-2, #1E3438)', borderRadius: '4px' }} />
                      </td>
                    </tr>
                  ))
                ) : (
                  demat?.items.map((r, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                        {r.month}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--db-text-2, #A5B7B3)' }}>
                        {r.investor_category}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                        {formatCr(r.total_equity_cr)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                        {formatCr(r.promoter_proxy_cr)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 700, color: 'var(--db-mint, #B8CEC2)' }}>
                        {formatCr(r.free_float_cr)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 700, color: '#38BDF8' }}>
                        {formatPct(r.free_float_pct)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </LazyViewport>

      <SourceAttribution />
    </div>
  )
}
