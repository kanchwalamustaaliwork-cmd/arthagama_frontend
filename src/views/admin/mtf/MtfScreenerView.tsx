'use client'

import React, { useState } from 'react'
import { useMtfStocks } from '@/src/hooks/mtf/useMtfStocks'
import { MtfFilterBuilder } from '@/src/components/mtf/stocks/MtfFilterBuilder'
import { MtfStocksTable } from '@/src/components/mtf/stocks/MtfStocksTable'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { stocksApi } from '@/src/lib/api/mtf/stocks.api'
import { exportStocksToCsv } from '@/src/utils/mtf/csv-export'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import { Download, SlidersHorizontal } from 'lucide-react'
import type { MtfStockFilters } from '@/src/types/mtf'

export function MtfScreenerView() {
  const [filters, setFilters] = useState<MtfStockFilters>({
    page: 1,
    size: 25,
    sort_by: 'book_cr',
    sort_dir: 'desc',
  })
  const [exporting, setExporting] = useState(false)
  const { data, loading } = useMtfStocks(filters)

  /**
   * Pure Frontend Export:
   * Generates and downloads the CSV directly in the browser memory using Blob API.
   * No backend CSV route or file generation needed.
   * 
   * - By default: Instantly exports the currently filtered stocks loaded in memory.
   * - If user wants all matching stocks across pages: fetches the JSON items once and converts to CSV in browser.
   */
  const handleExportCurrent = () => {
    if (!data?.items || data.items.length === 0) return
    exportStocksToCsv(
      data.items,
      `mtf_stocks_page_${filters.page ?? 1}_${new Date().toISOString().slice(0, 10)}.csv`
    )
  }

  const handleExportAll = async () => {
    if (!data?.total) return
    try {
      setExporting(true)
      if (data.total <= data.items.length) {
        exportStocksToCsv(data.items)
      } else {
        await stocksApi.exportFromFrontend(filters, data.total)
      }
    } catch (err) {
      console.error('Frontend export failed:', err)
      // Fallback to currently loaded items
      if (data?.items?.length) exportStocksToCsv(data.items)
    } finally {
      setExporting(false)
    }
  }

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
            <SlidersHorizontal size={18} color="var(--db-mint, #B8CEC2)" />
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              MTF Stock Screener &amp; Surveillance
            </h2>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
            }}
          >
            Filter, rank, and analyze over 3,400+ MTF-eligible securities by margin debt, leverage %, and 30-day expansion.
          </p>
        </div>

        <AsOfBadge asOf={data?.as_of} />
      </div>

      {/* Filter Builder */}
      <MtfFilterBuilder filters={filters} onChange={setFilters} />

      {/* Subheader: counts & export */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '12.5px',
          color: 'var(--db-text-muted, #708482)',
        }}
      >
        <span>
          {data
            ? `Showing ${data.items.length} of ${data.total.toLocaleString()} securities (Page ${filters.page ?? 1} of ${data.pages})`
            : 'Loading securities data…'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleExportCurrent}
            disabled={!data?.items?.length || loading}
            title="Download the currently visible filtered stocks directly from browser memory"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--db-text, #F7FAF9)',
              background: 'var(--db-surface, #18282C)',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: !data?.items?.length || loading ? 'not-allowed' : 'pointer',
              opacity: !data?.items?.length || loading ? 0.5 : 1,
              transition: 'background 0.15s ease',
            }}
          >
            <Download size={13} color="var(--db-mint, #B8CEC2)" />
            <span>Export Visible ({data?.items?.length ?? 0})</span>
          </button>

          {data && data.total > data.items.length && (
            <button
              type="button"
              onClick={handleExportAll}
              disabled={exporting || loading}
              title="Download all filtered matching stocks as CSV"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--db-mint, #B8CEC2)',
                background: 'rgba(46, 85, 96, 0.25)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.3))',
                borderRadius: '8px',
                padding: '6px 14px',
                cursor: exporting || loading ? 'wait' : 'pointer',
                opacity: exporting || loading ? 0.6 : 1,
                transition: 'background 0.15s ease',
              }}
            >
              <Download size={13} />
              <span>{exporting ? 'Generating CSV…' : `Export All (${data.total.toLocaleString()})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Wrapped in LazyViewport */}
      <LazyViewport
        minHeight="380px"
        rootMargin="100px"
        fallback={<TableSkeleton rows={8} cols={8} />}
      >
        <MtfStocksTable items={data?.items ?? []} loading={loading} />
      </LazyViewport>

      {/* Pagination Controls */}
      {data && data.pages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>
            Page {filters.page ?? 1} of {data.pages}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                color: (filters.page ?? 1) <= 1 ? 'var(--db-text-muted, #708482)' : 'var(--db-text, #F7FAF9)',
                cursor: (filters.page ?? 1) <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              Previous
            </button>
            <button
              disabled={(filters.page ?? 1) >= data.pages}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                color: (filters.page ?? 1) >= data.pages ? 'var(--db-text-muted, #708482)' : 'var(--db-text, #F7FAF9)',
                cursor: (filters.page ?? 1) >= data.pages ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 500,
              }}
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
