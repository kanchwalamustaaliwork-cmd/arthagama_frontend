'use client';
import React, { useState } from 'react';
import type { MtfStockFilters } from '@/src/types/mtf';

interface MtfFilterBuilderProps {
  filters: MtfStockFilters;
  onChange: (filters: MtfStockFilters) => void;
}

/** Declarative filter panel for the MTF stock screener. Server-side only — all filtering via API. */
export function MtfFilterBuilder({ filters, onChange }: MtfFilterBuilderProps) {
  const update = (patch: Partial<MtfStockFilters>) =>
    onChange({ ...filters, ...patch, page: 1 });

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Search */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Search</label>
        <input
          className="h-8 rounded-md border px-2 text-sm w-40"
          placeholder="Symbol / ISIN"
          value={filters.q ?? ''}
          onChange={(e) => update({ q: e.target.value || undefined })}
        />
      </div>

      {/* Exchange */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Exchange</label>
        <select
          className="h-8 rounded-md border px-2 text-sm"
          value={filters.exchange ?? ''}
          onChange={(e) => update({ exchange: (e.target.value as 'NSE' | 'BSE') || undefined })}
        >
          <option value="">All</option>
          <option value="NSE">NSE</option>
          <option value="BSE">BSE</option>
        </select>
      </div>

      {/* Asset class */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Class</label>
        <select
          className="h-8 rounded-md border px-2 text-sm"
          value={filters.asset_class ?? ''}
          onChange={(e) =>
            update({ asset_class: (e.target.value as 'FNO' | 'NON_FNO' | 'ETF') || undefined })
          }
        >
          <option value="">All</option>
          <option value="FNO">F&O</option>
          <option value="NON_FNO">Non-F&O</option>
          <option value="ETF">ETF</option>
        </select>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Sort by</label>
        <select
          className="h-8 rounded-md border px-2 text-sm"
          value={filters.sort_by ?? 'book_cr'}
          onChange={(e) => update({ sort_by: e.target.value })}
        >
          <option value="book_cr">MTF Book</option>
          <option value="leverage_pct">Leverage %</option>
          <option value="mcap_cr">Mcap</option>
          <option value="change_30d_pct">30d Change</option>
        </select>
      </div>

      <button
        className="h-8 px-3 rounded-md bg-muted text-sm hover:bg-muted/70"
        onClick={() => onChange({ page: 1, size: filters.size })}
      >
        Clear
      </button>
    </div>
  );
}
