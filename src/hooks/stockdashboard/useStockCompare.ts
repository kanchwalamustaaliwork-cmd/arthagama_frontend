/**
 * src/hooks/stockdashboard/useStockCompare.ts
 *
 * Hook for side-by-side stock comparison management.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { StockComparisonData } from '@/src/types/stockdashboard'
import { compareStocks, getCompareMetrics } from '@/src/lib/api/stockdashboard/compare.api'

export function useStockCompare(initialSymbols = ['RELIANCE', 'TCS', 'HDFCBANK']) {
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>(initialSymbols)
    const [comparisonData, setComparisonData] = useState<StockComparisonData[]>([])
    const [metricDefs, setMetricDefs] = useState<{ category: string; key: keyof StockComparisonData; label: string; unit: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load metrics definition
    useEffect(() => {
        getCompareMetrics().then(setMetricDefs)
    }, [])

    const fetchComparison = useCallback(async (symbols: string[]) => {
        if (symbols.length === 0) {
            setComparisonData([])
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)
        try {
            const data = await compareStocks(symbols)
            setComparisonData(data)
        } catch (err: any) {
            setError(err?.message || 'Failed to compare stocks')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchComparison(selectedSymbols)
    }, [fetchComparison, selectedSymbols])

    const addStock = (symbol: string) => {
        const upper = symbol.toUpperCase()
        if (selectedSymbols.length >= 4) return // Max 4 stocks for clean side-by-side comparison
        if (!selectedSymbols.includes(upper)) {
            setSelectedSymbols(prev => [...prev, upper])
        }
    }

    const removeStock = (symbol: string) => {
        const upper = symbol.toUpperCase()
        setSelectedSymbols(prev => prev.filter(s => s !== upper))
    }

    return {
        selectedSymbols,
        comparisonData,
        metricDefs,
        loading,
        error,
        addStock,
        removeStock,
    }
}
