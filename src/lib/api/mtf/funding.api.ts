import axios from 'axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfBrokerCp, MtfBrokerCpSeries, MtfCpHolder, MtfAmcAllocation, MaturityWallBucket, CostVsRepoPoint } from '@/src/types/mtf'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? '' })

export const fundingApi = {
  getCpOutstanding: () => api.get<{ items: MtfBrokerCp[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingCpOutstanding).then(r => r.data),
  getCpOutstandingSeries: (p?: { broker_id?: string }) => api.get<{ items: MtfBrokerCpSeries[]; as_of: string; source: string }>(MTF_ENDPOINTS.fundingCpOutstandingSeries, { params: p }).then(r => r.data),
  getMaturityWall: () => api.get<{ buckets: MaturityWallBucket[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingCpMaturityWall).then(r => r.data),
  getCostVsRepo: (p?: { broker_id?: string }) => api.get<{ items: CostVsRepoPoint[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingCpCostVsRepo, { params: p }).then(r => r.data),
  getHolders: (p?: { cadence?: 'M' | 'F'; broker_id?: string }) => api.get<{ items: MtfCpHolder[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingHolders, { params: p }).then(r => r.data),
  getAmcAllocation: (p?: { cadence?: 'M' | 'F' }) => api.get<{ items: MtfAmcAllocation[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingAmcAllocation, { params: p }).then(r => r.data),
}
