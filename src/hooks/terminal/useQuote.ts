'use client'

import { useState, useEffect } from 'react'
import { Instrument, Quote } from '@/src/types/terminal'
import { marketSdk } from '@/src/lib/terminal-sdk'

export function useQuote(instrument: Instrument, pollIntervalMs = 15000) {
    const [quote, setQuote] = useState<Quote | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Stable identity key — always constant size, same logic as useOHLCV.
    const instrumentKey = [
        instrument.symbol,
        instrument.exchange,
        instrument.token ?? '',
        instrument.type,
        String(instrument.strike ?? ''),
        instrument.optionType ?? '',
        instrument.expiry ?? instrument.contractExpiry ?? '',
    ].join('|')

    useEffect(() => {
        let isMounted = true
        setLoading(true)
        setError(null)

        const fetchQuote = () => {
            marketSdk
                .getQuote(instrument)
                .then((data) => {
                    if (isMounted) {
                        setQuote(data)
                        setLoading(false)
                    }
                })
                .catch((err) => {
                    if (isMounted) {
                        setError(err?.message || 'Failed to load quote')
                        setLoading(false)
                    }
                })
        }

        fetchQuote()
        const timer = setInterval(fetchQuote, pollIntervalMs)

        return () => {
            isMounted = false
            clearInterval(timer)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instrumentKey, pollIntervalMs])

    return { quote, loading, error }
}
