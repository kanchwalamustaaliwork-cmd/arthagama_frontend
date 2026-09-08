'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { LiveOptionChainResponse, ExpiryItem } from '@/src/types/terminal'
import { optionsSdk } from '@/src/lib/terminal-sdk'

interface UseLiveOptionChainOptions {
    symbol: string
    exchange?: string
    enabled?: boolean
    defaultStrikeCount?: number
}

export function useLiveOptionChain({
    symbol,
    exchange = 'NSE',
    enabled = false,
    defaultStrikeCount = 50,
}: UseLiveOptionChainOptions) {
    const [data, setData] = useState<LiveOptionChainResponse | null>(null)
    const [expiries, setExpiries] = useState<ExpiryItem[]>([])
    const [activeExpiry, setActiveExpiry] = useState<string>('')
    const [strikeCount, setStrikeCount] = useState<number>(defaultStrikeCount)
    const [loading, setLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const isFetchingRef = useRef<boolean>(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Reset state when symbol changes
    useEffect(() => {
        setData(null)
        setExpiries([])
        setActiveExpiry('')
        setError(null)
    }, [symbol, exchange])

    const fetchChain = useCallback(
        async (isInitial = false) => {
            if (!enabled || !symbol) return
            if (isFetchingRef.current) return // Prevent overlapping requests

            isFetchingRef.current = true
            if (isInitial) {
                setLoading(true)
            } else {
                setIsRefreshing(true)
            }

            // Create new AbortController
            const controller = new AbortController()
            abortControllerRef.current = controller

            try {
                const res = await optionsSdk.getLiveOptionChain(
                    symbol,
                    activeExpiry || undefined,
                    exchange,
                    strikeCount,
                    controller.signal
                )

                if (res.success) {
                    setData(res)
                    setError(null)
                    setLastUpdated(new Date())

                    // Populate expiries once or when underlying returns new expiries
                    if (res.expiries && res.expiries.length > 0) {
                        setExpiries((prev) => {
                            if (prev.length === 0 || prev.length !== res.expiries.length) {
                                return res.expiries
                            }
                            return prev
                        })

                        // Automatically select nearest expiry if none chosen
                        if (!activeExpiry && res.active_expiry) {
                            setActiveExpiry(res.active_expiry)
                        } else if (!activeExpiry && res.expiries[0]?.expiry) {
                            setActiveExpiry(res.expiries[0].expiry)
                        }
                    }
                } else {
                    setError(res.error || 'Failed to fetch live option chain from FYERS')
                }
            } catch (err: any) {
                if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
                    setError(err?.message || 'Error connecting to FYERS Option Chain API')
                }
            } finally {
                isFetchingRef.current = false
                setLoading(false)
                setIsRefreshing(false)
            }
        },
        [enabled, symbol, exchange, activeExpiry, strikeCount]
    )

    // Initial fetch whenever activeExpiry, strikeCount, or symbol changes
    useEffect(() => {
        if (!enabled) return
        fetchChain(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, symbol, exchange, activeExpiry, strikeCount])

    // Continuous 1-second live polling loop
    useEffect(() => {
        if (!enabled) {
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
                abortControllerRef.current = null
            }
            return
        }

        timerRef.current = setInterval(() => {
            fetchChain(false)
        }, 1000)

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
                abortControllerRef.current = null
            }
        }
    }, [enabled, fetchChain])

    return {
        data,
        expiries,
        activeExpiry,
        setActiveExpiry,
        strikeCount,
        setStrikeCount,
        loading,
        isRefreshing,
        error,
        lastUpdated,
        refetch: () => fetchChain(false),
    }
}
