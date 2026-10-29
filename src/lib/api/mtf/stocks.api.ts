import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfStocksPage, MtfStockDetail, MtfStockFilters, MtfStockSnapshot } from '@/src/types/mtf'

export const stocksApi = {
  getStocks: (f?: MtfStockFilters) =>
    apiGet<MtfStocksPage>(MTF_ENDPOINTS.stocks, { params: f }).then(r => r.data),
  getStock: (isin: string) =>
    apiGet<MtfStockDetail>(MTF_ENDPOINTS.stock(isin)).then(r => r.data),
  getStockHistory: (isin: string, p?: { from?: string; to?: string }) =>
    apiGet<{ items: MtfStockSnapshot[]; history_since: string; as_of: string; source: string }>(
      MTF_ENDPOINTS.stockHistory(isin), { params: p }).then(r => r.data),
  getExportUrl: (f?: object) => {
    const qs = new URLSearchParams(f as Record<string, string>).toString()
    return `${MTF_ENDPOINTS.stocksExport}${qs ? `?${qs}` : ''}`
  },
}
