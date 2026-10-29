import type { MtfStockSnapshot } from '@/src/types/mtf'

/**
 * Generate and download a CSV file purely in the browser from stock objects.
 * No backend CSV endpoint required.
 */
export function exportStocksToCsv(
  stocks: MtfStockSnapshot[],
  filename?: string
) {
  if (!stocks || stocks.length === 0) return

  const defaultName = `mtf_stocks_${new Date().toISOString().slice(0, 10)}.csv`

  const headers = [
    'Symbol',
    'ISIN',
    'Exchange',
    'Asset Class',
    'Book (₹ Cr)',
    'Mcap (₹ Cr)',
    'Free Float Mcap (₹ Cr)',
    'Leverage %',
    '30D Change %',
    'As Of Date',
  ]

  const rows = stocks.map((s) => [
    s.symbol ?? '',
    s.isin ?? '',
    s.exchange ?? '',
    s.asset_class ?? '',
    s.book_cr != null ? s.book_cr : '',
    s.mcap_cr != null ? s.mcap_cr : '',
    s.free_float_mcap_cr != null ? s.free_float_mcap_cr : '',
    s.leverage_pct != null ? s.leverage_pct : '',
    s.change_30d_pct != null ? s.change_30d_pct : '',
    s.snapshot_date ?? '',
  ])

  // Build CSV content with standard RFC 4180 escaping
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((field) => {
          const str = String(field ?? '')
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str
        })
        .join(',')
    ),
  ].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename || defaultName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

