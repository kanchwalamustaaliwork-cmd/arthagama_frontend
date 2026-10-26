/**
 * src/hooks/stockdashboard/useStockEarnings.ts
 *
 * Hook for quarterly and annual earnings results, dividends, and corporate actions.
 */

'use client'

import { useState, useEffect } from 'react'
import { EarningsData } from '@/src/types/stockdashboard'
import { getEarnings } from '@/src/lib/api/stockdashboard/earnings.api'

export function useStockEarnings(exchange: string, symbol: string) {
    const [data, setData] = useState<EarningsData | null>(null)
    const [resultsPeriod, setResultsPeriod] = useState<'Quarterly' | 'Annual'>('Quarterly')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isCurrent = true
        setLoading(true)
        setError(null)

        getEarnings(exchange, symbol)
            .then(res => {
                if (isCurrent) {
                    setData(res)
                    setLoading(false)
                }
            })
            .catch(err => {
                if (isCurrent) {
                    setError(err?.message || 'Failed to load earnings results')
                    setLoading(false)
                }
            })

        return () => { isCurrent = false }
    }, [exchange, symbol])

    return {
        data,
        resultsPeriod,
        setResultsPeriod,
        loading,
        error,
    }
}
