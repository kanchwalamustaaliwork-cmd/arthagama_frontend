import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfSummary, MtfDailyTotal, MtfDailyFlow, MtfDailyBreadth, MtfBookComposition, MtfTradedValue, MtfOverviewResponse } from '@/src/types/mtf'

export const overviewApi = {
  getSummary: () =>
    apiGet<MtfSummary>(MTF_ENDPOINTS.overviewSummary).then(r => r.data),
  getTotals: (p?: { from?: string; to?: string; exchange?: string }) =>
    apiGet<MtfOverviewResponse<MtfDailyTotal>>(MTF_ENDPOINTS.overviewTotals, { params: p }).then(r => r.data),
  getFlow: (p?: { from?: string; to?: string }) =>
    apiGet<MtfOverviewResponse<MtfDailyFlow>>(MTF_ENDPOINTS.overviewFlow, { params: p }).then(r => r.data),
  getBreadth: (p?: { from?: string; to?: string }) =>
    apiGet<MtfOverviewResponse<MtfDailyBreadth>>(MTF_ENDPOINTS.overviewBreadth, { params: p }).then(r => r.data),
  getComposition: (p?: { from?: string; to?: string }) =>
    apiGet<MtfOverviewResponse<MtfBookComposition>>(MTF_ENDPOINTS.overviewComposition, { params: p }).then(r => r.data),
  getTradedValue: (p?: { from?: string; to?: string }) =>
    apiGet<MtfOverviewResponse<MtfTradedValue>>(MTF_ENDPOINTS.overviewTradedValue, { params: p }).then(r => r.data),
}
