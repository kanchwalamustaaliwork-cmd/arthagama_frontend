import React from 'react'
import { formatDate } from '@/src/utils/mtf/formatters'
import { Calendar } from 'lucide-react'

interface Props {
  asOf?: string | null
  note?: string
  className?: string
}

export function AsOfBadge({ asOf, note, className }: Props) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '12px',
        color: 'var(--db-text-muted, #708482)',
      }}
      className={className}
    >
      {asOf && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--db-surface, #18282C)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            borderRadius: '20px',
            padding: '3px 10px',
            color: 'var(--db-text-2, #A5B7B3)',
          }}
        >
          <Calendar size={12} color="var(--db-mint, #B8CEC2)" />
          <span>
            As of: <strong style={{ color: 'var(--db-text, #F7FAF9)' }}>{formatDate(asOf)}</strong>
          </span>
        </span>
      )}
      <span
        style={{
          background: 'rgba(184, 206, 194, 0.06)',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
          borderRadius: '20px',
          padding: '3px 10px',
          color: 'var(--db-text-muted, #708482)',
        }}
      >
        Source: NSE/BSE Disclosures
      </span>
      {note && (
        <span style={{ color: '#F59E0B', fontWeight: 500 }}>{note}</span>
      )}
    </div>
  )
}
