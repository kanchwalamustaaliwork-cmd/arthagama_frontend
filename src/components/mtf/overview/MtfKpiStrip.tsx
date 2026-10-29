'use client'

import React from 'react'
import { useMtfSummary } from '@/src/hooks/mtf/useMtfOverview'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'
import { TrendingUp, TrendingDown, Layers, Landmark, BarChart3, Activity } from 'lucide-react'
import { MetricCardsSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

/** Coerce Python Decimal string → number safely */
function toNum(v: string | number | null | undefined): number | null {
  if (v == null) return null
  const n = typeof v === 'string' ? parseFloat(v) : v
  return isNaN(n) ? null : n
}

/**
 * KPI strip showing NSE / BSE / Combined outstanding book + net flow
 * Matches backend OverviewSummary fields:
 *   nse_outstanding_cr, bse_outstanding_cr, total_outstanding_cr, net_flow_cr
 */
export function MtfKpiStrip() {
  const { data, loading: isLoading } = useMtfSummary()

  if (isLoading) {
    return <MetricCardsSkeleton count={4} />
  }

  const totalOutstanding = toNum(data?.total_outstanding_cr)
  const nseOutstanding   = toNum(data?.nse_outstanding_cr)
  const bseOutstanding   = toNum(data?.bse_outstanding_cr)
  const netFlow          = toNum(data?.net_flow_cr)

  const isPosFlow = (netFlow ?? 0) >= 0

  const tiles = [
    {
      label: 'Combined MTF Book',
      sublabel: 'Total outstanding margin debt (NSE + BSE)',
      value: formatCr(totalOutstanding),
      icon: Layers,
      accent: 'var(--db-mint, #B8CEC2)',
    },
    {
      label: 'NSE Outstanding',
      sublabel: 'National Stock Exchange disclosed book',
      value: formatCr(nseOutstanding),
      icon: Landmark,
      accent: '#38BDF8',
    },
    {
      label: 'BSE Outstanding',
      sublabel: 'Bombay Stock Exchange disclosed book',
      value: formatCr(bseOutstanding),
      icon: BarChart3,
      accent: '#A78BFA',
    },
    {
      label: 'Net Daily Flow',
      sublabel: 'Fresh debt minus liquidations',
      value: netFlow != null ? formatCr(Math.abs(netFlow)) : '—',
      prefix: netFlow != null && netFlow > 0 ? '+' : netFlow != null && netFlow < 0 ? '-' : '',
      isChange: true,
      isPos: isPosFlow,
      icon: Activity,
      accent: isPosFlow ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {tiles.map((tile) => {
        const Icon = tile.icon
        return (
          <div
            key={tile.label}
            style={{
              background: 'var(--db-surface, #18282C)',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              borderRadius: '14px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={14} color={tile.accent} />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                  {tile.label}
                </span>
              </div>
              {tile.isChange && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: tile.isPos ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
                    background: tile.isPos ? 'rgba(34, 197, 94, 0.12)' : 'rgba(227, 93, 106, 0.12)',
                    padding: '2px 7px',
                    borderRadius: '6px',
                  }}
                >
                  {tile.isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {tile.isPos ? 'Inflow' : 'Outflow'}
                </span>
              )}
            </div>

            {/* Main Value */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
              {tile.isChange && tile.prefix && (
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    fontFamily: 'Consolas, monospace',
                    color: tile.isPos ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
                  }}
                >
                  {tile.prefix}
                </span>
              )}
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'Consolas, monospace',
                  color: tile.isChange
                    ? (tile.isPos ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)')
                    : 'var(--db-text, #F7FAF9)',
                }}
              >
                {tile.value}
              </span>
            </div>

            {/* Subtitle / context */}
            <div
              style={{
                fontSize: '11px',
                color: 'var(--db-text-muted, #708482)',
                paddingTop: '6px',
                borderTop: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
              }}
            >
              {tile.sublabel}
            </div>
          </div>
        )
      })}
    </div>
  )
}
