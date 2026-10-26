/**
 * app/admin/stockdashboard/stocks/[exchange]/[symbol]/earnings/page.tsx
 *
 * Page 5: Stock Earnings & Results route (/admin/stockdashboard/stocks/:exchange/:symbol/earnings).
 */

import React from 'react'
import StockEarningsView from '@/src/views/admin/stockdashboard/StockEarningsView'

interface Props {
    params: Promise<{ exchange: string; symbol: string }>
}

export default async function EarningsPage({ params }: Props) {
    const { exchange, symbol } = await params
    return <StockEarningsView exchange={exchange} symbol={symbol} />
}
