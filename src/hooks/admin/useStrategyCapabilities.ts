import { useEffect, useState } from 'react'
import type { StrategyCapabilities } from '@/src/types/admin'
import { fetchStrategyCapabilities } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error'

const DEFAULT_CAPABILITIES: StrategyCapabilities = {
    logs: false,
    holdings: false,
    trades: false,
    metrics: true,
    universe: true,
}

/**
 * Fetches and returns the canonical feature capabilities for a strategy.
 *
 * Use the returned ``capabilities`` object to decide whether to show, disable,
 * or hide feature tabs.  When ``status === 'loading'``, assume all capabilities
 * are unavailable (show loading state).  When ``status === 'error'``, fall back
 * to showing tabs without disabling them — the feature endpoints will return
 * their own empty/error states.
 *
 * Do NOT use ``strategy.category`` or ``strategy.strategyType`` to infer
 * capability — capabilities depend on actual collection presence, not type.
 */
export function useStrategyCapabilities(strategyId: string) {
    const [capabilities, setCapabilities] = useState<StrategyCapabilities>(DEFAULT_CAPABILITIES)
    const [status, setStatus] = useState<Status>('loading')

    useEffect(() => {
        if (!strategyId) return

        let cancelled = false
        setStatus('loading')

        fetchStrategyCapabilities(strategyId)
            .then(res => {
                if (!cancelled) {
                    setCapabilities(res.capabilities)
                    setStatus('ready')
                }
            })
            .catch(() => {
                if (!cancelled) {
                    // On error, default to showing all tabs — feature endpoints
                    // will handle their own missing-collection state.
                    setCapabilities({
                        ...DEFAULT_CAPABILITIES,
                        logs: true,
                        holdings: true,
                        trades: true,
                    })
                    setStatus('error')
                }
            })

        return () => { cancelled = true }
    }, [strategyId])

    return { capabilities, status }
}
