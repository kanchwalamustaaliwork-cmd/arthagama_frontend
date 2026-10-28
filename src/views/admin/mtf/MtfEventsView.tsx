'use client'
import React, { useState } from 'react'
import { useMtfEvents } from '@/src/hooks/mtf/useMtfData'
import { EventFeed } from '@/src/components/mtf/events/EventFeed'
import { EventTypeFilter } from '@/src/components/mtf/events/EventTypeFilter'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import type { MtfEventType } from '@/src/types/mtf'

export function MtfEventsView() {
  const [type, setType] = useState<MtfEventType | undefined>()
  const { data, loading } = useMtfEvents({ type })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">MTF Market Events & Flushes</h1>
          <p className="text-xs text-gray-500 mt-0.5">Liquidation flushes, milestone highs, surveillance actions</p>
        </div>
        <AsOfBadge asOf={data?.as_of} />
      </div>

      <EventTypeFilter selected={type ?? 'ALL'} onChange={setType} />

      <EventFeed events={data?.items ?? []} loading={loading} />

      <SourceAttribution />
    </div>
  )
}
