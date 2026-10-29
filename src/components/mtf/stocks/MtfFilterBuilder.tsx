'use client'

import React from 'react'
import type { MtfStockFilters } from '@/src/types/mtf'
import { Search } from 'lucide-react'

interface MtfFilterBuilderProps {
  filters: MtfStockFilters
  onChange: (filters: MtfStockFilters) => void
}

export function MtfFilterBuilder({ filters, onChange }: MtfFilterBuilderProps) {
  const update = (patch: Partial<MtfStockFilters>) =>
    onChange({ ...filters, ...patch, page: 1 })

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: '12px',
        background: 'var(--db-surface, #18282C)',
        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      {/* Search Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px', flex: 1 }}>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--db-text-muted, #708482)' }}>
          Search Security
        </label>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            color="var(--db-text-muted, #708482)"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            style={{
              width: '100%',
              height: '34px',
              paddingLeft: '32px',
              paddingRight: '12px',
              fontSize: '12.5px',
              color: 'var(--db-text, #F7FAF9)',
              background: 'var(--db-surface-2, #1E3438)',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
              borderRadius: '8px',
              outline: 'none',
            }}
            placeholder="Search by Symbol or ISIN…"
            value={filters.q ?? ''}
            onChange={(e) => update({ q: e.target.value || undefined })}
          />
        </div>
      </div>

      {/* Exchange Select */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--db-text-muted, #708482)' }}>
          Exchange
        </label>
        <select
          style={{
            height: '34px',
            padding: '0 12px',
            fontSize: '12.5px',
            color: 'var(--db-text, #F7FAF9)',
            background: 'var(--db-surface-2, #1E3438)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
            borderRadius: '8px',
            outline: 'none',
          }}
          value={filters.exchange ?? ''}
          onChange={(e) => update({ exchange: (e.target.value as 'NSE' | 'BSE') || undefined })}
        >
          <option value="">All Exchanges</option>
          <option value="NSE">NSE</option>
          <option value="BSE">BSE</option>
        </select>
      </div>

      {/* Asset Class Select */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--db-text-muted, #708482)' }}>
          Asset Class
        </label>
        <select
          style={{
            height: '34px',
            padding: '0 12px',
            fontSize: '12.5px',
            color: 'var(--db-text, #F7FAF9)',
            background: 'var(--db-surface-2, #1E3438)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
            borderRadius: '8px',
            outline: 'none',
          }}
          value={filters.asset_class ?? ''}
          onChange={(e) =>
            update({ asset_class: (e.target.value as 'FNO' | 'NON_FNO' | 'ETF') || undefined })
          }
        >
          <option value="">All Classes</option>
          <option value="FNO">F&amp;O Eligible</option>
          <option value="NON_FNO">Non-F&amp;O</option>
          <option value="ETF">ETF</option>
        </select>
      </div>

      {/* Sort By Select */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--db-text-muted, #708482)' }}>
          Sort Metric
        </label>
        <select
          style={{
            height: '34px',
            padding: '0 12px',
            fontSize: '12.5px',
            color: 'var(--db-text, #F7FAF9)',
            background: 'var(--db-surface-2, #1E3438)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
            borderRadius: '8px',
            outline: 'none',
          }}
          value={filters.sort_by ?? 'book_cr'}
          onChange={(e) => update({ sort_by: e.target.value })}
        >
          <option value="book_cr">MTF Book Size</option>
          <option value="leverage_pct">Leverage % of MCap</option>
          <option value="change_30d_pct">30-Day Growth</option>
          <option value="mcap_cr">Market Cap</option>
        </select>
      </div>

      {/* Sort Direction Select */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--db-text-muted, #708482)' }}>
          Order
        </label>
        <select
          style={{
            height: '34px',
            padding: '0 12px',
            fontSize: '12.5px',
            color: 'var(--db-text, #F7FAF9)',
            background: 'var(--db-surface-2, #1E3438)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
            borderRadius: '8px',
            outline: 'none',
          }}
          value={filters.sort_dir ?? 'desc'}
          onChange={(e) => update({ sort_dir: (e.target.value as 'asc' | 'desc') || 'desc' })}
        >
          <option value="desc">Highest First</option>
          <option value="asc">Lowest First</option>
        </select>
      </div>

      {/* Reset Button */}
      {(filters.q || filters.exchange || filters.asset_class) && (
        <button
          type="button"
          onClick={() => onChange({ page: 1, size: 25, sort_by: 'book_cr', sort_dir: 'desc' })}
          style={{
            height: '34px',
            padding: '0 12px',
            fontSize: '12px',
            color: 'var(--db-mint, #B8CEC2)',
            background: 'transparent',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Reset Filters
        </button>
      )}
    </div>
  )
}
