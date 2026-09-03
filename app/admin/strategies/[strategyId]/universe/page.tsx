'use client'

import { use } from 'react'
import StrategyLiveUniverseTab from '@/src/views/admin/StrategyLiveUniverseTab'

interface Props {
    params: Promise<{ strategyId: string }>
}

export default function StrategyUniversePage({ params }: Props) {
    const { strategyId } = use(params)
    return <StrategyLiveUniverseTab strategyId={strategyId} />
}
