'use client'

import { use } from 'react'
import StrategyLtpTab from '@/src/views/admin/StrategyLtpTab'

interface Props {
    params: Promise<{ strategyId: string }>
}

export default function StrategyLtpPage({ params }: Props) {
    const { strategyId } = use(params)
    return <StrategyLtpTab strategyId={strategyId} />
}
