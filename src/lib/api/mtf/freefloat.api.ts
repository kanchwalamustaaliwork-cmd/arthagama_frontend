import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfDematHolding, MtfMarketCapHistory } from '@/src/types/mtf'

export const freefloatApi = {
  getSeries: () =>
    apiGet<{ items: MtfDematHolding[]; as_of: string; source: string }>(MTF_ENDPOINTS.freefloatSeries).then(r => r.data),
  getMarketCap: (p?: { from?: string; to?: string }) =>
    apiGet<{ items: MtfMarketCapHistory[]; as_of: string; source: string }>(MTF_ENDPOINTS.freefloatMarketCap, { params: p }).then(r => r.data),
}
