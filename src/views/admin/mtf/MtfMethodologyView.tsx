'use client'
import React from 'react'
import { methodologyApi } from '@/src/lib/api/mtf/methodology.api'
import { useState, useEffect } from 'react'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import type { MtfCoverageMatrix, MtfDatasetStatus } from '@/src/lib/api/mtf/methodology.api'
import { formatCr } from '@/src/utils/mtf/formatters'

export function MtfMethodologyView() {
  const [coverage, setCoverage] = useState<{ items: MtfCoverageMatrix[]; as_of: string } | null>(null)
  const [datasets, setDatasets] = useState<{ items: MtfDatasetStatus[] } | null>(null)

  useEffect(() => {
    methodologyApi.getCoverage().then(setCoverage).catch(() => {})
    methodologyApi.getDatasets().then(setDatasets).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold">Data & Methodology</h1>
        <AsOfBadge asOf={coverage?.as_of} />
      </div>
      {/* Dataset status */}
      <section>
        <h2 className="font-medium mb-2">Dataset Ingestion Status</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Dataset','Last As-of','Last OK','Rows','Status'].map(h=><th key={h} className="text-left px-3 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {datasets?.items.map(d => (
                <tr key={d.dataset} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs">{d.dataset}</td>
                  <td className="px-3 py-2">{d.last_as_of ?? '—'}</td>
                  <td className="px-3 py-2">{d.last_ok_at ?? '—'}</td>
                  <td className="px-3 py-2">{d.rows_loaded?.toLocaleString() ?? '—'}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${d.status==='ok'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Fund-house coverage */}
      {coverage && coverage.items.length > 0 && (
        <section>
          <h2 className="font-medium mb-2">Fund-House Coverage Matrix</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{['AMC','Cadence','As of','Status','Schemes','AUM'].map(h=><th key={h} className="text-left px-3 py-2">{h}</th>)}</tr>
              </thead>
              <tbody>
                {coverage.items.map((r,i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{r.amc}</td>
                    <td className="px-3 py-2">{r.cadence==='M'?'Monthly':'Fortnightly'}</td>
                    <td className="px-3 py-2">{r.as_of}</td>
                    <td className="px-3 py-2 text-xs">{r.status}</td>
                    <td className="px-3 py-2">{r.scheme_count ?? '—'}</td>
                    <td className="px-3 py-2">{formatCr(r.aum_cr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {/* Attribution */}
      <section className="text-sm space-y-2">
        <h2 className="font-medium">Attribution & Licence</h2>
        <p>MTF data via mtf.trading, from NSE/BSE disclosures. Compiled dataset: CC BY-SA 4.0 (ShareAlike).</p>
        <p className="text-gray-500">Underlying figures remain NSE/BSE/SEBI copyright. Review licence before opening to all users or offering CSV exports.</p>
        <p className="font-medium">Units: all money stored as Rs Crore (NUMERIC 20,4) in our database.</p>
      </section>
      <SourceAttribution />
    </div>
  )
}

