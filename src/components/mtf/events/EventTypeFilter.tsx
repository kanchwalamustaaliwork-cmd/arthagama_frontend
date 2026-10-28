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
    <div className="flex flex-wrap gap-1.5">
      {TYPES.map((t) => {
        const active = selected === t.value || (!selected && t.value === 'ALL')
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value === 'ALL' ? undefined : t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              active
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

