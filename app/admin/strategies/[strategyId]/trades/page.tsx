'use client'

import { use } from 'react'
import StrategyTradesTab from '@/src/views/admin/StrategyTradesTab'

interface Props {
    params: Promise<{ strategyId: string }>
}

export default function StrategyTradesPage({ params }: Props) {
    const { strategyId } = use(params)
    return <StrategyTradesTab strategyId={strategyId} />
}
