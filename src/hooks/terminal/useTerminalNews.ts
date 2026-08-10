'use client'

import { useState, useEffect } from 'react'
import { Instrument, NewsItem } from '@/src/types/terminal'
import { newsSdk } from '@/src/lib/terminal-sdk'

export function useTerminalNews(instrument: Instrument) {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        setLoading(true)
        setError(null)

        newsSdk
            .getCompanyNews(instrument)
            .then((data) => {
                if (isMounted) {
                    setNews(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load news')
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [instrument.symbol])

    return { news, loading, error }
}
