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
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                background: 'rgba(168,85,247,0.18)',
                color: '#a855f7',
                border: '1px solid rgba(168,85,247,0.35)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
            }}
        >
            <span style={{ fontSize: '10px', background: 'rgba(168,85,247,0.3)', padding: '1px 5px', borderRadius: '3px' }}>
                OMON
            </span>
            Option Chain
        </button>
    )
}

function GoLiveButton() {
    return (
        <button
            id="terminal-go-live-button"
            title="Live WebSocket market data (Phase 2 — Fyers WebSocket)"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                background: 'rgba(38,166,91,0.12)',
                color: '#26a65b',
                border: '1px solid rgba(38,166,91,0.3)',
                cursor: 'not-allowed',
                opacity: 0.85,
            }}
        >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#26a65b', display: 'inline-block' }} />
            <span>Go Live</span>
            <span style={{ fontSize: '9px', background: 'rgba(38,166,91,0.2)', padding: '1px 4px', borderRadius: '3px', color: '#26a65b' }}>
                Phase 2
            </span>
        </button>
    )
}

function TerminalLayoutContent() {
    const { instrument } = useInstrument()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '12px', gap: '10px', overflow: 'hidden', boxSizing: 'border-box' }}>
            {/* Top Toolbar — Search, Controls, Go Live Stub */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexShrink: 0 }}>
                <InstrumentSearch />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <OptionChainButton />
                    <GoLiveButton />
                </div>
            </div>

            {/* Quote Header */}
            <div style={{ flexShrink: 0 }}>
                <QuoteHeader />
            </div>

            {/* Main Terminal Viewport — Left Chart + Right Sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '12px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                {/* Left Column — Flexible Chart Viewport */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', minHeight: 0 }}>
                    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        <ChartWidget />
                    </div>
                </div>

                {/* Right Column — Modular Sidebar with dedicated scrolling */}
                <div
                    data-lenis-prevent
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        height: '100%',
                        overflowY: 'auto',
                        paddingRight: '4px',
                    }}
                >
                    {instrument.type === 'futures' && <FuturesInfoWidget />}
                    <WatchlistWidget />
                    <FundamentalsWidget />
                    <NewsWidget />
                    <MacroWidget />
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
