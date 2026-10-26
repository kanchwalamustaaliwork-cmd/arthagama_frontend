/**
 * src/hooks/stockdashboard/useStockFundamentals.ts
 *
 * Hook for stock fundamentals, multi-period financial statements, and ratios.
 */

'use client'

import { useState, useEffect } from 'react'
import { FundamentalsData } from '@/src/types/stockdashboard'
import { getFundamentals } from '@/src/lib/api/stockdashboard/fundamentals.api'

export type FinancialStatementType = 'income' | 'balance' | 'cashflow' | 'ratios' | 'shareholding'

export function useStockFundamentals(exchange: string, symbol: string) {
    const [data, setData] = useState<FundamentalsData | null>(null)
    const [activeTab, setActiveTab] = useState<FinancialStatementType>('income')
    const [periodType, setPeriodType] = useState<'Annual' | 'Quarterly'>('Annual')
    const [viewMode, setViewMode] = useState<'Consolidated' | 'Standalone'>('Consolidated')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isCurrent = true
        setLoading(true)
        setError(null)

        getFundamentals(exchange, symbol)
            .then(res => {
                if (isCurrent) {
                    setData(res)
                    setLoading(false)
                }
            })
            .catch(err => {
                if (isCurrent) {
                    setError(err?.message || 'Failed to load fundamentals data')
                    setLoading(false)
                }
            })

        return () => { isCurrent = false }
    }, [exchange, symbol])

    return {
        data,
        activeTab,
        setActiveTab,
        periodType,
        setPeriodType,
        viewMode,
        setViewMode,
        loading,
        error,
    }
}
