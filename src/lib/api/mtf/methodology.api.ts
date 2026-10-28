import axios from 'axios'
import { MTF_ENDPOINTS } from './endpoints'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? '' })

export interface MtfDatasetStatus { dataset: string; last_as_of: string | null; last_ok_at: string | null; rows_loaded: number | null; status: string }
export interface MtfCoverageMatrix { amc: string; cadence: 'M' | 'F'; as_of: string; status: string; scheme_count: number | null; holding_count: number | null; aum_cr: number | null; reason: string | null }

export const methodologyApi = {
  getCoverage: () => api.get<{ items: MtfCoverageMatrix[]; as_of: string; source: string }>(MTF_ENDPOINTS.methodologyCoverage).then(r => r.data),
  getDatasets: () => api.get<{ items: MtfDatasetStatus[] }>(MTF_ENDPOINTS.methodologyDatasets).then(r => r.data),
}
