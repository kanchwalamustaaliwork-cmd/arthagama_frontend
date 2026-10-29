'use client'

import React from 'react'

interface DateRangePickerProps {
  from?: string
  to?: string
  onChange: (range: { from?: string; to?: string }) => void
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        background: 'var(--db-surface, #18282C)',
        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
        borderRadius: '10px',
        padding: '4px 10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <label style={{ color: 'var(--db-text-muted, #708482)', fontWeight: 500 }}>From</label>
        <input
          type="date"
          value={from ?? ''}
          onChange={(e) => onChange({ from: e.target.value || undefined, to })}
          style={{
            background: 'var(--db-surface-2, #1E3438)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.16))',
            borderRadius: '6px',
            color: 'var(--db-text, #F7FAF9)',
            fontSize: '12px',
            padding: '4px 8px',
            colorScheme: 'dark',
            outline: 'none',
          }}
        />
      </div>
      <span style={{ color: 'var(--db-text-muted, #708482)' }}>→</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <label style={{ color: 'var(--db-text-muted, #708482)', fontWeight: 500 }}>To</label>
        <input
          type="date"
          value={to ?? ''}
          onChange={(e) => onChange({ from, to: e.target.value || undefined })}
          style={{
            background: 'var(--db-surface-2, #1E3438)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.16))',
            borderRadius: '6px',
            color: 'var(--db-text, #F7FAF9)',
            fontSize: '12px',
            padding: '4px 8px',
            colorScheme: 'dark',
            outline: 'none',
          }}
        />
      </div>
      {(from || to) && (
        <button
          type="button"
          onClick={() => onChange({ from: undefined, to: undefined })}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--db-text-muted, #708482)',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '13px',
          }}
          title="Reset date range"
        >
          ✕
        </button>
      )}
    </div>
  )
}
