'use client'

import { useEffect, useState } from 'react'
import { fetchStrategyUniverse } from '@/src/services/admin/adminApi'
import UniverseMarquee from '@/src/components/admin/UniverseMarquee'
import { Info } from 'lucide-react'

interface Props { strategyId: string }

export default function StrategyUniverseTab({ strategyId }: Props) {
    const [symbols, setSymbols] = useState<string[]>([])
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

    useEffect(() => {
        setStatus('loading')
        fetchStrategyUniverse(strategyId)
            .then(data => {
                setSymbols(data.symbols || [])
                setStatus('ready')
            })
            .catch(() => setStatus('error'))
    }, [strategyId])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h3 style={{ fontSize: '14px', fontWeight: 650, color: 'var(--db-text)', marginBottom: '4px' }}>Trading Universe Ticker</h3>
            </div>

            <UniverseMarquee
                symbols={symbols}
                loading={status === 'loading'}
                error={status === 'error'}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(95, 175, 215, 0.05)', border: '1px solid rgba(95, 175, 215, 0.15)', borderRadius: 'var(--db-radius-md)' }}>
                <Info size={14} color="var(--db-info)" />
                <span style={{ fontSize: '12px', color: 'var(--db-text-2)' }}>
                    Total active target count: <strong>{symbols.length}</strong> symbols. Executed order triggers evaluate against this set on tick triggers.
                </span>
            </div>
        </div>
    )
}
