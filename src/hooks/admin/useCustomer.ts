import { useEffect, useState } from 'react'
import type { AdminCustomer } from '@/src/types/admin'
import { fetchCustomer } from '@/src/services/admin/adminApi'

type Status = 'loading' | 'ready' | 'error' | 'not_found'

export function useCustomer(id: string) {
    const [customer, setCustomer] = useState<AdminCustomer | null>(null)
    const [status, setStatus] = useState<Status>('loading')

    const load = () => {
        setStatus('loading')
        fetchCustomer(id)
            .then(data => {
                if (!data) { setStatus('not_found'); return }
                setCustomer(data)
                setStatus('ready')
            })
            .catch(() => setStatus('error'))
    }

    useEffect(() => { if (id) load() }, [id])

    return { customer, status, retry: load }
}
