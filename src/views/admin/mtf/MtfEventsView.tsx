'use client'

import React, { useState } from 'react'
import { useMtfEvents } from '@/src/hooks/mtf/useMtfData'
import { EventFeed } from '@/src/components/mtf/events/EventFeed'
import { EventTypeFilter } from '@/src/components/mtf/events/EventTypeFilter'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { SkeletonPrimitive } from '@/src/components/stockdashboard/shared/Skeletons'
import { AlertTriangle } from 'lucide-react'
import type { MtfEventType } from '@/src/types/mtf'

export function MtfEventsView() {
  const [type, setType] = useState<MtfEventType | undefined>()
  const { data, loading } = useMtfEvents({ type })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <AlertTriangle size={18} color="var(--db-mint, #B8CEC2)" />
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              MTF Market Events &amp; Margin Flushes
            </h2>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
            }}
          >
            Systemic liquidation flushes, milestone leverage highs, regulatory surveillance actions, and broker book milestones.
          </p>
        </div>

        <AsOfBadge asOf={data?.as_of} />
      </div>

      {/* Filter Chips */}
      <EventTypeFilter selected={type ?? 'ALL'} onChange={setType} />

      {/* Event Feed wrapped in LazyViewport */}
      <LazyViewport
        minHeight="360px"
        rootMargin="100px"
        fallback={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '76px',
                  borderRadius: '12px',
                  background: 'var(--db-surface, #18282C)',
                  border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                  padding: '16px',
                }}
              >
                <SkeletonPrimitive width="60%" height="16px" />
              </div>
            ))}
          </div>
        }
      >
        <EventFeed events={data?.items ?? []} loading={loading} />
      </LazyViewport>

      <SourceAttribution />
    </div>
  )
}
