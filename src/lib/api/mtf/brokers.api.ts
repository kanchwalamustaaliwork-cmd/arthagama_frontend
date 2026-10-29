import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { BrokerRankingResponse, BrokerHistoryResponse } from '@/src/types/mtf'

export const brokersApi = {
  getBrokers: () =>
    apiGet<BrokerRankingResponse>(MTF_ENDPOINTS.brokers).then(r => r.data),
  getBrokerHistory: (slug: string = 'all', p?: { from?: string; to?: string }) =>
    apiGet<BrokerHistoryResponse>(
      MTF_ENDPOINTS.brokerHistory(slug), { params: p }).then(r => r.data),
}
