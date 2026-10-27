/**
 * src/mocks/indices/instruments.mock.ts
 *
 * Instrument catalogue for Arthagama Index constituents.
 * Reuses symbols and data from master instruments mock with stable numeric instrument_id.
 */

import { Instrument } from '@/src/types/indices'
import { MOCK_INSTRUMENTS } from '@/src/mocks/stockdashboard/instruments.mock'

// Assign stable numeric IDs starting at 501
export const MOCK_INDEX_INSTRUMENTS: Instrument[] = [
    ...MOCK_INSTRUMENTS.map((stock, idx) => ({
        instrument_id: 501 + idx,
        exchange: stock.exchange,
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        instrument_type: 'EQUITY' as const,
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    })),
    // Extra instruments to enrich sector representation
    {
        instrument_id: 520,
        exchange: 'NSE',
        symbol: 'WIPRO',
        name: 'Wipro Limited',
        sector: 'Information Technology',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 521,
        exchange: 'NSE',
        symbol: 'TECHM',
        name: 'Tech Mahindra Ltd.',
        sector: 'Information Technology',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 522,
        exchange: 'NSE',
        symbol: 'KOTAKBANK',
        name: 'Kotak Mahindra Bank Ltd.',
        sector: 'Banking',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 523,
        exchange: 'NSE',
        symbol: 'AXISBANK',
        name: 'Axis Bank Ltd.',
        sector: 'Banking',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 524,
        exchange: 'NSE',
        symbol: 'HINDUNILVR',
        name: 'Hindustan Unilever Ltd.',
        sector: 'FMCG',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 525,
        exchange: 'NSE',
        symbol: 'NESTLEIND',
        name: 'Nestle India Ltd.',
        sector: 'FMCG',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 526,
        exchange: 'NSE',
        symbol: 'MARUTI',
        name: 'Maruti Suzuki India Ltd.',
        sector: 'Automobiles',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 527,
        exchange: 'NSE',
        symbol: 'NTPC',
        name: 'NTPC Limited',
        sector: 'Energy',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 528,
        exchange: 'NSE',
        symbol: 'DRREDDY',
        name: "Dr. Reddy's Laboratories",
        sector: 'Healthcare',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
    {
        instrument_id: 529,
        exchange: 'NSE',
        symbol: 'CIPLA',
        name: 'Cipla Limited',
        sector: 'Healthcare',
        instrument_type: 'EQUITY',
        expiry_date: null,
        strike_price: null,
        option_type: null,
        future_type: null,
        lot_size: 1,
        created_at: '2025-01-01T09:15:00+05:30',
    },
]

export function searchMockInstruments(query: string): Instrument[] {
    const q = query.trim().toLowerCase()
    if (!q) return MOCK_INDEX_INSTRUMENTS.slice(0, 10)
    return MOCK_INDEX_INSTRUMENTS.filter(
        inst =>
            inst.symbol.toLowerCase().includes(q) ||
            (inst.name && inst.name.toLowerCase().includes(q)) ||
            (inst.sector && inst.sector.toLowerCase().includes(q))
    )
}

export function getInstrumentById(instrumentId: number): Instrument | undefined {
    return MOCK_INDEX_INSTRUMENTS.find(inst => inst.instrument_id === instrumentId)
}
