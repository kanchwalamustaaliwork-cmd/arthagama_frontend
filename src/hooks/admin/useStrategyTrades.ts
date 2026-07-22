import { useCallback, useEffect, useRef, useState } from 'react'
import type { AdminTrade, PaginatedResponse } from '@/src/types/admin'
import { fetchStrategyTrades } from '@/src/services/admin/adminApi'
import { useDebounce } from '@/src/hooks/useDebounce'

type Status = 'loading' | 'ready' | 'error'

export function useStrategyTrades(strategyId: string) {
    const [trades, setTrades] = useState<AdminTrade[]>([])
    const [total, setTotal] = useState(0)
    const [status, setStatus] = useState<Status>('loading')
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 400)
    const activeSearch = search === '' ? '' : debouncedSearch

    const [action, setAction] = useState<'all' | 'BUY' | 'SELL'>('all')
    const [tradeStatus, setTradeStatus] = useState<'all' | 'completed' | 'cancelled' | 'rejected'>('all')

    const requestVersionRef = useRef(0)

    const load = useCallback(() => {
        if (!strategyId) return
        const currentVersion = ++requestVersionRef.current
        setStatus('loading')
        fetchStrategyTrades(strategyId, {
            page,
            pageSize: 5,
            search: activeSearch,
            action,
            status: tradeStatus
        })
            .then((res: PaginatedResponse<AdminTrade>) => {
                if (currentVersion === requestVersionRef.current) {
                    setTrades(res.data)
                    setTotal(res.total)
                    setStatus('ready')
                }
            })
            .catch(() => {
                if (currentVersion === requestVersionRef.current) {
                    setStatus('error')
                }
            })
    }, [strategyId, page, activeSearch, action, tradeStatus])

    useEffect(() => {
        setPage(1)
    }, [activeSearch, action, tradeStatus])

    useEffect(() => {
        load()
    }, [load])

    return {
        trades,
        total,
        status,
        page,
        setPage,
        search,
        setSearch,
        action,
        setAction,
        tradeStatus,
        setTradeStatus,
        hasMore: page * 5 < total,
        retry: load,
    }
}
