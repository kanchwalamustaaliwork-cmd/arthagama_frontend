'use client'
import React from 'react'
import { useMtfStock, useMtfStockHistory } from '@/src/hooks/mtf/useMtfStocks'
import { StockMtfCard } from '@/src/components/mtf/stocks/StockMtfCard'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { formatCr, formatPct, formatDate } from '@/src/utils/mtf/formatters'

interface Props {
  isin: string
}

export function MtfStockDetailView({ isin }: Props) {
  const { data: stock, loading } = useMtfStock(isin)
  const { data: history } = useMtfStockHistory(isin)

  if (loading) return <div className="h-64 rounded-xl border bg-white p-6 animate-pulse" />
  if (!stock) return <div className="p-8 text-center text-gray-500">Security not found.</div>

  const flags = stock.surveillance_flags
  const activeFlags = flags ? (['asm', 'gsm', 'esm', 'ibc', 'ban'] as const).filter((k) => flags[k]) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{stock.symbol ?? isin}</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">{stock.exchange}</span>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{isin}</p>
        </div>
        <AsOfBadge asOf={stock.snapshot_date} />
      </div>

      {/* Metrics Card Grid */}
      <StockMtfCard stock={stock} />

      {/* Surveillance Alerts Banner */}
      {activeFlags.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Active Surveillance Measure</span>
            {flags?.severity && <span className="text-xs text-rose-600">({flags.severity} severity)</span>}
          </div>
          <div className="flex gap-2 flex-wrap">
            {activeFlags.map((f) => (
              <span key={f} className="px-2.5 py-0.5 rounded-full bg-rose-200/80 text-xs font-semibold text-rose-900 uppercase">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stored Snapshot History */}
      {history && (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Historical MTF Book Track</h3>
            <span className="text-xs text-gray-400">History since {formatDate(history.history_since)}</span>
          </div>
          <p className="text-xs text-gray-500">
            Internal stored snapshot count: {history.items.length} sessions
          </p>
        </div>
      )}

      {/* Promoter Pledge History */}
      {stock.pledge_history && stock.pledge_history.length > 0 && (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-900">Promoter Pledge Disclosures</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50/75 border-b text-xs text-gray-500 font-medium">
              <tr>
                <th className="text-left px-4 py-2.5">Period</th>
                <th className="text-right px-4 py-2.5">Pledged %</th>
                <th className="text-right px-4 py-2.5">Pledged Shares</th>
                <th className="text-right px-4 py-2.5">Total Shares</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stock.pledge_history.map((p) => (
                <tr key={p.period} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-700">{p.period}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-rose-600">{formatPct(p.pledged_pct)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{p.pledged_shares?.toLocaleString() ?? '—'}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{p.total_shares?.toLocaleString() ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SourceAttribution />
    </div>
  )
}
