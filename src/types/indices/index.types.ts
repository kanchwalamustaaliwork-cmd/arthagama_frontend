/**
 * src/types/indices/index.types.ts
 *
 * Core data models for Arthagama Indices and Constituents.
 */

export type InstrumentType = 'EQUITY' | 'INDEX' | 'FUTURE' | 'OPTION'

export interface Instrument {
    instrument_id: number
    exchange: string
    symbol: string
    name?: string
    sector?: string
    instrument_type: InstrumentType
    expiry_date: string | null
    strike_price: number | null
    option_type: 'CE' | 'PE' | null
    future_type: string | null
    lot_size: number | null
    created_at: string
}

export type IndexStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT'

export interface ArthagamaIndex {
    indexId: number
    indexName: string
    indexSymbol?: string | null
    sector: string
    description?: string | null
    baseDate: string
    baseValue: number
    status: IndexStatus
    createdAt: string
    updatedAt: string
    constituentCount: number
}

export interface IndexConstituent {
    indexId: number
    instrumentId: number
    weight?: number | null
    addedAt: string
    instrument: Instrument
}

export interface IndexConstituentInput {
    instrumentId: number
    weight?: number | null
}

export interface CreateIndexRequest {
    indexName: string
    indexSymbol?: string | null
    sector: string
    description?: string | null
    baseDate: string
    baseValue: number
    status: IndexStatus
    constituents: IndexConstituentInput[]
}

export type UpdateIndexRequest = Partial<CreateIndexRequest>
