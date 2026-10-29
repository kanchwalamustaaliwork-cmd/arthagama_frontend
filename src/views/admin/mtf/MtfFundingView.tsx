'use client'

import React, { useState } from 'react'
import {
  useCpOutstanding,
  useMaturityWall,
  useCostVsRepo,
  useCpHolders,
  useAmcAllocation,
} from '@/src/hooks/mtf/useMtfFunding'
import { CpOutstandingChart } from '@/src/components/mtf/funding/CpOutstandingChart'
import { MaturityWallChart } from '@/src/components/mtf/funding/MaturityWallChart'
import { CostVsRepoChart } from '@/src/components/mtf/funding/CostVsRepoChart'
import { CpHoldersTable } from '@/src/components/mtf/funding/CpHoldersTable'
import { AmcAllocationChart } from '@/src/components/mtf/funding/AmcAllocationChart'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { MTF_FUNDING_DISCLAIMER } from '@/src/utils/mtf/formatters'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { TableSkeleton, SkeletonPrimitive } from '@/src/components/stockdashboard/shared/Skeletons'
import { Coins, AlertCircle } from 'lucide-react'

function LazyCpOutstandingSection() {
  const { data, loading } = useCpOutstanding()
  return <CpOutstandingChart items={data?.items ?? []} loading={loading} />
}

function LazyCostVsRepoSection() {
  const { data, loading } = useCostVsRepo()
  return <CostVsRepoChart data={data?.items ?? []} loading={loading} />
}

function LazyAmcAllocationSection({ cadence }: { cadence: 'M' | 'F' }) {
  const { data, loading } = useAmcAllocation({ cadence })
  return <AmcAllocationChart data={data?.items ?? []} loading={loading} />
}

function LazyCpHoldersSection({ cadence }: { cadence: 'M' | 'F' }) {
  const { data, loading } = useCpHolders({ cadence })
  return <CpHoldersTable items={data?.items ?? []} loading={loading} />
}

export function MtfFundingView() {
  const [cadence, setCadence] = useState<'M' | 'F'>('M')
  const { data: wallData, loading: wallLoading } = useMaturityWall()

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
            <Coins size={18} color="var(--db-mint, #B8CEC2)" />
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Broker Funding &amp; Commercial Paper
            </h2>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
            }}
          >
            Short-term wholesale debt financing, CP maturity walls, and mutual fund debt scheme exposures.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cadence Switch */}
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
              onClick={() => setCadence('M')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: cadence === 'M' ? 'var(--db-surface-2, #1E3438)' : 'transparent',
                color: cadence === 'M' ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                transition: 'all 0.15s ease',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setCadence('F')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: cadence === 'F' ? 'var(--db-surface-2, #1E3438)' : 'transparent',
                color: cadence === 'F' ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                transition: 'all 0.15s ease',
              }}
            >
              Fortnightly
            </button>
          </div>

          <AsOfBadge asOf={wallData?.as_of} />
        </div>
      </div>

      {/* Regulatory Funding Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          fontSize: '12px',
          color: '#FCD34D',
          lineHeight: 1.5,
        }}
      >
        <AlertCircle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>{MTF_FUNDING_DISCLAIMER}</span>
      </div>

      {/* Refinancing Maturity Wall - Loaded immediately */}
      <MaturityWallChart buckets={wallData?.buckets ?? []} loading={wallLoading} />

      {/* CP Breakdown Grid - Loaded lazily on viewport */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '20px',
        }}
      >
        <LazyViewport
          minHeight="240px"
          rootMargin="100px"
          fallback={
            <div style={{ height: '240px', background: 'var(--db-surface, #18282C)', borderRadius: '14px', padding: '20px' }}>
              <SkeletonPrimitive width="40%" height="16px" />
            </div>
          }
        >
          <LazyCpOutstandingSection />
        </LazyViewport>

        <LazyViewport
          minHeight="240px"
          rootMargin="100px"
          fallback={
            <div style={{ height: '240px', background: 'var(--db-surface, #18282C)', borderRadius: '14px', padding: '20px' }}>
              <SkeletonPrimitive width="40%" height="16px" />
            </div>
          }
        >
          <LazyCostVsRepoSection />
        </LazyViewport>
      </div>

      {/* AMC Allocation Chart in LazyViewport */}
      <LazyViewport
        minHeight="240px"
        rootMargin="100px"
        fallback={
          <div style={{ height: '240px', background: 'var(--db-surface, #18282C)', borderRadius: '14px', padding: '20px' }}>
            <SkeletonPrimitive width="40%" height="16px" />
          </div>
        }
      >
        <LazyAmcAllocationSection cadence={cadence} />
      </LazyViewport>

      {/* CP Scheme Holders Table in LazyViewport */}
      <LazyViewport
        minHeight="320px"
        rootMargin="100px"
        fallback={<TableSkeleton rows={6} cols={5} />}
      >
        <LazyCpHoldersSection cadence={cadence} />
      </LazyViewport>

      <SourceAttribution extraDisclaimer={MTF_FUNDING_DISCLAIMER} />
    </div>
  )
}
