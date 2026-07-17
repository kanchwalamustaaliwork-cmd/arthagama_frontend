import { useCallback, useEffect, useState } from 'react'
import type { AdminTrade, PaginatedResponse } from '@/src/types/admin'
import { fetchStrategyTrades } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error'

export function useStrategyTrades(strategyId: string) {
    const [trades, setTrades] = useState<AdminTrade[]>([])
    const [total, setTotal] = useState(0)
    const [status, setStatus] = useState<Status>('loading')
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [action, setAction] = useState<'all' | 'BUY' | 'SELL'>('all')
    const [tradeStatus, setTradeStatus] = useState<'all' | 'completed' | 'cancelled' | 'rejected'>('all')

    const load = useCallback(() => {
        if (!strategyId) return
        setStatus('loading')
        fetchStrategyTrades(strategyId, {
            page,
            pageSize: 5,
            search,
            action,
            status: tradeStatus
        })
            .then((res: PaginatedResponse<AdminTrade>) => {
                setTrades(res.data)
                setTotal(res.total)
                setStatus('ready')
            })
            .catch(() => setStatus('error'))
    }, [strategyId, page, search, action, tradeStatus])

    useEffect(() => {
        setPage(1)
    }, [search, action, tradeStatus])

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
