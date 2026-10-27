/**
 * src/types/indices/index-api.types.ts
 *
 * Query parameters and API payload shapes for Indices endpoints.
 */

import { ArthagamaIndex, IndexConstituent, IndexStatus } from './index.types'
import { IndexPerformanceSummary } from './index-performance.types'

export type IndexSortBy =
    | 'name'
    | 'currentValue'
    | 'return1d'
    | 'return1w'
    | 'return1m'
    | 'return3m'
    | 'return6m'
    | 'return1y'
    | 'returnYtd'
    | 'constituents'

export interface IndexQueryParams {
    search?: string
    sector?: string
    status?: IndexStatus | 'ALL'
    sortBy?: IndexSortBy
    sortOrder?: 'asc' | 'desc'
}

export interface IndexWithPerformance extends ArthagamaIndex {
    performance?: IndexPerformanceSummary
    sparkline?: number[]
}

export interface IndexDetailPayload {
    index: ArthagamaIndex
    constituents: IndexConstituent[]
    performance: IndexPerformanceSummary
}
