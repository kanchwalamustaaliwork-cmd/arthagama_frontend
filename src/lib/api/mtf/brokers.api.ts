import axios from 'axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfBrokerRankingResponse, MtfBrokerHistory } from '@/src/types/mtf'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? '' })

export const brokersApi = {
  getBrokers: () => api.get<MtfBrokerRankingResponse>(MTF_ENDPOINTS.brokers).then(r => r.data),
  getBrokerHistory: (slug: string, p?: { from?: string; to?: string }) =>
    api.get<{ items: MtfBrokerHistory[]; as_of: string; source: string }>(
      MTF_ENDPOINTS.brokerHistory(slug), { params: p }).then(r => r.data),
}
