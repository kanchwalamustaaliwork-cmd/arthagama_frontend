import { useCallback, useEffect, useRef, useState } from 'react'
import type { StrategyMetrics } from '@/src/types/admin'
import { getStrategyMetrics, recalculateStrategyMetrics } from '@/src/services/admin/adminApi'

export function useStrategyMetrics(strategyId: string) {
    const [metrics, setMetrics] = useState<StrategyMetrics | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [recalculating, setRecalculating] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const isMounted = useRef<boolean>(true)

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    const refresh = useCallback(async () => {
        if (!strategyId) return
        setLoading(true)
        setError(null)
        try {
            const data = await getStrategyMetrics(strategyId)
            if (isMounted.current) {
                setMetrics(data)
                setLastUpdated(new Date())
                setLoading(false)
            }
        } catch (err: unknown) {
            if (isMounted.current) {
                const message = err instanceof Error ? err.message : 'Failed to fetch strategy metrics'
                setError(message)
                setLoading(false)
            }
        }
    }, [strategyId])

    const recalculateAndRefresh = useCallback(async () => {
        if (!strategyId || recalculating) return
        setRecalculating(true)
        setError(null)
        try {
            await recalculateStrategyMetrics(strategyId)
            await refresh()
        } catch (err: unknown) {
            if (isMounted.current) {
                const message = err instanceof Error ? err.message : 'Failed to recalculate metrics'
                setError(message)
            }
        } finally {
            if (isMounted.current) {
                setRecalculating(false)
            }
        }
    }, [strategyId, recalculating, refresh])

    useEffect(() => {
        if (strategyId) {
            refresh()
        }
    }, [strategyId, refresh])

    return {
        metrics,
        loading,
        recalculating,
        error,
        refresh,
        recalculateAndRefresh,
        lastUpdated,
    }
}
