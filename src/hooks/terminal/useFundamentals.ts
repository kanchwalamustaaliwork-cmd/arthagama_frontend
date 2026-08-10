'use client'

import { useState, useEffect } from 'react'
import { CompanyFundamentals, Instrument } from '@/src/types/terminal'
import { fundamentalsSdk } from '@/src/lib/terminal-sdk'

export function useFundamentals(instrument: Instrument) {
    const [fundamentals, setFundamentals] = useState<CompanyFundamentals | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        setLoading(true)
        setError(null)

        fundamentalsSdk
            .getFundamentals(instrument)
            .then((data) => {
                if (isMounted) {
                    setFundamentals(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load fundamentals')
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [instrument.symbol, instrument.exchange])

    return { fundamentals, loading, error }
}
