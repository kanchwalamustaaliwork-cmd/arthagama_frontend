/**
 * src/hooks/stockdashboard/useStockSearch.ts
 *
 * Hook for stock search with debounce, cancellation of stale queries, and keyboard navigation.
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { StockIdentity, Exchange } from '@/src/types/stockdashboard'
import { searchStocks } from '@/src/lib/api/stockdashboard/stock-search.api'
import { useDebounce } from '@/src/hooks/useDebounce'

export function useStockSearch(initialExchange: Exchange | 'ALL' = 'ALL') {
    const [query, setQuery] = useState('')
    const [exchange, setExchange] = useState<Exchange | 'ALL'>(initialExchange)
    const [results, setResults] = useState<StockIdentity[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const debouncedQuery = useDebounce(query, 200)
    const activeReqRef = useRef<number>(0)

    useEffect(() => {
        const q = debouncedQuery.trim()
        if (!q) {
            setResults([])
            setLoading(false)
            setError(null)
            return
        }

        const requestId = ++activeReqRef.current
        setLoading(true)
        setError(null)

        searchStocks(q, exchange)
            .then(data => {
                if (requestId === activeReqRef.current) {
                    setResults(data)
                    setSelectedIndex(0)
                    setLoading(false)
                }
            })
            .catch(err => {
                if (requestId === activeReqRef.current) {
                    setError(err?.message || 'Failed to search stocks')
                    setLoading(false)
                }
            })
    }, [debouncedQuery, exchange])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, onSelect?: (item: StockIdentity) => void) => {
            if (results.length === 0) return

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(prev => (prev + 1) % results.length)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
            } else if (e.key === 'Enter') {
                e.preventDefault()
                if (results[selectedIndex] && onSelect) {
                    onSelect(results[selectedIndex])
                }
            }
        },
        [results, selectedIndex]
    )

    return {
        query,
        setQuery,
        exchange,
        setExchange,
        results,
        loading,
        error,
        selectedIndex,
        setSelectedIndex,
        handleKeyDown,
        clearSearch: () => {
            setQuery('')
            setResults([])
        },
    }
}
