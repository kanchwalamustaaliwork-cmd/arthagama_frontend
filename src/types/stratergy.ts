/**
 * src/types/stratergy.ts
 *
 * Canonical strategy domain types.
 * All field names are the normalised camelCase API contract — never strategy-specific
 * field names from MongoDB.  Components and hooks import from here, not from admin.ts.
 *
 * Re-exports the subset of admin.ts types that strategy feature components need
 * so there is a single stable import path for strategy-specific code.
 */

export type {
    StrategyType,
    StrategyCapabilities,
    StrategyCapabilitiesResponse,
    AdminStrategy,
    AdminStrategyStatus,
    AdminHolding,
    AdminTrade,
    UniverseResponse,
    LiveInstrumentItem,
    LiveUniverseResponse,
    LTPRecord,
    TerminalLogItem,
    TerminalLogPagination,
    TerminalLogResponse,
    StrategyMetrics,
} from './admin'

// Legacy Strategy interface used by StrategyCard and mock data
export interface Strategy {
    name: string
    description: string
}


// ---------------------------------------------------------------------------
// Feature-specific canonical types (not in admin.ts)
// ---------------------------------------------------------------------------

/** One item from the canonical universe list. */
export interface UniverseSymbol {
    symbol: string
    exchange?: string
    expiry?: string
    strike?: number
}

/** Canonical trade shape consumed by trade table components. */
export interface CanonicalTrade {
    id: string
    strategyId: string
    symbol: string
    side: 'BUY' | 'SELL' | string
    quantity: number
    price: number
    totalValue: number
    executedAt: string       // ISO-8601
    strike?: number
    optionType?: 'CALL' | 'PUT' | string
    pnl?: number
    status?: string
}