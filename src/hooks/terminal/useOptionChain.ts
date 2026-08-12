'use client'

import { useState, useEffect } from 'react'
import { Instrument, OptionChain, ContractRecord } from '@/src/types/terminal'
import { optionsSdk, instrumentsSdk } from '@/src/lib/terminal-sdk'

/** Configurable option chain auto-refresh interval (10 seconds default) */
export const OPTION_CHAIN_REFRESH_INTERVAL_MS = 10_000

/**
 * Hook for fetching option chain data (existing — unchanged signature).
 * Pass `enabled = false` to skip the API call entirely (lazy-loading).
 */
export function useOptionChain(instrument: Instrument, selectedExpiry?: string, enabled = true) {
    const [chain, setChain] = useState<OptionChain | null>(null)
    const [expiry, setExpiry] = useState<string>(selectedExpiry || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled) return

        let isMounted = true
        setLoading(true)
        setError(null)

        optionsSdk
            .getOptionChain(instrument, expiry || undefined)
            .then((data) => {
                if (isMounted) {
                    setChain(data)
                    if (!expiry && data.expiry) {
                        setExpiry(data.expiry)
                    }
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load option chain')
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [instrument.symbol, instrument.exchange, expiry, enabled])

    return { chain, expiry, setExpiry, loading, error }
}

/**
 * Hook for fetching option expiry dates from the instrument master.
 * Uses the new /options/{symbol}/expiries endpoint.
 */
export function useExpiries(symbol: string, exchange = 'NSE', enabled = true) {
    const [expiries, setExpiries] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled || !symbol) return

        let isMounted = true
        setLoading(true)
        setError(null)

        instrumentsSdk
            .getExpiries(symbol, exchange)
            .then((data) => {
                if (isMounted) {
                    setExpiries(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load expiries')
                    setLoading(false)
                }
            })

        return () => { isMounted = false }
    }, [symbol, exchange, enabled])

    return { expiries, loading, error }
}

/**
 * Hook for fetching option contracts for a given symbol + expiry.
 * Uses the new /options/{symbol}/contracts endpoint (token-aware).
 */
export function useContracts(
    symbol: string,
    expiry: string,
    exchange = 'NSE',
    enabled = true,
) {
    const [contracts, setContracts] = useState<ContractRecord[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled || !symbol || !expiry) return

        let isMounted = true
        setLoading(true)
        setError(null)

        instrumentsSdk
            .getContracts(symbol, expiry, exchange)
            .then((data) => {
                if (isMounted) {
                    setContracts(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load contracts')
                    setLoading(false)
                }
            })

        return () => { isMounted = false }
    }, [symbol, expiry, exchange, enabled])

    return { contracts, loading, error }
}
