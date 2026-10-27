/**
 * src/lib/api/indices/indices.api.ts
 *
 * Typed frontend mock API client functions for Arthagama Indices.
 * Unified search, filter, and sorting engine for both User and Admin.
 */

import {
    ArthagamaIndex,
    CreateIndexRequest,
    UpdateIndexRequest,
    IndexConstituent,
    IndexPerformanceSummary,
    IndexHistoryPoint,
    IndexPeriod,
    IndexQueryParams,
    IndexWithPerformance,
    IndexDetailPayload,
    Instrument,
} from '@/src/types/indices'
import { indexStore } from '@/src/mocks/indices/index-store'
import { getMockPerformanceSummary, generateMockHistoryPoints } from '@/src/mocks/indices/index-performance.mock'
import { searchMockInstruments } from '@/src/mocks/indices/instruments.mock'

// Simulated realistic asynchronous delay
const delay = (ms = 160) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * UNIFIED API: List indices for both User and Admin.
 *
 * Logic:
 * - Search: matches index name, sector, and symbol.
 * - Sector filter: filters by chosen sector or 'ALL'.
 * - Sort: sorts by best return based on days (1D), week (1W), month (1M),
 *         3M, 6M, 1Y, YTD, current value, or name.
 * - Difference:
 *   - Admin can view all statuses and filter by status ('ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ALL').
 *   - User only ever views active indices ('ACTIVE').
 */
export async function getIndices(
    params?: IndexQueryParams,
    options?: { isAdmin?: boolean }
): Promise<IndexWithPerformance[]> {
    await delay(140)

    const isAdmin = options?.isAdmin ?? false
    let list = indexStore.getIndicesWithPerformance(!isAdmin)

    // Status filter (admin only)
    if (isAdmin) {
        if (params?.status && params.status !== 'ALL') {
            list = list.filter(idx => idx.status === params.status)
        }
    } else {
        list = list.filter(idx => idx.status === 'ACTIVE')
    }

    // Search by index name, sector, or symbol
    if (params?.search) {
        const q = params.search.trim().toLowerCase()
        list = list.filter(
            idx =>
                idx.indexName.toLowerCase().includes(q) ||
                idx.sector.toLowerCase().includes(q) ||
                (idx.indexSymbol && idx.indexSymbol.toLowerCase().includes(q))
        )
    }

    // Sector filter
    if (params?.sector && params.sector !== 'ALL') {
        const targetSector = params.sector.toLowerCase()
        list = list.filter(idx => idx.sector.toLowerCase() === targetSector)
    }

    // Sorting by best return based on days, week, months, year, etc.
    if (params?.sortBy) {
        const isReturnSort = [
            'return1d',
            'return1w',
            'return1m',
            'return3m',
            'return6m',
            'return1y',
            'returnYtd',
            'currentValue',
            'constituents',
        ].includes(params.sortBy)

        // For return metrics, default to descending (best return first) unless specified
        const sortOrder = params.sortOrder || (isReturnSort ? 'desc' : 'asc')
        const mult = sortOrder === 'desc' ? -1 : 1

        list.sort((a, b) => {
            const pA = a.performance
            const pB = b.performance

            switch (params.sortBy) {
                case 'name':
                    return a.indexName.localeCompare(b.indexName) * mult
                case 'currentValue':
                    return ((pA?.currentValue ?? 0) - (pB?.currentValue ?? 0)) * mult
                case 'return1d':
                    return ((pA?.return1dPct ?? pA?.percentChange ?? 0) - (pB?.return1dPct ?? pB?.percentChange ?? 0)) * mult
                case 'return1w':
                    return ((pA?.return1wPct ?? 0) - (pB?.return1wPct ?? 0)) * mult
                case 'return1m':
                    return ((pA?.return1mPct ?? 0) - (pB?.return1mPct ?? 0)) * mult
                case 'return3m':
                    return ((pA?.return3mPct ?? 0) - (pB?.return3mPct ?? 0)) * mult
                case 'return6m':
                    return ((pA?.return6mPct ?? 0) - (pB?.return6mPct ?? 0)) * mult
                case 'return1y':
                    return ((pA?.return1yPct ?? 0) - (pB?.return1yPct ?? 0)) * mult
                case 'returnYtd':
                    return ((pA?.returnYtdPct ?? 0) - (pB?.returnYtdPct ?? 0)) * mult
                case 'constituents':
                    return (a.constituentCount - b.constituentCount) * mult
                default:
                    return 0
            }
        })
    }

    return list
}

/**
 * USER API: Wrapper for user index listing
 */
export async function getActiveIndices(params?: IndexQueryParams): Promise<IndexWithPerformance[]> {
    return getIndices(params, { isAdmin: false })
}

/**
 * ADMIN API: Wrapper for admin index listing
 */
export async function getAdminIndices(params?: IndexQueryParams): Promise<IndexWithPerformance[]> {
    return getIndices(params, { isAdmin: true })
}

/**
 * USER API: Get distinct sectors with active indices
 */
export async function getActiveIndexSectors(): Promise<string[]> {
    await delay(80)
    return indexStore.getDistinctSectors(true)
}

/**
 * USER API: Get complete index detail payload (metadata + constituents + performance)
 */
export async function getIndexDetail(indexId: number): Promise<IndexDetailPayload | null> {
    await delay(150)
    const index = indexStore.getIndexById(indexId)
    if (!index) return null

    const constituents = indexStore.getConstituentsForIndex(indexId)
    const performance = getMockPerformanceSummary(indexId, index.baseValue, index.baseDate)

    return {
        index,
        constituents,
        performance,
    }
}

/**
 * USER API: Get index performance summary
 */
export async function getIndexPerformance(indexId: number): Promise<IndexPerformanceSummary | null> {
    await delay(100)
    const index = indexStore.getIndexById(indexId)
    if (!index) return null
    return getMockPerformanceSummary(indexId, index.baseValue, index.baseDate)
}

/**
 * USER API: Get historical points for index chart by period
 */
export async function getIndexHistory(
    indexId: number,
    period: IndexPeriod = '1M'
): Promise<IndexHistoryPoint[]> {
    await delay(140)
    const index = indexStore.getIndexById(indexId)
    const curVal = index ? getMockPerformanceSummary(indexId).currentValue : 1200
    return generateMockHistoryPoints(indexId, period, curVal)
}

/**
 * USER API: Get constituents of an index
 */
export async function getIndexConstituents(indexId: number): Promise<IndexConstituent[]> {
    await delay(120)
    return indexStore.getConstituentsForIndex(indexId)
}

/**
 * ADMIN API: Get an index by ID for viewing/editing
 */
export async function getAdminIndex(indexId: number): Promise<{
    index: ArthagamaIndex
    constituents: IndexConstituent[]
} | null> {
    await delay(120)
    const index = indexStore.getIndexById(indexId)
    if (!index) return null
    const constituents = indexStore.getConstituentsForIndex(indexId)
    return { index, constituents }
}

/**
 * ADMIN API: Create a new index in mock state
 */
export async function createAdminIndex(payload: CreateIndexRequest): Promise<ArthagamaIndex> {
    await delay(200)
    return indexStore.createIndex(payload)
}

/**
 * ADMIN API: Update an existing index
 */
export async function updateAdminIndex(
    indexId: number,
    payload: UpdateIndexRequest
): Promise<ArthagamaIndex> {
    await delay(180)
    return indexStore.updateIndex(indexId, payload)
}

/**
 * ADMIN API: Delete an index and its constituent relations
 */
export async function deleteAdminIndex(indexId: number): Promise<boolean> {
    await delay(160)
    return indexStore.deleteIndex(indexId)
}

/**
 * SHARED API: Search instrument catalogue
 */
export async function searchInstruments(query: string): Promise<Instrument[]> {
    await delay(80)
    return searchMockInstruments(query)
}
