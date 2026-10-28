'use client'
import React from 'react'
import Link from 'next/link'
import type { MtfStockSnapshot } from '@/src/types/mtf'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'

interface MtfStocksTableProps {
  items: MtfStockSnapshot[]
  loading?: boolean
}

export function MtfStocksTable({ items, loading }: MtfStocksTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/75 border-b text-xs font-semibold text-gray-500">
          <tr>
            <th className="text-left px-4 py-3">Security</th>
            <th className="text-left px-4 py-3">ISIN</th>
            <th className="text-right px-4 py-3">MTF Book</th>
            <th className="text-right px-4 py-3">Market Cap</th>
            <th className="text-right px-4 py-3">Leverage %</th>
            <th className="text-right px-4 py-3">30d Change</th>
            <th className="text-center px-4 py-3">Class</th>
            <th className="text-center px-4 py-3">Exch</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 w-20 rounded bg-gray-100" />
                  </td>
                ))}
              </tr>
            ))
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                No stocks match the selected screener filters.
              </td>
            </tr>
          ) : (
            items.map((row) => (
              <tr key={`${row.isin}-${row.exchange}`} className="hover:bg-purple-50/30 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">
                  <Link href={`/admin/mtf/stocks/${row.isin}`} className="hover:text-purple-600 transition-colors">
                    {row.symbol ?? row.isin}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{row.isin}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCr(row.book_cr)}</td>
                <td className="px-4 py-3 text-right text-gray-600">{formatCr(row.mcap_cr)}</td>
                <td className="px-4 py-3 text-right font-medium text-purple-700">{formatPct(row.leverage_pct)}</td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    (row.change_30d_pct ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {formatPct(row.change_30d_pct)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.asset_class === 'FNO'
                        ? 'bg-purple-100 text-purple-700'
                        : row.asset_class === 'ETF'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {row.asset_class ?? 'EQUITY'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-xs font-medium text-gray-500">{row.exchange}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

