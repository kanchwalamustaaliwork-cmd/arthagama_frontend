'use client'

import React, { useState, useEffect } from 'react'
import { methodologyApi } from '@/src/lib/api/mtf/methodology.api'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import { formatCr } from '@/src/utils/mtf/formatters'
import { Database, CheckCircle, AlertCircle } from 'lucide-react'
import type { MtfCoverageMatrix, MtfDatasetStatus } from '@/src/lib/api/mtf/methodology.api'

export function MtfMethodologyView() {
  const [coverage, setCoverage] = useState<{ items?: MtfCoverageMatrix[]; as_of?: string } | null>(null)
  const [datasetList, setDatasetList] = useState<MtfDatasetStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([methodologyApi.getCoverage(), methodologyApi.getDatasets()])
      .then(([cov, dat]) => {
        if (!alive) return
        setCoverage(cov)
        const items = dat?.items || dat?.datasets || []
        setDatasetList(items)
      })
      .catch((e) => {
        console.error('Failed to load methodology data:', e)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => { alive = false }
  }, [])

  const coverageItems = coverage?.items ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            <Database size={18} color="var(--db-mint, #B8CEC2)" />
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Data Ingestion &amp; Methodology
            </h2>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
            }}
          >
            Pipeline status of daily NSE/BSE MTF scraping, Demat beneficiary owner files, and AMFI scheme holdings.
          </p>
        </div>

        <AsOfBadge asOf={coverage?.as_of} />
      </div>

      {/* Dataset status */}
      <div
        style={{
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.1))' }}>
          <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
            Dataset Ingestion Status
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--db-surface-2, #1E3438)',
                  borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--db-text-muted, #708482)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '12px 16px' }}>Dataset Name</th>
                <th style={{ padding: '12px 16px' }}>Last As-Of</th>
                <th style={{ padding: '12px 16px' }}>Last OK Sync</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Rows Loaded</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} style={{ padding: '12px 16px' }}>
                      <div style={{ height: '16px', background: 'var(--db-surface-2, #1E3438)', borderRadius: '4px' }} />
                    </td>
                  </tr>
                ))
              ) : datasetList.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '32px 16px',
                      textAlign: 'center',
                      color: 'var(--db-text-muted, #708482)',
                      fontSize: '13px',
                    }}
                  >
                    No dataset ingestion logs available yet.
                  </td>
                </tr>
              ) : (
                datasetList.map((d) => {
                  const rows = d.rows_upserted ?? d.rows_loaded
                  const isOk = (d.status ?? 'ok').toLowerCase() === 'ok' || (d.status ?? '').toLowerCase() === 'success'

                  return (
                    <tr
                      key={d.dataset}
                      style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))' }}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                        {d.dataset}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', color: 'var(--db-text-2, #A5B7B3)' }}>
                        {d.last_as_of ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                        {d.finished_at ? d.finished_at.slice(0, 10) : (d.last_ok_at ?? '—')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                        {rows != null ? rows.toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: isOk ? 'rgba(34, 197, 94, 0.12)' : 'rgba(227, 93, 106, 0.12)',
                            color: isOk ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {isOk ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                          {d.status ?? 'OK'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fund-House Coverage Matrix */}
      {coverageItems.length > 0 && (
        <LazyViewport minHeight="260px" fallback={<TableSkeleton rows={5} cols={6} />}>
          <div
            style={{
              borderRadius: '14px',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              background: 'var(--db-surface, #18282C)',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.1))' }}>
              <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                Fund-House Coverage Matrix
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr
                    style={{
                      background: 'var(--db-surface-2, #1E3438)',
                      borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--db-text-muted, #708482)',
                      textTransform: 'uppercase',
                    }}
                  >
                    <th style={{ padding: '12px 16px' }}>AMC</th>
                    <th style={{ padding: '12px 16px' }}>Cadence</th>
                    <th style={{ padding: '12px 16px' }}>As of</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Schemes</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>AUM</th>
                  </tr>
                </thead>
                <tbody>
                  {coverageItems.map((r, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>{r.amc}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--db-text-2, #A5B7B3)' }}>
                        {r.cadence === 'M' ? 'Monthly' : 'Fortnightly'}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                        {r.as_of}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--db-mint, #B8CEC2)' }}>{r.status}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                        {r.scheme_count ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 700, color: 'var(--db-text, #F7FAF9)' }}>
                        {formatCr(r.aum_cr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </LazyViewport>
      )}

      {/* Attribution & Legal */}
      <div
        style={{
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '12.5px',
          color: 'var(--db-text-2, #A5B7B3)',
          lineHeight: 1.6,
        }}
      >
        <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
          Attribution, Storage &amp; Methodology Units
        </h4>
        <p style={{ margin: 0 }}>
          MTF records aggregated from NSE &amp; BSE daily disclosures. All monetary values stored and processed as INR Crores (NUMERIC 20,4) for consistency.
        </p>
        <p style={{ margin: 0, color: 'var(--db-text-muted, #708482)', fontSize: '11.5px' }}>
          Underlying data copyright belongs to respective exchanges and SEBI. Compiled datasets maintained under CC BY-SA 4.0.
        </p>
      </div>

      <SourceAttribution />
    </div>
  )
}
