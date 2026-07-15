import { useEffect, useState } from 'react'
import type { StrategyAnalysis } from '@/src/types/admin'
import { fetchStrategyAnalysis } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error'

export function useStrategyAnalysis(strategyId: string) {
    const [analysis, setAnalysis] = useState<StrategyAnalysis | null>(null)
    const [status, setStatus] = useState<Status>('loading')

    const load = () => {
        setStatus('loading')
        fetchStrategyAnalysis(strategyId)
            .then(data => { setAnalysis(data); setStatus('ready') })
            .catch(() => setStatus('error'))
    }

    useEffect(() => { if (strategyId) load() }, [strategyId])

    return { analysis, status, retry: load }
}
