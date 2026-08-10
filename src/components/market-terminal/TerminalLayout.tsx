'use client'

import React from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { OptionChainProvider, useOptionChainContext } from '@/src/context/OptionChainContext'
import InstrumentSearch from './InstrumentSearch'
import QuoteHeader from './QuoteHeader'
import ChartWidget from './ChartWidget'
import OptionChainModal from './OptionChainModal'
import FundamentalsWidget from './FundamentalsWidget'
import FuturesInfoWidget from './FuturesInfoWidget'
import NewsWidget from './NewsWidget'
import MacroWidget from './MacroWidget'
import WatchlistWidget from './WatchlistWidget'

function OptionChainButton() {
    const { instrument } = useInstrument()
    const { openChain } = useOptionChainContext()

    // Show Option Chain button for underlying equities and indices
    const supportsOptions = ['equity', 'index'].includes(instrument.type)

    if (!supportsOptions) return null

    return (
        <button
            id="terminal-open-option-chain"
            onClick={() => openChain()}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                background: 'rgba(168,85,247,0.18)',
                color: '#a855f7',
                border: '1px solid rgba(168,85,247,0.35)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(168,85,247,0.15)',
            }}
        >
            <span style={{ fontSize: '10px', background: 'rgba(168,85,247,0.3)', padding: '1px 5px', borderRadius: '3px' }}>
                OMON
            </span>
            Option Chain
        </button>
    )
}

function TerminalLayoutContent() {
    const { instrument } = useInstrument()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* Global Search + Terminal Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <InstrumentSearch />
                <OptionChainButton />
            </div>

            <QuoteHeader />

            {/* Main Terminal Grid — Two Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '16px', alignItems: 'start' }}>
                {/* Left Column — Chart & Macro */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
                    <ChartWidget />
                    <MacroWidget />
                </div>

                {/* Right Column — Instrument Intelligence */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '360px' }}>
                    {instrument.type === 'futures' && <FuturesInfoWidget />}
                    <FundamentalsWidget />
                    <NewsWidget />
                    <WatchlistWidget />
                </div>
            </div>

            {/* Global Option Chain Popup/Modal */}
            <OptionChainModal />
        </div>
    )
}

export default function TerminalLayout() {
    return (
        <OptionChainProvider>
            <TerminalLayoutContent />
        </OptionChainProvider>
    )
}
