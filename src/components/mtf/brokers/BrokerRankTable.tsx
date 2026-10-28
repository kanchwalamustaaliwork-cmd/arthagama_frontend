'use client';
import React from 'react';
import type { MtfBrokerRanking } from '@/src/types/mtf';
import { formatCr, formatPct, MTF_BROKER_CAVEAT } from '@/src/utils/mtf/formatters';

interface BrokerRankTableProps {
  items: MtfBrokerRanking[];
  isLoading?: boolean;
}

/** Broker ranking table — always shows the 2021 NSE disclosure caveat. */
export function BrokerRankTable({ items, isLoading }: BrokerRankTableProps) {
  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  return (
    <div className="space-y-3">
      {/* REQUIRED caveat */}
      <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-md px-3 py-2">
        {MTF_BROKER_CAVEAT}
      </p>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-3 py-2">#</th>
              <th className="text-left px-3 py-2">Broker</th>
              <th className="text-right px-3 py-2">MTF Book</th>
              <th className="text-right px-3 py-2">Share</th>
              <th className="text-left px-3 py-2">As of</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.broker_id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-2 text-muted-foreground">{row.rank}</td>
                <td className="px-3 py-2 font-medium">{row.broker_name}</td>
                <td className="px-3 py-2 text-right">{formatCr(row.book_cr)}</td>
                <td className="px-3 py-2 text-right">{formatPct(row.share_pct)}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.as_of}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
