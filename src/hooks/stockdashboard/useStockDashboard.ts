/**
 * src/hooks/stockdashboard/useStockDashboard.ts
 *
 * Hook for main Stock Dashboard overview data.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardOverviewResponse } from '@/src/types/stockdashboard'
import { getDashboardOverview } from '@/src/lib/api/stockdashboard/dashboard.api'

export function useStockDashboard() {
    const [data, setData] = useState<DashboardOverviewResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOverview = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getDashboardOverview()
            setData(res)
        } catch (err: any) {
            setError(err?.message || 'Failed to load market dashboard')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchOverview()
    }, [fetchOverview])

    return { data, loading, error, refresh: fetchOverview }
}
