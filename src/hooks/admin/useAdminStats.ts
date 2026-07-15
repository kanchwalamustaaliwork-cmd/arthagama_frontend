import { useEffect, useState } from 'react'
import type { AdminPlatformStats } from '@/src/types/admin'
import { fetchAdminStats } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error'

export function useAdminStats() {
    const [stats, setStats] = useState<AdminPlatformStats | null>(null)
    const [status, setStatus] = useState<Status>('loading')

    const load = () => {
        setStatus('loading')
        fetchAdminStats()
            .then(data => { setStats(data); setStatus('ready') })
            .catch(() => setStatus('error'))
    }

    useEffect(() => { load() }, [])

    return { stats, status, retry: load }
}
