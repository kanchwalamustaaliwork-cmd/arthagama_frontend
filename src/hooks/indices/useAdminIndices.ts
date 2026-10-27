/**
 * src/hooks/indices/useAdminIndices.ts
 *
 * Hook for Admin Index Management: listing, filtering, sorting, and CRUD operations.
 */

import { useState, useEffect, useCallback } from 'react'
import {
    IndexWithPerformance,
    IndexStatus,
    CreateIndexRequest,
    UpdateIndexRequest,
    ArthagamaIndex,
    IndexQueryParams,
} from '@/src/types/indices'
import {
    getAdminIndices,
    createAdminIndex,
    updateAdminIndex,
    deleteAdminIndex,
} from '@/src/lib/api/indices/indices.api'
import { indexStore } from '@/src/mocks/indices/index-store'

export function useAdminIndices(enabled = true) {
    const [indices, setIndices] = useState<IndexWithPerformance[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<IndexStatus | 'ALL'>('ALL')
    const [sectorFilter, setSectorFilter] = useState('ALL')
    const [sortBy, setSortBy] = useState<IndexQueryParams['sortBy']>('name')
    const [sortOrder, setSortOrder] = useState<IndexQueryParams['sortOrder']>('asc')

    const fetchIndices = useCallback(async () => {
        if (!enabled) return
        try {
            setLoading(true)
            setError(null)
            const data = await getAdminIndices({
                search,
                status: statusFilter,
                sector: sectorFilter,
                sortBy,
                sortOrder,
            })
            setIndices(data)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch admin indices')
        } finally {
            setLoading(false)
        }
    }, [enabled, search, statusFilter, sectorFilter, sortBy, sortOrder])

    useEffect(() => {
        fetchIndices()
        const unsubscribe = indexStore.subscribe(() => {
            fetchIndices()
        })
        return () => unsubscribe()
    }, [fetchIndices])

    const handleCreate = async (payload: CreateIndexRequest): Promise<ArthagamaIndex> => {
        const created = await createAdminIndex(payload)
        await fetchIndices()
        return created
    }

    const handleUpdate = async (indexId: number, payload: UpdateIndexRequest): Promise<ArthagamaIndex> => {
        const updated = await updateAdminIndex(indexId, payload)
        await fetchIndices()
        return updated
    }

    const handleDelete = async (indexId: number): Promise<boolean> => {
        const success = await deleteAdminIndex(indexId)
        await fetchIndices()
        return success
    }

    const handleToggleStatus = async (index: ArthagamaIndex) => {
        const newStatus: IndexStatus = index.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        return handleUpdate(index.indexId, { status: newStatus })
    }

    return {
        indices,
        loading,
        error,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        sectorFilter,
        setSectorFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        createIndex: handleCreate,
        updateIndex: handleUpdate,
        deleteIndex: handleDelete,
        toggleStatus: handleToggleStatus,
        refetch: fetchIndices,
    }
}
