import axios from 'axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfStocksPage, MtfStockDetail, MtfStockFilters, MtfStockSnapshot } from '@/src/types/mtf'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? '' })

export const stocksApi = {
  getStocks: (f?: MtfStockFilters) =>
    api.get<MtfStocksPage>(MTF_ENDPOINTS.stocks, { params: f }).then(r => r.data),
  getStock: (isin: string) =>
    api.get<MtfStockDetail>(MTF_ENDPOINTS.stock(isin)).then(r => r.data),
  getStockHistory: (isin: string, p?: { from?: string; to?: string }) =>
    api.get<{ items: MtfStockSnapshot[]; history_since: string; as_of: string; source: string }>(
      MTF_ENDPOINTS.stockHistory(isin), { params: p }).then(r => r.data),
  getExportUrl: (f?: object) => {
    const qs = new URLSearchParams(f as Record<string, string>).toString()
    return `${MTF_ENDPOINTS.stocksExport}${qs ? `?${qs}` : ''}`
  },
}
