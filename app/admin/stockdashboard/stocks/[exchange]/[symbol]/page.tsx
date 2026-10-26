/**
 * app/admin/stockdashboard/stocks/[exchange]/[symbol]/page.tsx
 *
 * Page 3: Stock Overview route (/admin/stockdashboard/stocks/:exchange/:symbol).
 */

import React from 'react'
import StockOverviewView from '@/src/views/admin/stockdashboard/StockOverviewView'

interface Props {
    params: Promise<{ exchange: string; symbol: string }>
}

export default async function StockOverviewPage({ params }: Props) {
    const { exchange, symbol } = await params
    return <StockOverviewView exchange={exchange} symbol={symbol} />
}
