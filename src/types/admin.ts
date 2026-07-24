/**
 * src/types/admin.ts
 *
 * All TypeScript types for the Admin Panel domain.
 * These mirror the expected backend API response shapes exactly.
 * When real endpoints are connected, only the service layer changes.
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

// ─── Strategy Metrics ─────────────────────────────────────────────────────────

export interface StrategyMetrics {
    id: string
    strategyId: string
    totalReturn: number
    totalPnL: number
    todayPnL: number
    activeHoldings: number
    winRate: number
    sharpeRatio: number
    averageHoldingTime: number
    lastTradeTimestamp: string | null
    createdAt: string
    updatedAt: string
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
    databaseName: string
    universeName: string
    universeType: 'default' | 'custom'
    instruments: string
    category: string // 'Options' | 'Futures' | 'Equity'

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
}

// ─── Holding ──────────────────────────────────────────────────────────────────

export interface RawHolding {
    symbol: string
    quantity: number
    avg_buy_price: number
    STOPLOSS_TYPE: string | null
    first_exit: boolean
    initial_quantity: number
    buying_date: string
    strategy_id: string
}

export type AdminHolding = RawHolding

// ─── Trade ────────────────────────────────────────────────────────────────────

export interface AdminTrade {
    id: string
    strategyId: string
    stockSymbol: string
    stockName: string
    action: 'BUY' | 'SELL'
    quantity: number
    price: number
    totalValue: number
    timestamp: string // ISO date
    pnl?: number // only for SELL trades
    status: 'completed' | 'cancelled' | 'rejected'
}

// ─── Universe ─────────────────────────────────────────────────────────────────

export interface UniverseResponse {
    strategyId: string
    universeName: string
    universeType: 'default' | 'custom'
    instruments: string
}

export interface LTPRecord {
    ticker: string
    latestPrice: number
    timestamp: string
    isHolding: boolean
}

export interface TradeQueryParams {
    page?: number
    pageSize?: number
    search?: string
    action?: 'all' | 'BUY' | 'SELL'
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
    sharpeRatio: number
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

