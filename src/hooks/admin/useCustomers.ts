import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AdminCustomer, CustomerStatus, PaginatedResponse } from '@/src/types/admin'
import { fetchCustomers, updateCustomerStatus, deleteCustomer } from '@/src/services/admin/adminApi'
import { useDebounce } from '@/src/hooks/useDebounce'

type Status = 'loading' | 'ready' | 'error'

export function useCustomers() {
    const [response, setResponse] = useState<PaginatedResponse<AdminCustomer> | null>(null)
    const [status, setStatus] = useState<Status>('loading')
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 400)
    const activeSearch = search === '' ? '' : debouncedSearch

    const [filterStatus, setFilterStatus] = useState<CustomerStatus | 'all'>('all')
    const [page, setPage] = useState(1)

    // Optimistic local state for mutations
    const [localOverrides, setLocalOverrides] = useState<Record<string, Partial<AdminCustomer>>>({})
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

    const requestVersionRef = useRef(0)

    const load = useCallback(() => {
        const currentVersion = ++requestVersionRef.current
        setStatus('loading')
        fetchCustomers({ page, pageSize: 10, search: activeSearch, status: filterStatus })
            .then(data => {
                if (currentVersion === requestVersionRef.current) {
                    setResponse(data)
                    setStatus('ready')
                }
            })
            .catch(() => {
                if (currentVersion === requestVersionRef.current) {
                    setStatus('error')
                }
            })
    }, [page, activeSearch, filterStatus])

    useEffect(() => {
        // Reset to page 1 when filters or debounced search change
        setPage(1)
    }, [activeSearch, filterStatus])

    useEffect(() => { load() }, [load])

    // Merge local overrides for optimistic UI
    const customers = useMemo(() => {
        if (!response) return []
        return response.data
            .filter(c => !deletedIds.has(c.id))
            .map(c => ({ ...c, ...localOverrides[c.id] }))
    }, [response, localOverrides, deletedIds])

    const handleUpdateStatus = useCallback(async (id: string, newStatus: CustomerStatus) => {
        // Optimistic update
        setLocalOverrides(prev => ({ ...prev, [id]: { status: newStatus } }))
        try {
            await updateCustomerStatus(id, newStatus)
        } catch {
            // Rollback
            setLocalOverrides(prev => { const { [id]: _, ...rest } = prev; return rest })
        }
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        // Optimistic delete
        setDeletedIds(prev => new Set([...prev, id]))
        try {
            await deleteCustomer(id)
        } catch {
            // Rollback
            setDeletedIds(prev => { const s = new Set(prev); s.delete(id); return s })
        }
    }, [])

    return {
        customers,
        total: (response?.total ?? 0) - deletedIds.size,
        status,
        page,
        setPage,
        pageSize: 10,
        hasMore: response?.hasMore ?? false,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        handleUpdateStatus,
        handleDelete,
        retry: load,
    }
}
