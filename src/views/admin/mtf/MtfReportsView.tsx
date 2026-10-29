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
import { FileText } from 'lucide-react'
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
  const [dayDate, setDayDate] = useState(today.toISOString().split('T')[0])

  const { data: periodReport, loading: pLoading } = useMtfReport(period, key)
  const { data: dayReport, loading: dLoading } = useDayReport(dayDate)

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
            <FileText size={18} color="var(--db-mint, #B8CEC2)" />
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
            Periodic growth metrics, session-level daily drilldowns, and top security leverage shifts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                padding: '5px 12px',
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
                padding: '5px 12px',
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

          <AsOfBadge asOf={periodReport?.as_of} />
        </div>
      </div>

      {/* Controls Bar */}
      {tab === 'period' ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            background: 'var(--db-surface, #18282C)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            borderRadius: '12px',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: period === p.value ? 600 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: period === p.value ? 'var(--db-surface-2, #1E3438)' : 'transparent',
                  color: period === p.value ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>Period Key:</label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. 2026-10"
              style={{
                height: '30px',
                padding: '0 8px',
                borderRadius: '6px',
                background: 'var(--db-surface-2, #1E3438)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                color: 'var(--db-text, #F7FAF9)',
                fontSize: '12px',
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
            gap: '12px',
            background: 'var(--db-surface, #18282C)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            borderRadius: '12px',
            padding: '12px 16px',
          }}
        >
          <label style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>Date:</label>
          <input
            type="date"
            value={dayDate}
            onChange={(e) => setDayDate(e.target.value)}
            style={{
              height: '30px',
              padding: '0 8px',
              borderRadius: '6px',
              background: 'var(--db-surface-2, #1E3438)',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              color: 'var(--db-text, #F7FAF9)',
              fontSize: '12px',
              colorScheme: 'dark',
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* Reports Body */}
      {tab === 'period' ? (
        pLoading ? (
          <MetricCardsSkeleton count={6} />
        ) : periodReport ? (
          <PeriodReportCard report={periodReport} />
        ) : (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              borderRadius: '14px',
              background: 'var(--db-surface, #18282C)',
              color: 'var(--db-text-muted, #708482)',
              fontSize: '13px',
            }}
          >
            No report available for the selected period key.
          </div>
        )
      ) : dLoading ? (
        <MetricCardsSkeleton count={6} />
      ) : dayReport ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <DayReportCard report={dayReport} />
          <LazyViewport minHeight="240px" fallback={<TableSkeleton rows={4} cols={4} />}>
            <MoversTable gainers={dayReport.biggest_movers?.filter(m => m.direction === 'UP') ?? []} losers={dayReport.biggest_movers?.filter(m => m.direction === 'DOWN') ?? []} />
          </LazyViewport>
        </div>
      ) : (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            borderRadius: '14px',
            background: 'var(--db-surface, #18282C)',
            color: 'var(--db-text-muted, #708482)',
            fontSize: '13px',
          }}
        >
          No daily report found for the selected date.
        </div>
      )}

      <SourceAttribution />
    </div>
  )
}
