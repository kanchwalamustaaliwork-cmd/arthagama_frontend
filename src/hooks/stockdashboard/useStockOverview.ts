/**
 * src/hooks/stockdashboard/useStockOverview.ts
 *
 * Hook for stock profile, real-time quote, chart history, and valuation metrics.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { CompanyProfile, HistoricalCandle } from '@/src/types/stockdashboard'
import { getStockProfile, getStockChart } from '@/src/lib/api/stockdashboard/stock-overview.api'

export function useStockOverview(exchange: string, symbol: string) {
    const [profile, setProfile] = useState<CompanyProfile | null>(null)
    const [candles, setCandles] = useState<HistoricalCandle[]>([])
    const [range, setRange] = useState('1M')
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [loadingChart, setLoadingChart] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch profile
    useEffect(() => {
        let isCurrent = true
        setLoadingProfile(true)
        setError(null)

        getStockProfile(exchange, symbol)
            .then(data => {
                if (isCurrent) {
                    setProfile(data)
                    setLoadingProfile(false)
                }
            })
            .catch(err => {
                if (isCurrent) {
                    setError(err?.message || 'Failed to load stock profile')
                    setLoadingProfile(false)
                }
            })

        return () => { isCurrent = false }
    }, [exchange, symbol])

    // Fetch chart data based on active range
    const fetchChart = useCallback((selectedRange: string) => {
        setLoadingChart(true)
        getStockChart(exchange, symbol, selectedRange)
            .then(data => {
                setCandles(data)
                setLoadingChart(false)
            })
            .catch(() => {
                setLoadingChart(false)
            })
    }, [exchange, symbol])

    useEffect(() => {
        fetchChart(range)
    }, [fetchChart, range])

    return {
        profile,
        candles,
        range,
        setRange,
        loadingProfile,
        loadingChart,
        error,
    }
}
