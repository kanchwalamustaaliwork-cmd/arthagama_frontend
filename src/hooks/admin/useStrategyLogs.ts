'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import type { TerminalLogItem } from '@/src/types/admin'
import { fetchStrategyLogs } from '@/src/services/admin/adminApi'
import { useDebounce } from '@/src/hooks/useDebounce'

export function useStrategyLogs(strategyId: string) {
    const [logs, setLogs] = useState<TerminalLogItem[]>([])
    const [pageRange, setPageRange] = useState({ start: 1, end: 1 })
    const [total, setTotal] = useState(0)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrevious, setHasPrevious] = useState(false)
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 400)
    const activeSearch = search === '' ? '' : debouncedSearch

    const [level, setLevel] = useState('all')

    const fetchingRef = useRef(false)
    const requestVersionRef = useRef(0)

    const loadPage = useCallback(async (pageNum: number, direction: 'append' | 'prepend' | 'reset') => {
        if (!strategyId || fetchingRef.current) return
        const currentVersion = ++requestVersionRef.current
        fetchingRef.current = true
        setStatus('loading')

        try {
            const res = await fetchStrategyLogs(strategyId, {
                page: pageNum,
                pageSize: 100,
                search: activeSearch,
                eventType: level,
                status: level,
            })

            if (currentVersion !== requestVersionRef.current) return

            const newItems = res.items
            const { total: totalCount, hasNext: nextExists, hasPrevious: prevExists } = res.pagination

            setTotal(totalCount)
            setHasNext(nextExists)
            setHasPrevious(prevExists)

            setLogs(prev => {
                if (direction === 'reset') {
                    setPageRange({ start: pageNum, end: pageNum })
                    return newItems
                }

                if (direction === 'append') {
                    const combined = [...prev, ...newItems]
                    const pageLimit = 6
                    if (combined.length > pageLimit * 100) {
                        setPageRange(r => ({ start: r.start + 1, end: pageNum }))
                        return combined.slice(100)
                    }
                    setPageRange(r => ({ ...r, end: pageNum }))
                    return combined
                }

                if (direction === 'prepend') {
                    const combined = [...newItems, ...prev]
                    const pageLimit = 6
                    if (combined.length > pageLimit * 100) {
                        setPageRange(r => ({ start: pageNum, end: r.end - 1 }))
                        return combined.slice(0, combined.length - 100)
                    }
                    setPageRange(r => ({ ...r, start: pageNum }))
                    return combined
                }

                return prev
            })
            setStatus('ready')
        } catch {
            if (currentVersion === requestVersionRef.current) {
                setStatus('error')
            }
        } finally {
            fetchingRef.current = false
        }
    }, [strategyId, activeSearch, level])

    // Load page 1 on filter/search change
    useEffect(() => {
        loadPage(1, 'reset')
    }, [strategyId, activeSearch, level])

    const loadNext = useCallback(() => {
        if (hasNext && status !== 'loading') {
            loadPage(pageRange.end + 1, 'append')
        }
    }, [hasNext, status, pageRange.end, loadPage])

    const loadPrevious = useCallback(() => {
        if (hasPrevious && status !== 'loading') {
            return loadPage(pageRange.start - 1, 'prepend')
        }
        return Promise.resolve()
    }, [hasPrevious, status, pageRange.start, loadPage])

    return {
        logs,
        total,
        hasNext,
        hasPrevious,
        status,
        search,
        setSearch,
        level,
        setLevel,
        loadNext,
        loadPrevious,
        retry: () => loadPage(pageRange.start, 'reset'),
    }
}
