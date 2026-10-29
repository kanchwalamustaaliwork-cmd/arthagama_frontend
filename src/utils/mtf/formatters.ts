// MTF formatters — display helpers for money, %, dates
// All internal values are stored as Rs Crore (NUMERIC 20,4).
// Backend (Python/Pydantic) serializes Decimal as strings → always coerce with toNum() before arithmetic.

/**
 * Coerce a backend Decimal (string) or number to a JS number.
 * Returns null for null / undefined / unparseable values.
 */
export function toNum(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return isFinite(n) ? n : null;
}

/**
 * Format a crore value for display — accepts Decimal strings from backend.
 * If value >= 100_000 cr, show as "X.XX L cr" (lakh crore).
 * Otherwise show as "X,XXX cr".
 */
export function formatCr(value: string | number | null | undefined): string {
  const n = toNum(value);
  if (n == null) return '—';
  if (Math.abs(n) >= 100_000) {
    return `${(n / 100_000).toFixed(2)} L cr`;
  }
  return `${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })} cr`;
}

/** Format crore value as a short label (for chart axes etc.) */
export function formatCrShort(value: string | number | null | undefined): string {
  const n = toNum(value);
  if (n == null) return '—';
  if (Math.abs(n) >= 100_000) return `${(n / 100_000).toFixed(1)}L`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

/** Format a percentage value: "12.34%" or "—" */
export function formatPct(value: string | number | null | undefined, decimals = 2): string {
  const n = toNum(value);
  if (n == null) return '—';
  return `${n.toFixed(decimals)}%`;
}

/** Format a date string "YYYY-MM-DD" as "28 Oct 2026" */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Format a date string as short "Oct 26" */
export function formatDateShort(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/** Standard attribution text */
export const MTF_ATTRIBUTION = 'MTF data via mtf.trading, from NSE/BSE disclosures';

/** Funding disclaimer */
export const MTF_FUNDING_DISCLAIMER =
  'These figures represent disclosed funding relationships only. ' +
  'The presence of a mutual-fund scheme here does not imply the fund invested exclusively in MTF-funded securities.';

/** Broker disclosure caveat */
export const MTF_BROKER_CAVEAT =
  'NSE stopped per-member MTF disclosure in 2021. ' +
  '"Share" here means share of the book that still reports, not of the whole market.';

/** Not-investment-advice footer */
export const MTF_NOT_ADVICE =
  'This page is for informational purposes only and does not constitute investment advice.';

/** Licence line */
export const MTF_LICENCE_LINE =
  'Compiled dataset: CC BY-SA 4.0 (ShareAlike). Underlying figures: NSE/BSE/SEBI copyright.';
