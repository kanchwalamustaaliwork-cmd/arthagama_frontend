'use client'

import { use } from 'react'
import StrategyDetailPage from '@/src/views/admin/StrategyDetailPage'

interface Props {
    params: Promise<{ strategyId: string }>
}

export default function StrategyUniversePage({ params }: Props) {
    const { strategyId } = use(params)
    return <StrategyDetailPage strategyId={strategyId} tab="universe" />
}
