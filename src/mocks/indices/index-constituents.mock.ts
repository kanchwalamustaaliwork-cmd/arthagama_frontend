/**
 * src/mocks/indices/index-constituents.mock.ts
 *
 * Mapping table of index constituents.
 */

import { IndexConstituent } from '@/src/types/indices'
import { getInstrumentById } from './instruments.mock'

interface MockConstituentRecord {
    indexId: number
    instrumentId: number
    weight: number
    addedAt: string
}

export const INITIAL_CONSTITUENT_RECORDS: MockConstituentRecord[] = [
    // 1001: IT Services (TCS: 502, INFY: 504, WIPRO: 520, TECHM: 521)
    { indexId: 1001, instrumentId: 502, weight: 35.0, addedAt: '2024-01-10T09:15:00Z' },
    { indexId: 1001, instrumentId: 504, weight: 30.0, addedAt: '2024-01-10T09:15:00Z' },
    { indexId: 1001, instrumentId: 520, weight: 20.0, addedAt: '2024-01-10T09:15:00Z' },
    { indexId: 1001, instrumentId: 521, weight: 15.0, addedAt: '2024-01-10T09:15:00Z' },

    // 1002: Banking Leaders (HDFCBANK: 503, ICICIBANK: 505, SBIN: 512, KOTAKBANK: 522)
    { indexId: 1002, instrumentId: 503, weight: 35.0, addedAt: '2024-01-10T09:15:00Z' },
    { indexId: 1002, instrumentId: 505, weight: 30.0, addedAt: '2024-01-10T09:15:00Z' },
    { indexId: 1002, instrumentId: 512, weight: 20.0, addedAt: '2024-01-10T09:15:00Z' },
    { indexId: 1002, instrumentId: 522, weight: 15.0, addedAt: '2024-01-10T09:15:00Z' },

    // 1003: FMCG (ITC: 509, HINDUNILVR: 524, NESTLEIND: 525)
    { indexId: 1003, instrumentId: 509, weight: 40.0, addedAt: '2024-01-15T09:15:00Z' },
    { indexId: 1003, instrumentId: 524, weight: 35.0, addedAt: '2024-01-15T09:15:00Z' },
    { indexId: 1003, instrumentId: 525, weight: 25.0, addedAt: '2024-01-15T09:15:00Z' },

    // 1004: Automobiles (TATAMOTORS: 507, MARUTI: 526)
    { indexId: 1004, instrumentId: 507, weight: 55.0, addedAt: '2024-02-01T09:15:00Z' },
    { indexId: 1004, instrumentId: 526, weight: 45.0, addedAt: '2024-02-01T09:15:00Z' },

    // 1005: Energy (RELIANCE: 501, NTPC: 527)
    { indexId: 1005, instrumentId: 501, weight: 65.0, addedAt: '2024-02-15T09:15:00Z' },
    { indexId: 1005, instrumentId: 527, weight: 35.0, addedAt: '2024-02-15T09:15:00Z' },

    // 1006: Healthcare (SUNPHARMA: 508, DRREDDY: 528, CIPLA: 529)
    { indexId: 1006, instrumentId: 508, weight: 45.0, addedAt: '2024-03-01T09:15:00Z' },
    { indexId: 1006, instrumentId: 528, weight: 30.0, addedAt: '2024-03-01T09:15:00Z' },
    { indexId: 1006, instrumentId: 529, weight: 25.0, addedAt: '2024-03-01T09:15:00Z' },

    // 1007: Industrials (LT: 511)
    { indexId: 1007, instrumentId: 511, weight: 100.0, addedAt: '2024-03-10T09:15:00Z' },

    // 1008: Telecommunications (BHARTIARTL: 510)
    { indexId: 1008, instrumentId: 510, weight: 100.0, addedAt: '2024-03-15T09:15:00Z' },

    // 1009: Financial Services (BAJFINANCE: 506)
    { indexId: 1009, instrumentId: 506, weight: 100.0, addedAt: '2024-04-01T09:15:00Z' },
]

export function hydrateConstituents(records: MockConstituentRecord[]): IndexConstituent[] {
    const list: IndexConstituent[] = []
    for (const rec of records) {
        const inst = getInstrumentById(rec.instrumentId)
        if (inst) {
            list.push({
                indexId: rec.indexId,
                instrumentId: rec.instrumentId,
                weight: rec.weight,
                addedAt: rec.addedAt,
                instrument: inst,
            })
        }
    }
    return list
}
