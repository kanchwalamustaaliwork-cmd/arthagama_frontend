/**
 * src/hooks/indices/useIndices.ts
 *
 * Hook for browsing active indices on the User Dashboard.
 */

import { useState, useEffect, useCallback } from 'react'
import { IndexWithPerformance, IndexQueryParams } from '@/src/types/indices'
import { getActiveIndices, getActiveIndexSectors } from '@/src/lib/api/indices/indices.api'
import { indexStore } from '@/src/mocks/indices/index-store'

export function useIndices(initialParams?: IndexQueryParams, enabled = true) {
    const [indices, setIndices] = useState<IndexWithPerformance[]>([])
    const [sectors, setSectors] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState(initialParams?.search || '')
    const [selectedSector, setSelectedSector] = useState(initialParams?.sector || 'ALL')
    const [sortBy, setSortBy] = useState<IndexQueryParams['sortBy']>(initialParams?.sortBy || 'name')
    const [sortOrder, setSortOrder] = useState<IndexQueryParams['sortOrder']>(initialParams?.sortOrder || 'asc')

    const fetchIndices = useCallback(async () => {
        if (!enabled) return
        try {
            setLoading(true)
            setError(null)
            const [indicesData, sectorsData] = await Promise.all([
                getActiveIndices({
                    search,
                    sector: selectedSector,
                    sortBy,
                    sortOrder,
                }),
                getActiveIndexSectors(),
            ])
            setIndices(indicesData)
            setSectors(sectorsData)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load indices')
        } finally {
            setLoading(false)
        }
    }, [enabled, search, selectedSector, sortBy, sortOrder])

    useEffect(() => {
        fetchIndices()
        // Subscribe to store changes so user dashboard updates on admin CRUD
        const unsubscribe = indexStore.subscribe(() => {
            fetchIndices()
        })
        return () => unsubscribe()
    }, [fetchIndices])

    // Group active indices by sector
    const groupedIndices = sectors.reduce<Record<string, IndexWithPerformance[]>>((acc, sector) => {
        const sectorList = indices.filter(idx => idx.sector === sector)
        if (sectorList.length > 0) {
            acc[sector] = sectorList
        }
        return acc
    }, {})

    return {
        indices,
        groupedIndices,
        sectors,
        loading,
        error,
        search,
        setSearch,
        selectedSector,
        setSelectedSector,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        refetch: fetchIndices,
    }
}
