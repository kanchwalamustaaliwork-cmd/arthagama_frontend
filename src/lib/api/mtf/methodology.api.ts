import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'

export interface MtfDatasetStatus { dataset: string; last_as_of: string | null; last_ok_at: string | null; rows_loaded: number | null; status: string }
export interface MtfCoverageMatrix { amc: string; cadence: 'M' | 'F'; as_of: string; status: string; scheme_count: number | null; holding_count: number | null; aum_cr: number | null; reason: string | null }

export const methodologyApi = {
  getCoverage: () =>
    apiGet<{ items: MtfCoverageMatrix[]; as_of: string; source: string }>(MTF_ENDPOINTS.methodologyCoverage).then(r => r.data),
  getDatasets: () =>
    apiGet<{ items: MtfDatasetStatus[] }>(MTF_ENDPOINTS.methodologyDatasets).then(r => r.data),
}
