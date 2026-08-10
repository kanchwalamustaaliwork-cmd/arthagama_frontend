'use client'

import React from 'react'
import { InstrumentProvider } from '@/src/context/InstrumentContext'
import TerminalLayout from '@/src/components/market-terminal/TerminalLayout'

export default function MarketTerminalPage() {
    return (
        <InstrumentProvider>
            <div className="market-terminal" style={{ width: '100%' }}>
                <TerminalLayout />
            </div>
        </InstrumentProvider>
    )
}
