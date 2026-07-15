import { useCallback, useEffect, useState } from 'react'
import type { AdminLog, PaginatedResponse } from '@/src/types/admin'
import { fetchStrategyLogs, type FetchLogsParams } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error'

export function useStrategyLogs(strategyId: string) {
    const [response, setResponse] = useState<PaginatedResponse<AdminLog> | null>(null)
    const [status, setStatus] = useState<Status>('loading')
    const [search, setSearch] = useState('')
    const [eventType, setEventType] = useState('all')
    const [logStatus, setLogStatus] = useState('all')
    const [page, setPage] = useState(1)

    const load = useCallback(() => {
        if (!strategyId) return
        setStatus('loading')
        const params: FetchLogsParams = { page, pageSize: 10, search, eventType, status: logStatus }
        fetchStrategyLogs(strategyId, params)
            .then(data => { setResponse(data); setStatus('ready') })
            .catch(() => setStatus('error'))
    }, [strategyId, page, search, eventType, logStatus])

    useEffect(() => { setPage(1) }, [search, eventType, logStatus])
    useEffect(() => { load() }, [load])

    return {
        logs: response?.data ?? [],
        total: response?.total ?? 0,
        hasMore: response?.hasMore ?? false,
        status,
        page,
        setPage,
        search,
        setSearch,
        eventType,
        setEventType,
        logStatus,
        setLogStatus,
        retry: load,
    }
}
