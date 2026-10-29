'use client'

import React from 'react'
import type { MtfEventType } from '@/src/types/mtf'

const TYPES: { label: string; value: MtfEventType | 'ALL' }[] = [
  { label: 'All Events', value: 'ALL' },
  { label: 'Margin Flushes', value: 'flush' },
  { label: 'Book ATH', value: 'book_ath' },
  { label: 'Book Milestones', value: 'book_milestone' },
  { label: 'Surveillance Triggers', value: 'surveillance' },
  { label: 'Pledge Build-up', value: 'pledge_book' },
  { label: 'Broker Records', value: 'broker_ath' },
]

interface EventTypeFilterProps {
  selected?: MtfEventType | 'ALL'
  onChange: (type?: MtfEventType) => void
}

export function EventTypeFilter({ selected = 'ALL', onChange }: EventTypeFilterProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {TYPES.map((t) => {
        const active = selected === t.value || (!selected && t.value === 'ALL')
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value === 'ALL' ? undefined : t.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: active ? 600 : 500,
              cursor: 'pointer',
              border: active
                ? '1px solid var(--db-mint, #B8CEC2)'
                : '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              background: active ? 'var(--db-surface, #18282C)' : 'transparent',
              color: active ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-2, #A5B7B3)',
              transition: 'all 0.15s ease',
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
