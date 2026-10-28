'use client'
import React, { useState } from 'react'
import { useMtfBrokers, useBrokerHistory } from '@/src/hooks/mtf/useMtfBrokers'
import { BrokerRankTable } from '@/src/components/mtf/brokers/BrokerRankTable'
import { BrokerHistoryChart } from '@/src/components/mtf/brokers/BrokerHistoryChart'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { MTF_BROKER_CAVEAT } from '@/src/utils/mtf/formatters'

export function MtfBrokersView() {
  const { data, loading } = useMtfBrokers()
  const [selectedBroker, setSelectedBroker] = useState<{ slug: string; name: string } | null>(null)
  const { data: history, loading: historyLoading } = useBrokerHistory(selectedBroker?.slug ?? '')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Broker MTF Disclosures</h1>
          <p className="text-xs text-gray-500 mt-0.5">Disclosed book size, market shares & historical trend</p>
        </div>
        <AsOfBadge asOf={data?.as_of} />
      </div>

      {selectedBroker && (
        <BrokerHistoryChart
          brokerName={selectedBroker.name}
          data={history?.items ?? []}
          loading={historyLoading}
        />
      )}

      <BrokerRankTable items={data?.items ?? []} isLoading={loading} />

      <SourceAttribution extraDisclaimer={MTF_BROKER_CAVEAT} />
    </div>
  )
}
