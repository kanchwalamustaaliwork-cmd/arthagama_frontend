'use client'

import { useState, useEffect } from 'react'
import { FutureContract } from '@/src/types/terminal'
import { instrumentsSdk } from '@/src/lib/terminal-sdk'

/**
 * Fetch futures contracts (Current / Next / Far) for a symbol.
 * Only fetches when enabled=true (lazy-load pattern matching useOptionChain).
 */
export function useFutures(
    symbol: string,
    exchange = 'NSE',
    enabled = true,
) {
    const [futures, setFutures] = useState<FutureContract[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled || !symbol) return

        let isMounted = true
        setLoading(true)
        setError(null)

        instrumentsSdk
            .getFutures(symbol, exchange)
            .then((data) => {
                if (isMounted) {
                    setFutures(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load futures')
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [symbol, exchange, enabled])

    return { futures, loading, error }
}
