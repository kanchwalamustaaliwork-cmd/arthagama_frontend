// MTF chart helpers
import type { MtfDailyTotal } from '@/src/types/mtf';

/** Convert daily totals to a time series usable by a line/area chart */
export function totalsToCombinedSeries(totals: MtfDailyTotal[]) {
  return totals
    .filter((t) => t.exchange === 'COMBINED')
    .map((t) => ({ date: t.trade_date, value: t.outstanding_cr ?? 0 }));
}

/** Aggregate composition data to stacked-bar chart format */
export function compositionToStackedSeries(
  data: { trade_date: string; asset_class: string; book_cr: number | null }[],
) {
  const map = new Map<string, Record<string, number>>();
  for (const row of data) {
    if (!map.has(row.trade_date)) map.set(row.trade_date, {});
    map.get(row.trade_date)![row.asset_class] = row.book_cr ?? 0;
  }
  return Array.from(map.entries()).map(([date, classes]) => ({ date, ...classes }));
}

/** Build chart-friendly series from a generic { date, value } array */
export function dateValueSeries<T extends { [k: string]: unknown }>(
  data: T[],
  dateKey: keyof T,
  valueKey: keyof T,
) {
  return data.map((row) => ({
    date: String(row[dateKey]),
    value: (row[valueKey] as number) ?? 0,
  }));
}
