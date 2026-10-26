/**
 * app/admin/stockdashboard/stocks/[exchange]/[symbol]/layout.tsx
 *
 * Shared stock layout providing identity header and subtabs for:
 * - Overview
 * - Fundamentals
 * - Earnings & Results
 */

import React from 'react'
import { getStockProfile } from '@/src/lib/api/stockdashboard/stock-overview.api'
import { StockHeader } from '@/src/components/stockdashboard/shared/StockHeader'

interface Props {
    children: React.ReactNode
    params: Promise<{ exchange: string; symbol: string }>
}

export default async function StockDetailLayout({ children, params }: Props) {
    const { exchange, symbol } = await params
    const profile = await getStockProfile(exchange, symbol)

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <StockHeader profile={profile} />
            {children}
        </div>
    )
}
