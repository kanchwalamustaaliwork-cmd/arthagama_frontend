import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfStocksPage, MtfStockDetail, MtfStockFilters, MtfStockSnapshot } from '@/src/types/mtf'
import { exportStocksToCsv } from '@/src/utils/mtf/csv-export'

export const stocksApi = {
  getStocks: (f?: MtfStockFilters) =>
    apiGet<MtfStocksPage>(MTF_ENDPOINTS.stocks, { params: f }).then(r => r.data),
  getStock: (isin: string) =>
    apiGet<MtfStockDetail>(MTF_ENDPOINTS.stock(isin)).then(r => r.data),
  getStockHistory: (isin: string, p?: { from?: string; to?: string }) =>
    apiGet<{ items: MtfStockSnapshot[]; history_since: string; as_of: string; source: string }>(
      MTF_ENDPOINTS.stockHistory(isin), { params: p }).then(r => r.data),

  /**
   * Export all matching filtered stocks directly from frontend as CSV.
   * Fetches the matching items via standard JSON endpoint, then creates the CSV Blob in browser memory.
   */
  exportFromFrontend: async (filters: MtfStockFilters, total?: number) => {
    // If total count is known, request all matching items (up to 5,000)
    const fetchSize = total && total > 0 ? Math.min(total, 5000) : 1000
    const res = await stocksApi.getStocks({
      ...filters,
      page: 1,
      size: fetchSize,
    })
    exportStocksToCsv(res.items)
  },
}
