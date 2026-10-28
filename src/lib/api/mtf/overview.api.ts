import axios from 'axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfSummary, MtfDailyTotal, MtfDailyFlow, MtfDailyBreadth, MtfBookComposition, MtfTradedValue, MtfOverviewResponse } from '@/src/types/mtf'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? '' })

export const overviewApi = {
  getSummary: () => api.get<MtfSummary>(MTF_ENDPOINTS.overviewSummary).then(r => r.data),
  getTotals: (p?: { from?: string; to?: string; exchange?: string }) =>
    api.get<MtfOverviewResponse<MtfDailyTotal>>(MTF_ENDPOINTS.overviewTotals, { params: p }).then(r => r.data),
  getFlow: (p?: { from?: string; to?: string }) =>
    api.get<MtfOverviewResponse<MtfDailyFlow>>(MTF_ENDPOINTS.overviewFlow, { params: p }).then(r => r.data),
  getBreadth: (p?: { from?: string; to?: string }) =>
    api.get<MtfOverviewResponse<MtfDailyBreadth>>(MTF_ENDPOINTS.overviewBreadth, { params: p }).then(r => r.data),
  getComposition: (p?: { from?: string; to?: string }) =>
    api.get<MtfOverviewResponse<MtfBookComposition>>(MTF_ENDPOINTS.overviewComposition, { params: p }).then(r => r.data),
  getTradedValue: (p?: { from?: string; to?: string }) =>
    api.get<MtfOverviewResponse<MtfTradedValue>>(MTF_ENDPOINTS.overviewTradedValue, { params: p }).then(r => r.data),
}
