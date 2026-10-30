'use client'

import React, { useState } from 'react'
import { useMtfReport, useDayReport } from '@/src/hooks/mtf/useMtfData'
import { PeriodReportCard } from '@/src/components/mtf/reports/PeriodReportCard'
import { DayReportCard } from '@/src/components/mtf/reports/DayReportCard'
import { MoversTable } from '@/src/components/mtf/reports/MoversTable'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { MetricCardsSkeleton, TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import {
  FileText,
  Calendar,
  TrendingDown,
  TrendingUp,
  Layers,
  Building2,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { formatCr, formatDate, formatPct, toNum } from '@/src/utils/mtf/formatters'
import type { ReportPeriod } from '@/src/types/mtf'

const PERIODS: { label: string; value: ReportPeriod }[] = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
]

export function MtfReportsView() {
  const [tab, setTab] = useState<'period' | 'day'>('period')
  const [period, setPeriod] = useState<ReportPeriod>('month')
  const today = new Date()
  const defaultKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const [key, setKey] = useState(defaultKey)

  // Default to today or the latest available trading date
  const [dayDate, setDayDate] = useState('2026-10-26')

  const { data: periodReport, loading: pLoading } = useMtfReport(period, key)
  const { data: dayReport, loading: dLoading } = useDayReport(dayDate)

  // Derived metrics for the day report
  const headlineBook = dayReport?.headline_book_cr ?? dayReport?.total_book_cr
  const headlineBookNum = toNum(headlineBook)
  const netFlowNum = toNum(dayReport?.net_flow_cr)
  const stocksFunded = dayReport?.stocks_funded ?? dayReport?.stocks_funded_count
  const avgPerStockCr =
    headlineBookNum != null && stocksFunded && stocksFunded > 0
      ? headlineBookNum / stocksFunded
      : null

  const isPosFlow = (netFlowNum ?? 0) >= 0
  const gainers = dayReport?.biggest_movers?.filter((m) => m.direction === 'UP') ?? []
  const losers = dayReport?.biggest_movers?.filter((m) => m.direction === 'DOWN') ?? []
  const hasMovers = gainers.length > 0 || losers.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ─── Header ─── */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(46, 85, 96, 0.28) 0%, rgba(15, 23, 25, 0.75) 80%)',
          borderRadius: '18px',
          padding: '24px 28px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--db-mint, #B8CEC2)" />
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              MTF Analytical Reports &amp; Roll-ups
            </h2>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
            }}
          >
            Periodic growth metrics, session-level daily drilldowns, and market leverage dynamics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Mode Switch */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--db-surface, #18282C)',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
              borderRadius: '8px',
              padding: '3px',
            }}
          >
            <button
              onClick={() => setTab('period')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: tab === 'period' ? 'var(--db-surface-2, #1E3438)' : 'transparent',
                color: tab === 'period' ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                transition: 'all 0.15s ease',
              }}
            >
              Period Roll-up
            </button>
            <button
              onClick={() => setTab('day')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: tab === 'day' ? 'var(--db-surface-2, #1E3438)' : 'transparent',
                color: tab === 'day' ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                transition: 'all 0.15s ease',
              }}
            >
              Daily Snapshot
            </button>
          </div>

          <AsOfBadge
            asOf={
              tab === 'day'
                ? dayReport?.trade_date ?? dayDate
                : periodReport?.to_date ?? periodReport?.as_of
            }
          />
        </div>
      </div>

      {/* ─── Controls Bar ─── */}
      {tab === 'period' ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            background: 'var(--db-surface, #18282C)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            borderRadius: '12px',
            padding: '12px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: period === p.value ? 600 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: period === p.value ? 'var(--db-surface-2, #1E3438)' : 'transparent',
                  color: period === p.value ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                  transition: 'all 0.15s ease',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textTransform: 'uppercase' }}>
              Period Key:
            </label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. 2026-10"
              style={{
                height: '32px',
                padding: '0 10px',
                borderRadius: '6px',
                background: 'var(--db-surface-2, #1E3438)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
                color: 'var(--db-text, #F7FAF9)',
                fontSize: '12.5px',
                fontFamily: 'Consolas, monospace',
                outline: 'none',
              }}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap',
            background: 'var(--db-surface, #18282C)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            borderRadius: '12px',
            padding: '12px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={15} color="var(--db-mint, #B8CEC2)" />
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textTransform: 'uppercase' }}>
              Session Date:
            </label>
            <input
              type="date"
              value={dayDate}
              onChange={(e) => setDayDate(e.target.value)}
              style={{
                height: '32px',
                padding: '0 10px',
                borderRadius: '6px',
                background: 'var(--db-surface-2, #1E3438)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
                color: 'var(--db-text, #F7FAF9)',
                fontSize: '12.5px',
                fontFamily: 'Consolas, monospace',
                colorScheme: 'dark',
                outline: 'none',
              }}
            />
          </div>

          {/* Quick presets for recent sessions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>Quick Select:</span>
            {['2026-10-28', '2026-10-27', '2026-10-26'].map((dt) => (
              <button
                key={dt}
                onClick={() => setDayDate(dt)}
                style={{
                  fontSize: '11px',
                  fontFamily: 'Consolas, monospace',
                  padding: '4px 8px',
                  borderRadius: '5px',
                  border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                  background: dayDate === dt ? 'var(--db-surface-2, #1E3438)' : 'transparent',
                  color: dayDate === dt ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                  cursor: 'pointer',
                }}
              >
                {dt.slice(5)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Reports Body ─── */}
      {tab === 'period' ? (
        pLoading ? (
          <MetricCardsSkeleton count={6} />
        ) : periodReport ? (
          <PeriodReportCard report={periodReport} />
        ) : (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              borderRadius: '14px',
              background: 'var(--db-surface, #18282C)',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              color: 'var(--db-text-muted, #708482)',
              fontSize: '13.5px',
            }}
          >
            No report available for period key <code style={{ color: 'var(--db-mint, #B8CEC2)' }}>{key}</code>.
          </div>
        )
      ) : dLoading ? (
        <MetricCardsSkeleton count={4} />
      ) : dayReport ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key Metric Tiles */}
          <DayReportCard report={dayReport} />

          {/* Daily Session Context Card */}
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              background: 'var(--db-surface, #18282C)',
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={17} color="var(--db-mint, #B8CEC2)" />
                <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                  Trading Session Breakdown &middot; {formatDate(dayReport.trade_date)}
                </h3>
              </div>
              <span
                style={{
                  fontSize: '11.5px',
                  fontFamily: 'Consolas, monospace',
                  color: 'var(--db-text-muted, #708482)',
                }}
              >
                Source: {dayReport.source ?? 'NSE/BSE via mtf.trading'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
              }}
            >
              {/* Daily Inflow / Outflow Status */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'var(--db-surface-2, #1E3438)',
                  border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', textTransform: 'uppercase' }}>
                  Daily Flow Regime
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isPosFlow ? (
                    <TrendingUp size={16} color="var(--db-gain, #22C55E)" />
                  ) : (
                    <TrendingDown size={16} color="var(--db-loss, #E35D6A)" />
                  )}
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: isPosFlow ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
                    }}
                  >
                    {isPosFlow ? 'Net Margin Expansion' : 'Net Margin Reduction'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                  {isPosFlow ? '+' : ''}
                  {formatCr(netFlowNum)} net change during this session
                </span>
              </div>

              {/* Average Book per Security */}
              {avgPerStockCr != null && (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: 'var(--db-surface-2, #1E3438)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', textTransform: 'uppercase' }}>
                    Avg Book per Stock
                  </span>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      fontFamily: 'Consolas, monospace',
                      color: 'var(--db-mint, #B8CEC2)',
                    }}
                  >
                    {formatCr(avgPerStockCr)}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                    Distributed across {stocksFunded?.toLocaleString('en-IN')} active securities
                  </span>
                </div>
              )}

              {/* Market Breadth */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'var(--db-surface-2, #1E3438)',
                  border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', textTransform: 'uppercase' }}>
                  Leverage Breadth
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    fontFamily: 'Consolas, monospace',
                    color: 'var(--db-text, #F7FAF9)',
                  }}
                >
                  {stocksFunded ? `${stocksFunded.toLocaleString('en-IN')} stocks` : '—'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                  Total collateralized equities with active margin balances
                </span>
              </div>
            </div>
          </div>

          {/* Movers Table if available */}
          {hasMovers && (
            <LazyViewport minHeight="240px" fallback={<TableSkeleton rows={4} cols={4} />}>
              <MoversTable gainers={gainers} losers={losers} />
            </LazyViewport>
          )}
        </div>
      ) : (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '14px',
            background: 'var(--db-surface, #18282C)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            color: 'var(--db-text-muted, #708482)',
            fontSize: '13.5px',
          }}
        >
          No daily report found for date <code style={{ color: 'var(--db-mint, #B8CEC2)' }}>{dayDate}</code>.
        </div>
      )}

      {/* Attribution footer */}
      <SourceAttribution />
    </div>
  )
}
