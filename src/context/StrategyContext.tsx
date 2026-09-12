'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { AdminStrategy, StrategyEditFormData, LTPRecord, LiveInstrumentItem, LiveUniverseResponse } from '@/src/types/admin'
import { useAdminStrategy } from '@/src/hooks/admin/useAdminStrategy'
import { useStrategyLiveUniverse, type LiveUniverseStatus } from '@/src/hooks/admin/useStrategyLiveUniverse'

export interface StrategyContextType {
    strategyId: string
    strategy: AdminStrategy | null
    status: 'loading' | 'ready' | 'error' | 'not_found'
    saving: boolean
    handleStatusChange: (action: 'start' | 'stop' | 'archive') => Promise<void>
    handleToggleActive: () => Promise<void>
    handleDelete: () => Promise<boolean>
    handleSave: (data: StrategyEditFormData) => Promise<boolean>
    retry: () => void

    // ── Live Universe (single shared WebSocket) ───────────────────────────────
    /** All universe instruments with live prices — used by Live Universe tab */
    liveItems: LiveInstrumentItem[]
    /** Raw snapshot from the REST endpoint — universe metadata */
    liveUniverse: LiveUniverseResponse | null
    /** WebSocket connection status */
    liveUniverseStatus: LiveUniverseStatus
    /** LTPRecord-keyed map (ticker → record) — used by HoldingsTable & LTP tab */
    ltpRecords: Record<string, LTPRecord>
    /** Top performing active holding */
    maxGainer: LTPRecord | null
    /** Worst performing active holding */
    maxLoser: LTPRecord | null
    /** Count helpers */
    totalConstituents: number
    activeHoldingsCount: number
    watchingCount: number
    /** Force a WS reconnect */
    retryLiveUniverse: () => void
}

const StrategyContext = createContext<StrategyContextType | null>(null)

export function StrategyProvider({ strategyId, children }: { strategyId: string; children: ReactNode }) {
    const adminStrategyState = useAdminStrategy(strategyId)
    const {
        universe: liveUniverse,
        items: liveItems,
        status: liveUniverseStatus,
        ltpRecords,
        maxGainer,
        maxLoser,
        totalConstituents,
        activeHoldingsCount,
        watchingCount,
        retry: retryLiveUniverse,
    } = useStrategyLiveUniverse(strategyId)

    return (
        <StrategyContext.Provider
            value={{
                strategyId,
                ...adminStrategyState,
                liveItems,
                liveUniverse,
                liveUniverseStatus,
                ltpRecords,
                maxGainer,
                maxLoser,
                totalConstituents,
                activeHoldingsCount,
                watchingCount,
                retryLiveUniverse,
            }}
        >
            {children}
        </StrategyContext.Provider>
    )
}

export function useStrategyContext(): StrategyContextType {
    const context = useContext(StrategyContext)
    if (!context) {
        throw new Error('useStrategyContext must be used within a StrategyProvider')
    }
    return context
}
