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
    AdminLog,
    StrategyAnalysis,
    AdminPlatformStats,
    PaginatedResponse,
    StrategyEditFormData,
    CustomerStatus,
    AdminStrategyStatus,
} from '@/src/types/admin'

import {
    ADMIN_PLATFORM_STATS,
    MOCK_CUSTOMERS,
    MOCK_ADMIN_STRATEGIES,
    MOCK_STRATEGY_HOLDINGS,
    MOCK_STRATEGY_LOGS,
    MOCK_STRATEGY_ANALYSIS,
} from '@/src/data/admin/admin-mock'

// Simulate network delay for realistic loading states
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// ─── Platform Stats ───────────────────────────────────────────────────────────

export async function fetchAdminStats(): Promise<AdminPlatformStats> {
    await delay()
    // TODO: return (await apiGet<AdminPlatformStats>('/admin/stats')).data
    return { ...ADMIN_PLATFORM_STATS }
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
}

export async function fetchAdminStrategies(params: FetchStrategiesParams = {}): Promise<PaginatedResponse<AdminStrategy>> {
    await delay()
    const { page = 1, pageSize = 20, search = '', status = 'all' } = params

    let filtered = [...MOCK_ADMIN_STRATEGIES]

    if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.assignedUserName.toLowerCase().includes(q)
        )
    }

    if (status !== 'all') {
        filtered = filtered.filter(s => s.status === status)
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    // TODO:
    // return (await apiGet<PaginatedResponse<AdminStrategy>>('/admin/strategies', { params })).data
    return { data, total, page, pageSize, hasMore: start + pageSize < total }
}

export async function fetchAdminStrategy(id: string): Promise<AdminStrategy | null> {
    await delay()
    // TODO: return (await apiGet<AdminStrategy>(`/admin/strategies/${id}`)).data
    return MOCK_ADMIN_STRATEGIES.find(s => s.id === id) ?? null
}

export async function updateStrategyStatus(id: string, action: 'start' | 'stop' | 'archive'): Promise<AdminStrategy> {
    await delay(300)
    const strategy = MOCK_ADMIN_STRATEGIES.find(s => s.id === id)
    if (!strategy) throw new Error('Strategy not found')
    const statusMap: Record<string, AdminStrategyStatus> = { start: 'running', stop: 'paused', archive: 'archived' }
    // TODO: return (await apiPatch<AdminStrategy>(`/admin/strategies/${id}/${action}`)).data
    return { ...strategy, status: statusMap[action] }
}

export async function updateStrategy(id: string, data: StrategyEditFormData): Promise<AdminStrategy> {
    await delay(400)
    const strategy = MOCK_ADMIN_STRATEGIES.find(s => s.id === id)
    if (!strategy) throw new Error('Strategy not found')
    // TODO: return (await apiPut<AdminStrategy>(`/admin/strategies/${id}`, data)).data
    return {
        ...strategy,
        name: data.name,
        description: data.description,
        version: data.version,
        instruments: data.instruments.split(',').map(i => i.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
    }
}

// ─── Holdings ─────────────────────────────────────────────────────────────────

export async function fetchStrategyHoldings(strategyId: string): Promise<AdminHolding[]> {
    await delay()
    // TODO: return (await apiGet<AdminHolding[]>(`/admin/strategies/${strategyId}/holdings`)).data
    return MOCK_STRATEGY_HOLDINGS.filter(h => h.strategyId === strategyId)
}

// ─── Logs ─────────────────────────────────────────────────────────────────────

export interface FetchLogsParams {
    page?: number
    pageSize?: number
    search?: string
    eventType?: string
    status?: string
}

export async function fetchStrategyLogs(strategyId: string, params: FetchLogsParams = {}): Promise<PaginatedResponse<AdminLog>> {
    await delay()
    const { page = 1, pageSize = 10, search = '', eventType = 'all', status = 'all' } = params

    let filtered = MOCK_STRATEGY_LOGS.filter(l => l.strategyId === strategyId)

    if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(l => l.description.toLowerCase().includes(q))
    }
    if (eventType !== 'all') filtered = filtered.filter(l => l.eventType === eventType)
    if (status !== 'all') filtered = filtered.filter(l => l.status === status)

    const total = filtered.length
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    // TODO:
    // return (await apiGet<PaginatedResponse<AdminLog>>(`/admin/strategies/${strategyId}/logs`, { params })).data
    return { data, total, page, pageSize, hasMore: start + pageSize < total }
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

export async function fetchStrategyAnalysis(strategyId: string): Promise<StrategyAnalysis> {
    await delay()
    // TODO: return (await apiGet<StrategyAnalysis>(`/admin/strategies/${strategyId}/analysis`)).data
    return { ...MOCK_STRATEGY_ANALYSIS, strategyId }
}
