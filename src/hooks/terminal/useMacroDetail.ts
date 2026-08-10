'use client'

import { useState, useEffect } from 'react'
import { MacroDetail } from '@/src/types/terminal'
import { macroSdk } from '@/src/lib/terminal-sdk'

/**
 * Hook for fetching a single macro indicator's full detail.
 *
 * Design notes:
 * - Fetch is triggered by user click (not typing), so no debounce is applied.
 * - Pass null to reset state and skip any pending fetch.
 * - Returns the full MacroDetail including historical series.
 */
export function useMacroDetail(key: string | null) {
    const [detail, setDetail] = useState<MacroDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!key) {
            setDetail(null)
            setLoading(false)
            setError(null)
            return
        }

        let isMounted = true
        setLoading(true)
        setError(null)
        setDetail(null)

        macroSdk
            .getMacroDetail(key)
            .then((data) => {
                if (isMounted) {
                    setDetail(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load indicator detail')
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [key])

    return { detail, loading, error }
}
