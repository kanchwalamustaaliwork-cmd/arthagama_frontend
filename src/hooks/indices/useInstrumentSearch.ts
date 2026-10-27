/**
 * src/hooks/indices/useInstrumentSearch.ts
 *
 * Hook for searching equity instruments when selecting constituents.
 */

import { useState, useEffect } from 'react'
import { Instrument } from '@/src/types/indices'
import { searchInstruments } from '@/src/lib/api/indices/indices.api'

export function useInstrumentSearch(initialQuery = '') {
    const [query, setQuery] = useState(initialQuery)
    const [results, setResults] = useState<Instrument[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let isMounted = true
        setLoading(true)

        const timer = setTimeout(async () => {
            try {
                const data = await searchInstruments(query)
                if (isMounted) setResults(data)
            } finally {
                if (isMounted) setLoading(false)
            }
        }, 150)

        return () => {
            isMounted = false
            clearTimeout(timer)
        }
    }, [query])

    return {
        query,
        setQuery,
        results,
        loading,
    }
}
