/**
 * src/services/admin/adminApi.ts
 *
 * Admin API service — currently returns mock data.
 * When backend endpoints are ready, replace each function body with the
 * corresponding apiGet / apiPost / apiPut / apiDelete call.
 *
 * All function signatures are already designed for real API responses:
 *   - async / await pattern
 *   - typed return values matching src/types/admin.ts
 *   - params objects for filtering / pagination
 *
 * NO CHANGES TO HOOKS OR VIEWS ARE REQUIRED after connecting real APIs.
 */

import type {
    AdminCustomer,
    AdminStrategy,
    AdminHolding,
    TerminalLogItem,
    TerminalLogResponse,
    StrategyAnalysis,
    AdminPlatformStats,
    PaginatedResponse,
    StrategyEditFormData,
    CustomerStatus,
    AdminStrategyStatus,
    AdminTrade,
    UniverseResponse,
    TradeQueryParams,
    StrategyMetrics,
} from '@/src/types/admin'

import {
    apiGet,
    apiPost,
    apiPut,
    apiPatch,
    apiDelete,
} from '@/src/api/axios'

import {
    ADMIN_PLATFORM_STATS,
    MOCK_CUSTOMERS,
    MOCK_ADMIN_STRATEGIES,
    MOCK_STRATEGY_HOLDINGS,
    MOCK_STRATEGY_LOGS,
    MOCK_STRATEGY_ANALYSIS,
    MOCK_STRATEGY_TRADES,
} from '@/src/data/admin/admin-mock'

// Simulate network delay for realistic loading states
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

export async function fetchAdminStats(): Promise<AdminPlatformStats> {
    try {
        const response = await apiGet<AdminPlatformStats>('/admin/stats')
        return response.data
    } catch {
        try {
            const res = await fetchAdminStrategies({ page: 1, pageSize: 100 })
            const totalStrategies = res.total
            const runningStrategies = res.data.filter(s => s.status === 'running').length
            const stoppedStrategies = res.data.filter(s => s.status === 'paused' || s.status === 'draft').length
            return {
                ...ADMIN_PLATFORM_STATS,
                totalStrategies,
                runningStrategies,
                stoppedStrategies,
            }
        } catch {
            return { ...ADMIN_PLATFORM_STATS }
        }
    }
}

// ─── Customers ────────────────────────────────────────────────────────────────

export interface FetchCustomersParams {
    page?: number
    pageSize?: number
    search?: string
    status?: CustomerStatus | 'all'
    sortBy?: keyof AdminCustomer
    sortDir?: 'asc' | 'desc'
}

export async function fetchCustomers(params: FetchCustomersParams = {}): Promise<PaginatedResponse<AdminCustomer>> {
    await delay()
    const { page = 1, pageSize = 10, search = '', status = 'all' } = params

    let filtered = [...MOCK_CUSTOMERS]

    if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(c =>
            c.firstName.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        )
    }

    if (status !== 'all') {
        filtered = filtered.filter(c => c.status === status)
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    // TODO:
    // return (await apiGet<PaginatedResponse<AdminCustomer>>('/admin/customers', { params })).data
    return { data, total, page, pageSize, hasMore: start + pageSize < total }
}

export async function fetchCustomer(id: string): Promise<AdminCustomer | null> {
    await delay()
    // TODO: return (await apiGet<AdminCustomer>(`/admin/customers/${id}`)).data
    return MOCK_CUSTOMERS.find(c => c.id === id) ?? null
}

export async function updateCustomerStatus(id: string, status: CustomerStatus): Promise<AdminCustomer> {
    await delay(200)
    // TODO: return (await apiPatch<AdminCustomer>(`/admin/customers/${id}/status`, { status })).data
    const customer = MOCK_CUSTOMERS.find(c => c.id === id)
    if (!customer) throw new Error('Customer not found')
    return { ...customer, status }
}

export async function deleteCustomer(id: string): Promise<void> {
    await delay(300)
    // TODO: await apiDelete(`/admin/customers/${id}`)
    console.log(`[Mock] Deleted customer ${id}`)
}

// ─── Strategies ───────────────────────────────────────────────────────────────

export interface FetchStrategiesParams {
    page?: number
    pageSize?: number
    search?: string
    status?: AdminStrategyStatus | 'all'
    isActive?: 'all' | 'active' | 'inactive'
    sortBy?: string
    category?: string
}

export async function fetchAdminStrategies(params: FetchStrategiesParams = {}): Promise<PaginatedResponse<AdminStrategy>> {
    const queryParams: Record<string, any> = {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.status,
        category: params.category,
    }
    if (params.isActive !== undefined && params.isActive !== 'all') {
        queryParams.isActive = params.isActive === 'active' ? 'true' : 'false'
        queryParams.is_active = params.isActive === 'active' ? 'true' : 'false'
    }
    if (params.sortBy) {
        queryParams.sortBy = params.sortBy
        queryParams.sort_by = params.sortBy
    }

    const response = await apiGet<PaginatedResponse<AdminStrategy>>('/admin/strategies', { params: queryParams })
    return response.data
}

export async function fetchAdminStrategy(id: string): Promise<AdminStrategy | null> {
    try {
        const response = await apiGet<AdminStrategy>(`/admin/strategies/${id}`)
        return response.data
    } catch {
        return null
    }
}

export async function updateStrategyStatus(id: string, action: 'start' | 'stop' | 'archive'): Promise<AdminStrategy> {
    const response = await apiPost<AdminStrategy>(`/admin/strategies/${id}/status`, { action })
    return response.data
}

export async function updateStrategy(id: string, data: StrategyEditFormData): Promise<AdminStrategy> {
    const response = await apiPut<AdminStrategy>(`/admin/strategies/${id}`, data)
    return response.data
}

export async function createStrategy(data: StrategyEditFormData): Promise<AdminStrategy> {
    const response = await apiPost<AdminStrategy>('/admin/strategies', data)
    return response.data
}

export async function deleteStrategy(id: string): Promise<void> {
    await apiDelete(`/admin/strategies/${id}`)
}

export async function toggleStrategyActive(id: string): Promise<AdminStrategy> {
    const response = await apiPost<AdminStrategy>(`/admin/strategies/${id}/toggle-active`)
    return response.data
}

export async function fetchStrategyTrades(strategyId: string, params: TradeQueryParams = {}): Promise<PaginatedResponse<AdminTrade>> {
    const response = await apiGet<PaginatedResponse<AdminTrade>>(`/admin/strategies/${strategyId}/trades`, {
        params: {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
            action: params.action,
            status: params.status,
        }
    })
    return response.data
}

export async function fetchStrategyUniverse(strategyId: string): Promise<UniverseResponse> {
    const response = await apiGet<UniverseResponse>(`/admin/strategies/${strategyId}/universe`)
    return response.data
}

// ─── Holdings ─────────────────────────────────────────────────────────────────

export async function fetchStrategyHoldings(strategyId: string): Promise<AdminHolding[]> {
    const response = await apiGet<AdminHolding[]>(`/admin/strategies/${strategyId}/holdings`)
    return response.data
}

// ─── Logs ─────────────────────────────────────────────────────────────────────

export interface FetchLogsParams {
    page?: number
    pageSize?: number
    search?: string
    eventType?: string
    status?: string
}

export async function fetchStrategyLogs(strategyId: string, params: FetchLogsParams = {}): Promise<TerminalLogResponse> {
    const response = await apiGet<TerminalLogResponse>(`/admin/strategies/${strategyId}/logs`, {
        params: {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
            eventType: params.eventType,
            status: params.status,
        }
    })
    return response.data
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

export async function fetchStrategyAnalysis(strategyId: string): Promise<StrategyAnalysis> {
    try {
        const response = await apiGet<StrategyAnalysis>(`/admin/strategies/${strategyId}/analysis`)
        return response.data
    } catch {
        // Fallback to dynamic synthesis when Phase 2 backend is not yet ready
        const strategy = await fetchAdminStrategy(strategyId)
        if (!strategy) throw new Error('Strategy not found')

        const metrics = strategy.metrics || {
            totalReturn: 0,
            totalPnL: 0,
            todayPnL: 0,
            activeHoldings: 0,
            winRate: 0,
            sharpeRatio: 0,
            averageHoldingTime: 0,
        }

        return {
            strategyId,
            totalStocksBought: 0,
            totalStocksSold: 0,
            activeHoldings: metrics.activeHoldings,
            closedHoldings: 0,
            totalProfit: metrics.totalPnL > 0 ? metrics.totalPnL : 0,
            totalLoss: metrics.totalPnL < 0 ? Math.abs(metrics.totalPnL) : 0,
            winRate: metrics.winRate,
            avgHoldingPeriodDays: metrics.averageHoldingTime,
            bestPerformingStock: 'RELIANCE',
            worstPerformingStock: 'WIPRO',
            mostTradedStock: 'NIFTY50',
            maxDrawdown: 8.2,
            sharpeRatio: metrics.sharpeRatio,
        }
    }
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

export async function fetchStrategyMetrics(strategyId: string): Promise<StrategyMetrics> {
    const response = await apiGet<StrategyMetrics>(`/admin/strategies/${strategyId}/metrics`)
    return response.data
}

export async function updateStrategyMetrics(strategyId: string, data: Partial<StrategyMetrics>): Promise<StrategyMetrics> {
    const response = await apiPut<StrategyMetrics>(`/admin/strategies/${strategyId}/metrics`, data)
    return response.data
}

// ─── WebSocket Tickets ────────────────────────────────────────────────────────

export async function fetchStrategyWSTicket(strategyId: string): Promise<string> {
    const response = await apiPost<{ ticket: string }>(`/admin/strategies/${strategyId}/ltp/ws-ticket`)
    return response.data.ticket
}

