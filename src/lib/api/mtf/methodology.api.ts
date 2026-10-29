import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'

export interface MtfDatasetStatus {
  dataset: string
  last_as_of?: string | null
  last_ok_at?: string | null
  last_sha256?: string | null
  rows_loaded?: number | null
  rows_upserted?: number | null
  status?: string | null
  finished_at?: string | null
  error?: string | null
}

export interface MtfCoverageMatrix {
  amc: string
  cadence: 'M' | 'F'
  as_of: string
  status: string
  scheme_count: number | null
  holding_count: number | null
  aum_cr: number | null
  reason: string | null
  source_url?: string | null
}

export interface MtfDatasetResponse {
  datasets?: MtfDatasetStatus[]
  items?: MtfDatasetStatus[]
  registered?: string[]
  attribution?: string
  licence?: string
}

export interface MtfCoverageResponse {
  items: MtfCoverageMatrix[]
  as_of?: string
  cadence?: string
  source?: string
  note?: string
}

export const methodologyApi = {
  getCoverage: () =>
    apiGet<MtfCoverageResponse>(MTF_ENDPOINTS.methodologyCoverage).then(r => r.data),
  getDatasets: () =>
    apiGet<MtfDatasetResponse>(MTF_ENDPOINTS.methodologyDatasets).then(r => r.data),
}
