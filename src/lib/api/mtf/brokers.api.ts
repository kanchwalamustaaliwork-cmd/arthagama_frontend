import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfBrokerRankingResponse, MtfBrokerHistory } from '@/src/types/mtf'

export const brokersApi = {
  getBrokers: () =>
    apiGet<MtfBrokerRankingResponse>(MTF_ENDPOINTS.brokers).then(r => r.data),
  getBrokerHistory: (slug: string, p?: { from?: string; to?: string }) =>
    apiGet<{ items: MtfBrokerHistory[]; as_of: string; source: string }>(
      MTF_ENDPOINTS.brokerHistory(slug), { params: p }).then(r => r.data),
}
