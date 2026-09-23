/**
 * src/types/admin.ts
 *
 * All TypeScript types for the Admin Panel domain.
 * These mirror the expected backend API response shapes exactly.
 * When real endpoints are connected, only the service layer changes.
 *
 * Strategy domain hierarchy:
 *   StrategyType — canonical enum (INDEX_EQUITY | FUTURES | OPTIONS)
 *   StrategyCapabilities — which feature tabs are supported by a strategy
 *   AdminStrategy — common strategy metadata (includes strategyType + capabilities)
 */

// ─── Customer ─────────────────────────────────────────────────────────────────

export type CustomerStatus = 'active' | 'inactive' | 'suspended'

export interface AdminCustomer {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    status: CustomerStatus
    registeredAt: string       // ISO-8601
    lastActiveAt: string       // ISO-8601 or relative string
    totalStrategies: number
    activeStrategies: number
    totalHoldings: number
    avatarInitials: string
}

// ─── Strategy Type (canonical enum) ──────────────────────────────────────────

/**
 * Canonical strategy type classifier.
 *
 * INDEX_EQUITY — direct stock/index strategies (previously called "Equity")
 * FUTURES      — futures/leveraged strategies
 * OPTIONS      — options/derivatives strategies
 *
 * The frontend must branch on ``strategyType`` instead of the legacy
 * ``category`` string wherever type-specific behaviour is needed.
 */
export type StrategyType = 'INDEX_EQUITY' | 'FUTURES' | 'OPTIONS'

// ─── Strategy Capabilities ────────────────────────────────────────────────────

/**
 * Describes which feature tabs are available for a strategy.
 *
 * ``metrics`` and ``universe`` are always true (stored centrally).
 * ``logs``, ``holdings``, ``ltp``, ``trades`` depend on whether the relevant
 * MongoDB collection exists in the strategy's dedicated database.
 *
 * Fetched from GET /admin/strategies/{id}/capabilities.
 */
export interface StrategyCapabilities {
    logs: boolean
    holdings: boolean
    trades: boolean
    metrics: boolean    // always true — stored centrally
    universe: boolean   // true when strategy DB has a Universe/universe collection
}

export interface StrategyCapabilitiesResponse {
    strategyId: string
    capabilities: StrategyCapabilities
}

// ─── Strategy Metrics ─────────────────────────────────────────────────────────

export interface StrategyMetrics {
    id?: string
    strategyId: string
    createdAt?: string
    updatedAt?: string

    // Static Metrics (cached)
    totalPnL: number
    todayPnLRealized: number
    totalTrades: number
    winningTrades: number
    losingTrades: number
    winRate: number
    /** null when undefined: no initial capital, < 2 P&L days, or zero variance */
    sharpeRatio: number | null
    averageHoldingTime: number
    lastTradeTimestamp: string | null

    // Dynamic Metrics (live) — null when an open position has no live price
    // (e.g. option legs), or capital is unknown for totalReturn
    portfolioValue: number | null
    unrealizedPnL: number | null
    activeHoldings: number
    totalReturn: number | null
}

// ─── Strategy (Admin view) ────────────────────────────────────────────────────

export type AdminStrategyStatus = 'running' | 'paused' | 'draft' | 'archived' | 'error'

export interface AdminStrategy {
    id: string
    name: string
    description: string
    summary: string
    status: AdminStrategyStatus
    isActive: boolean

    /**
     * Canonical strategy type.
     * Use this for type-specific rendering and branching — not the raw ``category`` string.
     */
    strategyType: StrategyType

    /**
     * Legacy human-readable category string stored in metadata.
     * Prefer ``strategyType`` for programmatic use.
     * Kept for display in admin settings forms.
     */
    category: string // 'Options' | 'Futures' | 'Equity'

    /**
     * Internal database name — admin-only field for the settings tab.
     * Feature tabs must not use this to determine behaviour.
     * Feature availability is determined by ``capabilities``.
     */
    databaseName: string

    universeName: string
    universeType: 'default' | 'custom'
    instruments: string

    // Risk / Capital Configuration
    initialCapital?: number
    riskFreeRate?: number

    // Auditing / Ownership Info
    ownerAdminId: string
    ownerAdminName: string
    ownerAdminEmail: string

    createdByAdminId: string
    createdByAdminName: string
    createdByAdminEmail: string

    lastModifiedByAdminId: string
    lastModifiedByAdminName: string
    lastModifiedByAdminEmail: string

    assignedUserId: string | null

    createdAt: string          // ISO-8601
    updatedAt: string          // ISO-8601

    metrics?: StrategyMetrics

    /**
     * Per-strategy storage overrides for the normalisation layer.
     * Omitted when the strategy uses default collection/field aliases.
     * Shape: { "feature": { "collection_aliases": [...], "field_aliases": {...} } }
     */
    storageConfig?: Record<string, unknown>
}

// ─── Instrument ───────────────────────────────────────────────────────────────

export type InstrumentKind = 'EQUITY' | 'FUTURE' | 'OPTION'

/** Contract identity — identical in holdings and trades. */
export interface Instrument {
    kind: InstrumentKind
    symbol: string              // ticker or underlying as stored by the strategy
    key: string                 // stable contract id
    displayName: string         // e.g. "BSE-EQ", "NIFTY FUT", "NIFTY 23900 CE"
    strike: number | null
    right: 'CALL' | 'PUT' | null
    expiry: string | null       // YYYY-MM-DD; null when the source does not record it
}

// ─── Holding ──────────────────────────────────────────────────────────────────

/** One open position of any instrument kind (GET /{id}/holdings). */
export interface AdminHolding {
    id: string
    strategyId: string
    instrument: Instrument
    side: 'LONG' | 'SHORT'
    quantity: number
    initialQuantity: number | null
    avgPrice: number
    entryDate: string | null
    holdingDays: number | null
    /**
     * Key of the live record that prices this position — the contract identity
     * (ticker for equity, "BSESEN|OPTION|73600|PUT|2026-09-24" for an option leg).
     * null when the record does not identify the contract completely.
     */
    priceKey: string | null
    /** Data-quality flags, e.g. "expired_contract_still_open" */
    warnings: string[]
}

// ─── Trade ────────────────────────────────────────────────────────────────────

export type TradeSide = 'BUY' | 'SELL'

export interface AdminTradeLeg {
    instrument: Instrument
    side: TradeSide
    quantity: number | null
    price: number | null
}

export interface AdminTrade {
    id: string
    strategyId: string
    /** Display name(s) of the traded instrument(s) */
    stockSymbol: string
    stockName?: string
    instrument?: Instrument | null
    legs?: AdminTradeLeg[]
    /** True direction shared by all legs (an option ENTRY that wrote premium is SELL) */
    action: TradeSide | null
    effect?: 'OPEN' | 'CLOSE'
    /** Single-leg trades only; null for multi-leg or when the source omits it */
    quantity: number | null
    price: number | null
    totalValue: number | null
    timestamp: string // ISO date
    /** Realized P&L of closing trades */
    pnl?: number | null
    reason?: string | null
    status?: string | null
}

// ─── Live Universe & Market Data ──────────────────────────────────────────────

/**
 * One live row. `key` is the join key — it equals AdminHolding.priceKey of the
 * position it marks (the contract identity for derivatives, the ticker for
 * equity). `ticker` is the feed's own string, for display/search only.
 */
export interface LiveInstrumentItem {
    key: string
    ticker: string
    displayName: string
    kind: InstrumentKind
    side: 'LONG' | 'SHORT' | null
    inUniverse: boolean
    isHolding: boolean
    quantity: number
    avgPrice: number
    unrealizedPnl?: number | null
    /** Direction-aware: a short leg reads positive when the price falls */
    unrealizedPnlPct?: number | null
    latestPrice: number
    timestamp: string
}

/** UNIVERSE: constituents + positions + quotes. POSITIONS: open positions only (derivatives). */
export type LiveSource = 'UNIVERSE' | 'POSITIONS'

export interface LiveUniverseResponse {
    strategyId: string
    source: LiveSource
    universeName: string
    universeType: 'default' | 'custom' | string
    instrumentsRaw: string
    totalConstituents: number
    activeHoldingsCount: number
    watchingCount: number
    items: LiveInstrumentItem[]
    // Backward compatibility fields
    instruments?: string
    symbols?: string[]
    count?: number
}

export interface UniverseResponse {
    strategyId: string
    universeName: string
    universeType: 'default' | 'custom'
    instruments: string
    /** Flat list of symbol strings fetched from the strategy's Universe collection */
    symbols: string[]
    count: number
}

/** Live tick — sent over the WebSocket and keyed by `key` (see LiveInstrumentItem). */
export interface LTPRecord {
    key: string
    ticker: string
    displayName: string
    kind?: InstrumentKind
    side?: 'LONG' | 'SHORT' | null
    latestPrice: number
    timestamp: string
    isHolding: boolean
    pnl?: number | null
    pnlPercent?: number | null
    quantity?: number
    avgPrice?: number
}



export interface TradeQueryParams {
    page?: number
    pageSize?: number
    search?: string
    action?: 'all' | 'BUY' | 'SELL' | 'ENTRY' | 'EXIT'
    status?: 'all' | 'completed' | 'cancelled' | 'rejected'
}

// ─── Log ──────────────────────────────────────────────────────────────────────

export interface TerminalLogItem {
    id: string
    timestamp: string          // ISO-8601 or ISO string
    level: string              // e.g. INFO, WARNING, ERROR, DEBUG
    message: string
}

export interface TerminalLogPagination {
    page: number
    pageSize: number
    total: number
    hasNext: boolean
    hasPrevious: boolean
}

export interface TerminalLogResponse {
    items: TerminalLogItem[]
    pagination: TerminalLogPagination
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

export interface StrategyAnalysis {
    strategyId: string
    totalStocksBought: number
    totalStocksSold: number
    activeHoldings: number
    closedHoldings: number
    totalProfit: number
    totalLoss: number
    winRate: number            // 0-100
    avgHoldingPeriodDays: number
    bestPerformingStock: string
    worstPerformingStock: string
    mostTradedStock: string
    maxDrawdown: number        // percentage
    sharpeRatio: number | null
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface AdminPlatformStats {
    totalCustomers: number
    activeCustomers: number
    inactiveCustomers: number
    totalStrategies: number
    runningStrategies: number
    stoppedStrategies: number
    totalHoldings: number
    totalReports: number
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

// ─── Edit Strategy ────────────────────────────────────────────────────────────

export interface StrategyEditFormData {
    name: string
    description: string
    summary: string
    databaseName: string
    universeName: string
    universeType: 'default' | 'custom'
    instruments: string
    category: string // 'Options' | 'Futures' | 'Equity'
    initialCapital: number
    riskFreeRate: number
    isActive: boolean
    status: AdminStrategyStatus
    assignedUserId: string | null
}

// ─── Legacy Log types (Deprecated) ──────────────────────────────────────────

export type LogEventType = 'order_placed' | 'order_executed' | 'order_cancelled' | 'signal_generated' | 'strategy_started' | 'strategy_stopped' | 'error' | 'info'

export type LogStatus = 'success' | 'failed' | 'pending' | 'warning'

export interface AdminLog {
    id: string
    timestamp: string          // ISO-8601
    eventType: LogEventType
    description: string
    status: LogStatus
    strategyAction?: string
    strategyId: string
    metadata?: Record<string, unknown>
}
