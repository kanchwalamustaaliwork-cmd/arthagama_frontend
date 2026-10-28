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

export function MtfOverviewView() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({})
  const { data: summary, loading: summaryLoading } = useMtfSummary()
  const { data: totalsData, loading: totalsLoading } = useMtfTotals(range)
  const { data: flowData, loading: flowLoading } = useMtfFlow(range)
  const { data: breadthData, loading: breadthLoading } = useMtfBreadth(range)
  const { data: compositionData, loading: compositionLoading } = useMtfComposition(range)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">MTF Market Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Aggregate Margin Trading Facility debt, flow dynamics & breadth</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
          <AsOfBadge asOf={summary?.as_of} />
        </div>
      </div>

      {/* KPI summary cards */}
      <MtfKpiStrip />

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookTrendChart data={totalsData?.data ?? []} loading={totalsLoading} />
        <FlowChart data={flowData?.data ?? []} loading={flowLoading} />
        <BreadthChart data={breadthData?.data ?? []} loading={breadthLoading} />
        <CompositionChart data={compositionData?.data ?? []} loading={compositionLoading} />
      </div>

      <SourceAttribution />
    </div>
  )
}
