'use client'
import React from 'react'
import type { MtfMover } from '@/src/types/mtf'
import { formatCr, formatPct } from '@/src/utils/mtf/formatters'

interface MoversTableProps {
  gainers: MtfMover[]
  losers: MtfMover[]
}

export function MoversTable({ gainers, losers }: MoversTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Biggest Gainers */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-emerald-50/50">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Top Book Build-Ups (Gainers)</h4>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50/75 border-b text-gray-500 font-medium">
            <tr>
              <th className="text-left px-3 py-2">Security</th>
              <th className="text-right px-3 py-2">MTF Book</th>
              <th className="text-right px-3 py-2">Change</th>
              <th className="text-right px-3 py-2">% Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {gainers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No gainers recorded.
                </td>
              </tr>
            ) : (
              gainers.map((m) => (
                <tr key={m.isin} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-semibold text-gray-800">{m.symbol ?? m.isin}</td>
                  <td className="px-3 py-2 text-right">{formatCr(m.book_cr)}</td>
                  <td className="px-3 py-2 text-right text-emerald-600 font-medium">+{formatCr(m.change_cr)}</td>
                  <td className="px-3 py-2 text-right text-emerald-600 font-bold">+{formatPct(m.change_pct)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Biggest Losers */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-rose-50/50">
          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">Top Liquidations (Unwinding)</h4>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50/75 border-b text-gray-500 font-medium">
            <tr>
              <th className="text-left px-3 py-2">Security</th>
              <th className="text-right px-3 py-2">MTF Book</th>
              <th className="text-right px-3 py-2">Change</th>
              <th className="text-right px-3 py-2">% Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {losers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No liquidations recorded.
                </td>
              </tr>
            ) : (
              losers.map((m) => (
                <tr key={m.isin} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-semibold text-gray-800">{m.symbol ?? m.isin}</td>
                  <td className="px-3 py-2 text-right">{formatCr(m.book_cr)}</td>
                  <td className="px-3 py-2 text-right text-rose-600 font-medium">{formatCr(m.change_cr)}</td>
                  <td className="px-3 py-2 text-right text-rose-600 font-bold">{formatPct(m.change_pct)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

