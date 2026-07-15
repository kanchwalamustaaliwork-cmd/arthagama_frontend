import { useEffect, useState } from 'react'
import type { AdminHolding } from '@/src/types/admin'
import { fetchStrategyHoldings } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error'

export function useStrategyHoldings(strategyId: string) {
    const [holdings, setHoldings] = useState<AdminHolding[]>([])
    const [status, setStatus] = useState<Status>('loading')

    const load = () => {
        setStatus('loading')
        fetchStrategyHoldings(strategyId)
            .then(data => { setHoldings(data); setStatus('ready') })
            .catch(() => setStatus('error'))
    }

    useEffect(() => { if (strategyId) load() }, [strategyId])

    return { holdings, status, retry: load }
}
