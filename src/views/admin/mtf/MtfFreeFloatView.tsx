'use client'
import React from 'react'
import { useFreefloatSeries, useMarketCapHistory } from '@/src/hooks/mtf/useMtfData'
import { BookVsFreeFloatChart } from '@/src/components/mtf/freefloat/BookVsFreeFloatChart'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'

export function MtfFreeFloatView() {
  const { data: demat, loading: dl } = useFreefloatSeries()
  const { data: mcap, loading: ml } = useMarketCapHistory()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Free Float & Demat Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">Beneficiary owner holdings, promoter proxy, and market cap series</p>
        </div>
        <AsOfBadge asOf={demat?.as_of} />
      </div>

      <BookVsFreeFloatChart demat={demat?.items ?? []} marketCap={mcap?.items ?? []} loading={dl || ml} />

      {/* Demat Historical Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-900">Monthly Demat BO Aggregate Holdings (CDSL + NSDL)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/75 border-b text-xs text-gray-500 font-medium">
              <tr>
                <th className="text-left px-4 py-2.5">Month</th>
                <th className="text-left px-4 py-2.5">Category</th>
                <th className="text-right px-4 py-2.5">Total Equity</th>
                <th className="text-right px-4 py-2.5">Promoter Proxy</th>
                <th className="text-right px-4 py-2.5">Free Float</th>
                <th className="text-right px-4 py-2.5">Free Float %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dl ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-2.5">
                        <div className="h-4 w-20 rounded bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                demat?.items.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{r.month}</td>
                    <td className="px-4 py-2.5 text-gray-600">{r.investor_category}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-900">{formatCr(r.total_equity_cr)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{formatCr(r.promoter_proxy_cr)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-purple-700">{formatCr(r.free_float_cr)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-700">{formatPct(r.free_float_pct)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SourceAttribution />
    </div>
  )
}
