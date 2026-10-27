/**
 * src/hooks/indices/useIndexPerformance.ts
 *
 * Hook for loading index history by period with lazy loading when chart is in viewport.
 */

import { useState, useEffect, useCallback } from 'react'
import { IndexHistoryPoint, IndexPeriod } from '@/src/types/indices'
import { getIndexHistory } from '@/src/lib/api/indices/indices.api'

export function useIndexPerformance(
    indexId: number,
    initialPeriod: IndexPeriod = '1M',
    enabled = true
) {
    const [period, setPeriod] = useState<IndexPeriod>(initialPeriod)
    const [history, setHistory] = useState<IndexHistoryPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchHistory = useCallback(async () => {
        if (!enabled || !indexId) return
        try {
            setLoading(true)
            setError(null)
            const points = await getIndexHistory(indexId, period)
            setHistory(points)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load historical data')
        } finally {
            setLoading(false)
        }
    }, [indexId, period, enabled])

    useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    return {
        period,
        setPeriod,
        history,
        loading,
        error,
        refetch: fetchHistory,
    }
}
