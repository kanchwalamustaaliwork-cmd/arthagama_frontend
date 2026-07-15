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

// ─── Strategy (Admin view) ────────────────────────────────────────────────────

export type AdminStrategyStatus = 'running' | 'paused' | 'draft' | 'archived'

export interface AdminStrategy {
    id: string
    name: string
    description: string
    status: AdminStrategyStatus
    version: string
    createdAt: string          // ISO-8601
    updatedAt: string          // ISO-8601
    assignedUserId: string
    assignedUserName: string
    assignedUserEmail: string
    holdingsCount: number
    totalBuyOrders: number
    totalSellOrders: number
    openPositions: number
    closedPositions: number
    totalProfit: number
    totalLoss: number
    instruments: string[]
}

// ─── Holding ──────────────────────────────────────────────────────────────────

export type HoldingStatus = 'open' | 'closed' | 'partial'

export interface AdminHolding {
    id: string
    stockSymbol: string
    stockName: string
    quantity: number
    avgBuyPrice: number
    currentStatus: HoldingStatus
    buyDate: string            // ISO-8601
    sellDate?: string          // ISO-8601 if closed
    holdingDurationDays: number
    strategyId: string
}

// ─── Log ──────────────────────────────────────────────────────────────────────

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
    version: string
    instruments: string         // comma-separated
    entryRules: string
    exitRules: string
    positionSizePct: string
    stopLossPct: string
    targetPct: string
    indicators: string
    riskSettings: string
}
