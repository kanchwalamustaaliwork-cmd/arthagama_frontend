import { useCallback, useEffect, useState } from 'react'
import type { AdminStrategy, AdminStrategyStatus, StrategyEditFormData } from '@/src/types/admin'
import { fetchAdminStrategy, updateStrategyStatus, updateStrategy } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error' | 'not_found'

export function useAdminStrategy(id: string) {
    const [strategy, setStrategy] = useState<AdminStrategy | null>(null)
    const [status, setStatus] = useState<Status>('loading')
    const [saving, setSaving] = useState(false)

    const load = useCallback(() => {
        if (!id) return
        setStatus('loading')
        fetchAdminStrategy(id)
            .then(data => {
                if (!data) { setStatus('not_found'); return }
                setStrategy(data)
                setStatus('ready')
            })
            .catch(() => setStatus('error'))
    }, [id])

    useEffect(() => { load() }, [load])

    const handleStatusChange = useCallback(async (action: 'start' | 'stop' | 'archive') => {
        if (!strategy) return
        const statusMap: Record<string, AdminStrategyStatus> = { start: 'running', stop: 'paused', archive: 'archived' }
        // Optimistic
        setStrategy(prev => prev ? { ...prev, status: statusMap[action] } : prev)
        try {
            const updated = await updateStrategyStatus(id, action)
            setStrategy(updated)
        } catch {
            load() // Reload on error
        }
    }, [id, strategy, load])

    const handleSave = useCallback(async (data: StrategyEditFormData): Promise<boolean> => {
        setSaving(true)
        try {
            const updated = await updateStrategy(id, data)
            setStrategy(updated)
            return true
        } catch {
            return false
        } finally {
            setSaving(false)
        }
    }, [id])

    return { strategy, status, saving, handleStatusChange, handleSave, retry: load }
}
