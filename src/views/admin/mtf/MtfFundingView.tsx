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

export function MtfFundingView() {
  const [cadence, setCadence] = useState<'M' | 'F'>('M')
  const { data: cpData, loading: cpLoading } = useCpOutstanding()
  const { data: wallData, loading: wallLoading } = useMaturityWall()
  const { data: costData, loading: costLoading } = useCostVsRepo()
  const { data: holdersData, loading: holdersLoading } = useCpHolders({ cadence })
  const { data: amcData, loading: amcLoading } = useAmcAllocation({ cadence })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Broker Funding & Commercial Paper</h1>
          <p className="text-xs text-gray-500 mt-0.5">Short-term debt financing, CP maturity wall, and mutual fund holders</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Cadence switch */}
          <div className="inline-flex rounded-lg border bg-gray-50 p-0.5 text-xs">
            <button
              onClick={() => setCadence('M')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                cadence === 'M' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCadence('F')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                cadence === 'F' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Mid-Month
            </button>
          </div>
          <AsOfBadge asOf={cpData?.as_of} />
        </div>
      </div>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-xs text-amber-800">
        <span className="font-semibold">Disclaimer: </span>
        {MTF_FUNDING_DISCLAIMER}
      </div>

      {/* Visual Analytics */}
      <MaturityWallChart buckets={wallData?.buckets ?? []} loading={wallLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CpOutstandingChart items={cpData?.items ?? []} loading={cpLoading} />
        <CostVsRepoChart data={costData?.items ?? []} loading={costLoading} />
      </div>

      <AmcAllocationChart data={amcData?.items ?? []} loading={amcLoading} />

      <CpHoldersTable items={holdersData?.items ?? []} loading={holdersLoading} />

      <SourceAttribution extraDisclaimer={MTF_FUNDING_DISCLAIMER} />
    </div>
  )
}
