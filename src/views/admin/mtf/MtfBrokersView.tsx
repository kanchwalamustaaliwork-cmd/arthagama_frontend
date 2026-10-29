'use client'

import React, { useState } from 'react'
import { useMtfBrokers, useBrokerHistory } from '@/src/hooks/mtf/useMtfBrokers'
import { BrokerRankTable } from '@/src/components/mtf/brokers/BrokerRankTable'
import { BrokerHistoryChart } from '@/src/components/mtf/brokers/BrokerHistoryChart'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { MTF_BROKER_CAVEAT } from '@/src/utils/mtf/formatters'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import { Building2 } from 'lucide-react'

export function MtfBrokersView() {
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active')
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null)

  // Disclosed latest ranking
  const { data: rankingData, loading: rankingLoading } = useMtfBrokers()

  // Full history series for active or archive brokers
  const historySlug = activeTab === 'active' ? 'all' : 'archive'
  const { data: historyData, loading: historyLoading } = useBrokerHistory(historySlug)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
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
            <Building2 size={20} color="var(--db-mint, #B8CEC2)" />
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Broker MTF Book Disclosures
            </h2>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
              maxWidth: '640px',
            }}
          >
            Disclosed MTF loan books, market shares, and historical debt series across primary Indian brokerages.
          </p>
        </div>

        <AsOfBadge asOf={rankingData?.as_of} />
      </div>

      {/* Multi-Series MTF Book History Chart */}
      <BrokerHistoryChart
        items={historyData?.items ?? []}
        loading={historyLoading}
        selectedBrokerId={selectedBrokerId}
        onSelectBroker={setSelectedBrokerId}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Disclosed Ranking Table */}
      <LazyViewport
        minHeight="340px"
        rootMargin="100px"
        fallback={<TableSkeleton rows={8} cols={6} />}
      >
        <BrokerRankTable
          items={rankingData?.items ?? []}
          isLoading={rankingLoading}
          selectedBrokerId={selectedBrokerId}
          onSelectBroker={setSelectedBrokerId}
          caveat={rankingData?.caveat || MTF_BROKER_CAVEAT}
        />
      </LazyViewport>

      <SourceAttribution extraDisclaimer={MTF_BROKER_CAVEAT} />
    </div>
  )
}
