import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfBrokerCp, MtfBrokerCpSeries, MtfCpHolder, MtfAmcAllocation, MaturityWallBucket, CostVsRepoPoint } from '@/src/types/mtf'

export const fundingApi = {
  getCpOutstanding: () =>
    apiGet<{ items: MtfBrokerCp[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingCpOutstanding).then(r => r.data),
  getCpOutstandingSeries: (p?: { broker_id?: string }) =>
    apiGet<{ items: MtfBrokerCpSeries[]; as_of: string; source: string }>(MTF_ENDPOINTS.fundingCpOutstandingSeries, { params: p }).then(r => r.data),
  getMaturityWall: () =>
    apiGet<{ buckets: MaturityWallBucket[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingCpMaturityWall).then(r => r.data),
  getCostVsRepo: (p?: { broker_id?: string }) =>
    apiGet<{ items: CostVsRepoPoint[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingCpCostVsRepo, { params: p }).then(r => r.data),
  getHolders: (p?: { cadence?: 'M' | 'F'; broker_id?: string }) =>
    apiGet<{ items: MtfCpHolder[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingHolders, { params: p }).then(r => r.data),
  getAmcAllocation: (p?: { cadence?: 'M' | 'F' }) =>
    apiGet<{ items: MtfAmcAllocation[]; as_of: string; source: string; disclaimer: string }>(MTF_ENDPOINTS.fundingAmcAllocation, { params: p }).then(r => r.data),
}
