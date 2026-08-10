'use client'

import { useState, useEffect } from 'react'
import { Instrument, Interval } from '@/src/types/terminal'
import { Bar } from '@/src/lib/market-terminal/CandleChart'
import { chartSdk } from '@/src/lib/terminal-sdk'

export function useOHLCV(instrument: Instrument, interval: Interval = '1d') {
    const [bars, setBars] = useState<Bar[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Stable identity key — always constant size, includes every field that
    // distinguishes one contract from another (token is the most important).
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

        chartSdk
            .getCandles(instrument, interval)
            .then((data) => {
                if (isMounted) {
                    setBars(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load chart candles')
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instrumentKey, interval])

    return { bars, loading, error }
}
