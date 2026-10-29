'use client'

import React, { useState } from 'react'
import {
  useMtfSummary,
  useMtfTotals,
  useMtfFlow,
  useMtfBreadth,
  useMtfComposition,
} from '@/src/hooks/mtf/useMtfOverview'
import { MtfKpiStrip } from '@/src/components/mtf/overview/MtfKpiStrip'
import { BookTrendChart } from '@/src/components/mtf/overview/BookTrendChart'
import { FlowChart } from '@/src/components/mtf/overview/FlowChart'
import { BreadthChart } from '@/src/components/mtf/overview/BreadthChart'
import { CompositionChart } from '@/src/components/mtf/overview/CompositionChart'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { DateRangePicker } from '@/src/components/mtf/shared/DateRangePicker'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { SkeletonPrimitive } from '@/src/components/stockdashboard/shared/Skeletons'

function ChartCardSkeleton({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        borderRadius: '14px',
        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
        background: 'var(--db-surface, #18282C)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: '260px',
      }}
    >
      <div>
        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', marginTop: '3px' }}>{subtitle}</div>
      </div>
      <SkeletonPrimitive width="100%" height="160px" borderRadius="10px" />
    </div>
  )
}

function LazyBookTrendSection({ range }: { range: { from?: string; to?: string } }) {
  const { data, loading } = useMtfTotals(range)
  return <BookTrendChart data={data?.items ?? []} loading={loading} />
}

function LazyFlowSection({ range }: { range: { from?: string; to?: string } }) {
  const { data, loading } = useMtfFlow(range)
  return <FlowChart data={data?.items ?? []} loading={loading} />
}

function LazyBreadthSection({ range }: { range: { from?: string; to?: string } }) {
  const { data, loading } = useMtfBreadth(range)
  return <BreadthChart data={data?.items ?? []} loading={loading} />
}

function LazyCompositionSection({ range }: { range: { from?: string; to?: string } }) {
  const { data, loading } = useMtfComposition(range)
  return <CompositionChart data={data?.items ?? []} loading={loading} />
}

export function MtfOverviewView() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({})
  const { data: summary } = useMtfSummary()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Header Section */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(46, 85, 96, 0.28) 0%, rgba(15, 23, 25, 0.7) 80%)',
          borderRadius: '18px',
          padding: '28px 24px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--db-text, #F7FAF9)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Systemic Margin Facility Overview
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
              maxWidth: '620px',
            }}
          >
            Aggregate client leverage, active broker debt books, session-by-session net leverage flows, and asset-class distribution.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
          <AsOfBadge asOf={summary?.as_of} />
        </div>
      </div>

      {/* KPI summary cards - Loaded immediately above the fold */}
      <MtfKpiStrip />

      {/* Visual Analytics Grid - Lazy loaded on viewport scroll */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '20px',
        }}
      >
        <LazyViewport
          minHeight="260px"
          rootMargin="120px"
          fallback={<ChartCardSkeleton title="Total MTF Book Trend" subtitle="Combined market margin debt over time" />}
        >
          <LazyBookTrendSection range={range} />
        </LazyViewport>

        <LazyViewport
          minHeight="260px"
          rootMargin="120px"
          fallback={<ChartCardSkeleton title="Daily Net Leverage Flow" subtitle="Fresh debt minus liquidations (last 60 sessions)" />}
        >
          <LazyFlowSection range={range} />
        </LazyViewport>

        <LazyViewport
          minHeight="260px"
          rootMargin="120px"
          fallback={<ChartCardSkeleton title="MTF Market Breadth" subtitle="Count of securities actively holding funded debt" />}
        >
          <LazyBreadthSection range={range} />
        </LazyViewport>

        <LazyViewport
          minHeight="260px"
          rootMargin="120px"
          fallback={<ChartCardSkeleton title="Book Composition by Asset Class" subtitle="Breakdown into F&O eligible, Non-F&O, and ETFs" />}
        >
          <LazyCompositionSection range={range} />
        </LazyViewport>
      </div>

      <SourceAttribution />
    </div>
  )
}
