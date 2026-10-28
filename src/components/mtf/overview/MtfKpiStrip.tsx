'use client';
import React from 'react';
import { useMtfSummary } from '@/src/hooks/mtf/useMtfOverview';
import { formatCr, formatPct } from '@/src/utils/mtf/formatters';

/** KPI strip showing NSE / BSE / Combined book + day change */
export function MtfKpiStrip() {
  const { data, loading: isLoading } = useMtfSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const tiles = [
    { label: 'Combined Book', value: formatCr(data?.combined_book_cr) },
    { label: 'NSE Book', value: formatCr(data?.nse_book_cr) },
    { label: 'BSE Book', value: formatCr(data?.bse_book_cr) },
    {
      label: 'Day Change',
      value: data?.day_change_cr
        ? `${formatCr(data.day_change_cr)} (${formatPct(data.day_change_pct)})`
        : '—',
      highlight: (data?.day_change_cr ?? 0) >= 0 ? 'text-green-600' : 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tiles.map(({ label, value, highlight }) => (
        <div key={label} className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-lg font-semibold mt-1 ${highlight ?? ''}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
