'use client'
import React from 'react'
import type { MtfCpHolder } from '@/src/types/mtf'
import { formatCr } from '@/src/utils/mtf/formatters'

interface CpHoldersTableProps {
  items: MtfCpHolder[]
  loading?: boolean
}

export function CpHoldersTable({ items, loading }: CpHoldersTableProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50/50">
        <h3 className="text-sm font-semibold text-gray-900">Mutual Fund Scheme Disclosed CP Holdings</h3>
        <p className="text-xs text-gray-400">Institutional schemes holding broker commercial paper</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/75 border-b text-xs text-gray-500 font-medium">
            <tr>
              <th className="text-left px-4 py-2.5">Asset Management Company</th>
              <th className="text-left px-4 py-2.5">Scheme Name</th>
              <th className="text-left px-4 py-2.5">Broker Issuer</th>
              <th className="text-left px-4 py-2.5">CP ISIN</th>
              <th className="text-right px-4 py-2.5">Holding Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-2.5">
                      <div className="h-4 w-24 rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No mutual fund CP holding disclosures available.
                </td>
              </tr>
            ) : (
              items.map((r, i) => (
                <tr key={`${r.cp_isin}-${r.scheme}-${i}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.amc}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.scheme}</td>
                  <td className="px-4 py-2.5 text-gray-700 font-medium">{r.broker_id ?? '—'}</td>
                  <td className="px-4 py-2.5 text-gray-400 font-mono text-xs">{r.cp_isin}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-900">{formatCr(r.amount_cr)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

