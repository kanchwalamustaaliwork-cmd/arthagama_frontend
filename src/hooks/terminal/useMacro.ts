'use client'

import { useState, useEffect } from 'react'
import { MacroTile } from '@/src/types/terminal'
import { macroSdk } from '@/src/lib/terminal-sdk'

export function useMacro(pollIntervalMs = 60000) {
    const [tiles, setTiles] = useState<MacroTile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        setLoading(true)
        setError(null)

        const fetchMacro = () => {
            macroSdk
                .getMacroSnapshot()
                .then((data) => {
                    if (isMounted) {
                        setTiles(data)
                        setLoading(false)
                    }
                })
                .catch((err) => {
                    if (isMounted) {
                        setError(err?.message || 'Failed to load macro tiles')
                        setLoading(false)
                    }
                })
        }

        fetchMacro()
        const timer = setInterval(fetchMacro, pollIntervalMs)

        return () => {
            isMounted = false
            clearInterval(timer)
        }
    }, [pollIntervalMs])

    return { tiles, loading, error }
}
