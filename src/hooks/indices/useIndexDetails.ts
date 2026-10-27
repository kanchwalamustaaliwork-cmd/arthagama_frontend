/**
 * src/hooks/indices/useIndexDetails.ts
 *
 * Hook for loading index detail and constituents.
 */

import { useState, useEffect, useCallback } from 'react'
import { IndexDetailPayload } from '@/src/types/indices'
import { getIndexDetail } from '@/src/lib/api/indices/indices.api'
import { indexStore } from '@/src/mocks/indices/index-store'

export function useIndexDetails(indexId: number, enabled = true) {
    const [data, setData] = useState<IndexDetailPayload | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDetail = useCallback(async () => {
        if (!enabled || !indexId) return
        try {
            setLoading(true)
            setError(null)
            const result = await getIndexDetail(indexId)
            if (!result) {
                setError('Index not found')
            } else {
                setData(result)
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load index details')
        } finally {
            setLoading(false)
        }
    }, [indexId, enabled])

    useEffect(() => {
        fetchDetail()
        const unsubscribe = indexStore.subscribe(() => {
            fetchDetail()
        })
        return () => unsubscribe()
    }, [fetchDetail])

    return {
        data,
        index: data?.index,
        constituents: data?.constituents || [],
        performance: data?.performance,
        loading,
        error,
        refetch: fetchDetail,
    }
}
