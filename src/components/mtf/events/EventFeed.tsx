'use client'
import React from 'react'
import type { MtfEvent } from '@/src/types/mtf'
import { formatDate } from '@/src/utils/mtf/formatters'

const BADGES: Record<string, { bg: string; text: string; label: string }> = {
  flush: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Margin Flush' },
  book_ath: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'All-Time High' },
  book_milestone: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Milestone' },
  surveillance: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Surveillance' },
  pledge_book: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pledge+Book' },
  broker_ath: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Broker ATH' },
}

interface EventFeedProps {
  events: MtfEvent[]
  loading?: boolean
}

export function EventFeed({ events, loading }: EventFeedProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl border bg-white p-4 animate-pulse" />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-400">
        No market facility events matching the filter.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((e) => {
        const b = BADGES[e.event_type] ?? { bg: 'bg-gray-100', text: 'text-gray-700', label: e.event_type }
        return (
          <div key={e.event_id} className="rounded-xl border bg-white p-4 shadow-sm hover:border-purple-200 transition-colors">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${b.bg} ${b.text}`}>
                {b.label}
              </span>
              <span className="text-xs text-gray-400">{formatDate(e.event_date)}</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 leading-snug">{e.headline ?? 'Unspecified event'}</p>
          </div>
        )
      })}
    </div>
  )
}

