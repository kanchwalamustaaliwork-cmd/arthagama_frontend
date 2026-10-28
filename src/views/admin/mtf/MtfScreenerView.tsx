'use client'
import React, { useState } from 'react'
import { useMtfStocks } from '@/src/hooks/mtf/useMtfStocks'
import { MtfFilterBuilder } from '@/src/components/mtf/stocks/MtfFilterBuilder'
import { MtfStocksTable } from '@/src/components/mtf/stocks/MtfStocksTable'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { stocksApi } from '@/src/lib/api/mtf/stocks.api'
import type { MtfStockFilters } from '@/src/types/mtf'

export function MtfScreenerView() {
  const [filters, setFilters] = useState<MtfStockFilters>({
    page: 1,
    size: 25,
    sort_by: 'book_cr',
    sort_dir: 'desc',
  })
  const { data, loading } = useMtfStocks(filters)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">MTF Stock Screener</h1>
          <p className="text-xs text-gray-500 mt-0.5">Filter & rank over 3,400+ MTF-eligible securities</p>
        </div>
        <AsOfBadge asOf={data?.as_of} />
      </div>

      <MtfFilterBuilder filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{data ? `Showing ${data.items.length} of ${data.total.toLocaleString()} securities` : 'Loading...'}</span>
        <a
          href={stocksApi.getExportUrl(filters)}
          className="inline-flex items-center gap-1 font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md"
          download
        >
          ⬇ Export Filtered CSV
        </a>
      </div>

      <MtfStocksTable items={data?.items ?? []} loading={loading} />

      {/* Pagination controls */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            Page {filters.page ?? 1} of {data.pages}
          </p>
          <div className="flex gap-1.5">
            <button
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              className="px-3 py-1 rounded-md border bg-white text-xs text-gray-700 disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              disabled={(filters.page ?? 1) >= data.pages}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              className="px-3 py-1 rounded-md border bg-white text-xs text-gray-700 disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <SourceAttribution />
    </div>
  )
}
