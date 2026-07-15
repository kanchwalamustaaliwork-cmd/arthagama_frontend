import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AdminStrategy, AdminStrategyStatus, PaginatedResponse } from '@/src/types/admin'
import { fetchAdminStrategies, updateStrategyStatus } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error'

export function useAdminStrategies() {
    const [response, setResponse] = useState<PaginatedResponse<AdminStrategy> | null>(null)
    const [status, setStatus] = useState<Status>('loading')
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<AdminStrategyStatus | 'all'>('all')
    const [localOverrides, setLocalOverrides] = useState<Record<string, Partial<AdminStrategy>>>({})

    const load = useCallback(() => {
        setStatus('loading')
        fetchAdminStrategies({ search, status: filterStatus })
            .then(data => { setResponse(data); setStatus('ready') })
            .catch(() => setStatus('error'))
    }, [search, filterStatus])

    useEffect(() => { load() }, [load])

    const strategies = useMemo(() => {
        if (!response) return []
        return response.data.map(s => ({ ...s, ...localOverrides[s.id] }))
    }, [response, localOverrides])

    const handleStatusChange = useCallback(async (id: string, action: 'start' | 'stop' | 'archive') => {
        const statusMap: Record<string, AdminStrategyStatus> = { start: 'running', stop: 'paused', archive: 'archived' }
        setLocalOverrides(prev => ({ ...prev, [id]: { status: statusMap[action] } }))
        try {
            await updateStrategyStatus(id, action)
        } catch {
            setLocalOverrides(prev => { const { [id]: _, ...rest } = prev; return rest })
        }
    }, [])

    return {
        strategies,
        total: response?.total ?? 0,
        status,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        handleStatusChange,
        retry: load,
    }
}
