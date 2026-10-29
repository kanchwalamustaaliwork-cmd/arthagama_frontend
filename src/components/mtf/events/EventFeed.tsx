'use client'

import React from 'react'
import type { MtfEvent } from '@/src/types/mtf'
import { formatDate } from '@/src/utils/mtf/formatters'
import { SkeletonPrimitive } from '@/src/components/stockdashboard/shared/Skeletons'
import { AlertTriangle, TrendingUp, ShieldAlert, Award, FileSpreadsheet, Building } from 'lucide-react'

const BADGES: Record<
  string,
  { bg: string; text: string; label: string; icon: React.ComponentType<{ size: number; color?: string }> }
> = {
  flush: {
    bg: 'rgba(227, 93, 106, 0.15)',
    text: 'var(--db-loss, #E35D6A)',
    label: 'Margin Flush',
    icon: AlertTriangle,
  },
  book_ath: {
    bg: 'rgba(34, 197, 94, 0.15)',
    text: 'var(--db-gain, #22C55E)',
    label: 'All-Time High',
    icon: TrendingUp,
  },
  book_milestone: {
    bg: 'rgba(184, 206, 194, 0.15)',
    text: 'var(--db-mint, #B8CEC2)',
    label: 'Milestone',
    icon: Award,
  },
  surveillance: {
    bg: 'rgba(245, 158, 11, 0.15)',
    text: '#F59E0B',
    label: 'Surveillance Alert',
    icon: ShieldAlert,
  },
  pledge_book: {
    bg: 'rgba(56, 189, 248, 0.15)',
    text: '#38BDF8',
    label: 'Pledge & Book',
    icon: FileSpreadsheet,
  },
  broker_ath: {
    bg: 'rgba(167, 139, 250, 0.15)',
    text: '#A78BFA',
    label: 'Broker ATH',
    icon: Building,
  },
}

interface EventFeedProps {
  events: MtfEvent[]
  loading?: boolean
}

export function EventFeed({ events, loading }: EventFeedProps) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: '80px',
              borderRadius: '12px',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              background: 'var(--db-surface, #18282C)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <SkeletonPrimitive width="30%" height="14px" />
            <SkeletonPrimitive width="75%" height="16px" />
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div
        style={{
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '36px',
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--db-text-muted, #708482)',
        }}
      >
        No market facility events matching the selected filter.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {events.map((e) => {
        const b = BADGES[e.event_type] ?? {
          bg: 'rgba(184, 206, 194, 0.1)',
          text: 'var(--db-mint, #B8CEC2)',
          label: e.event_type,
          icon: AlertTriangle,
        }
        const Icon = b.icon

        return (
          <div
            key={e.event_id}
            style={{
              borderRadius: '14px',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              background: 'var(--db-surface, #18282C)',
              padding: '16px 20px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              transition: 'border-color 0.18s ease, transform 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(184, 206, 194, 0.28)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--db-border, rgba(184, 206, 194, 0.12))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 9px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: b.bg,
                  color: b.text,
                }}
              >
                <Icon size={12} color={b.text} />
                <span>{b.label}</span>
              </span>
              <span style={{ fontSize: '11.5px', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                {formatDate(e.event_date)}
              </span>
            </div>

            <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0, lineHeight: 1.5 }}>
              {e.headline ?? 'Unspecified event occurrence'}
            </p>
          </div>
        )
      })}
    </div>
  )
}
