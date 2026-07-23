'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { AdminStrategy, StrategyEditFormData } from '@/src/types/admin'
import { useAdminStrategy } from '@/src/hooks/admin/useAdminStrategy'

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
}

const StrategyContext = createContext<StrategyContextType | null>(null)

export function StrategyProvider({ strategyId, children }: { strategyId: string; children: ReactNode }) {
    const adminStrategyState = useAdminStrategy(strategyId)

    return (
        <StrategyContext.Provider value={{ strategyId, ...adminStrategyState }}>
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
