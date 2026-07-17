import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AdminStrategy, AdminStrategyStatus, PaginatedResponse } from '@/src/types/admin'
import { fetchAdminStrategies, updateStrategyStatus, toggleStrategyActive, deleteStrategy } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error'

export function useAdminStrategies() {
    const [response, setResponse] = useState<PaginatedResponse<AdminStrategy> | null>(null)
    const [status, setStatus] = useState<Status>('loading')
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<AdminStrategyStatus | 'all'>('all')
    const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
    const [sortBy, setSortBy] = useState<string>('')
    const [localOverrides, setLocalOverrides] = useState<Record<string, Partial<AdminStrategy>>>({})

    const load = useCallback(() => {
        setStatus('loading')
        fetchAdminStrategies({ search, status: filterStatus, isActive: filterActive, sortBy })
            .then(data => { setResponse(data); setStatus('ready') })
            .catch(() => setStatus('error'))
    }, [search, filterStatus, filterActive, sortBy])

    useEffect(() => { load() }, [load])

    const strategies = useMemo(() => {
        if (!response) return []
        return response.data.map(s => ({ ...s, ...localOverrides[s.id] }))
    }, [response, localOverrides])

    const handleStatusChange = useCallback(async (id: string, action: 'start' | 'stop' | 'archive') => {
        const statusMap: Record<string, AdminStrategyStatus> = { start: 'running', stop: 'paused', archive: 'archived' }
        setLocalOverrides(prev => ({ 
            ...prev, 
            [id]: { 
                status: statusMap[action],
                isActive: action === 'start' ? true : action === 'stop' ? false : prev[id]?.isActive 
            } 
        }))
        try {
            await updateStrategyStatus(id, action)
            load()
        } catch {
            setLocalOverrides(prev => { const { [id]: _, ...rest } = prev; return rest })
        }
    }, [load])

    const handleToggleActive = useCallback(async (id: string) => {
        const current = strategies.find(s => s.id === id)
        if (!current) return
        const targetActive = !current.isActive
        setLocalOverrides(prev => ({ 
            ...prev, 
            [id]: { 
                isActive: targetActive,
                status: targetActive ? 'running' : 'paused'
            } 
        }))
        try {
            await toggleStrategyActive(id)
            load()
        } catch {
            setLocalOverrides(prev => { const { [id]: _, ...rest } = prev; return rest })
        }
    }, [strategies, load])

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteStrategy(id)
            load()
            return true
        } catch {
            return false
        }
    }, [load])

    return {
        strategies,
        total: response?.total ?? 0,
        status,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        filterActive,
        setFilterActive,
        sortBy,
        setSortBy,
        handleStatusChange,
        handleToggleActive,
        handleDelete,
        retry: load,
    }
}

