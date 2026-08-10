'use client'

import React, { useState } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useFutures } from '@/src/hooks/terminal/useFutures'
import { FutureContract, Instrument } from '@/src/types/terminal'

export default function FuturesInfoWidget() {
    const { instrument, setInstrument } = useInstrument()
    const [isOpen, setIsOpen] = useState(false)

    // Derive the underlying symbol for futures lookup
    const underlyingSymbol = instrument.symbol
    const underlyingExchange = instrument.exchange

    const { futures, loading, error } = useFutures(
        underlyingSymbol,
        underlyingExchange,
        isOpen,
    )

    const selectFuture = (fut: FutureContract) => {
        const inst: Instrument = {
            symbol: fut.symbol,
            tradingSymbol: `${fut.symbol} FUT ${fut.expiry.slice(5)}`,
            displayName: `${fut.symbol} FUT ${fut.expiry.slice(5)}`,
            type: 'futures',
            exchange: fut.exchange,
            contractExpiry: fut.expiry,
            lotSize: fut.lot_size,
            token: fut.token,
            segment: 'NFO',
        }
        setInstrument(inst)
    }

    const labelColor = (label: string) => {
        if (label === 'Current') return '#ff9e00'
        if (label === 'Next')    return '#f7c948'
        return '#e5b800'
    }

    return (
        <div style={{
            borderRadius: '10px',
            background: '#111417',
            border: '1px solid rgba(255,158,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: isOpen ? '1px solid rgba(255,158,0,0.2)' : 'none',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#ff9e00', letterSpacing: '0.04em' }}>
                        FUT
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                        {underlyingSymbol} · Futures
                    </span>
                </div>
                <button
                    id="futures-widget-toggle"
                    onClick={() => setIsOpen((p) => !p)}
                    style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,158,0,0.35)',
                        background: isOpen ? 'rgba(255,158,0,0.2)' : 'transparent',
                        color: '#ff9e00',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    {isOpen ? 'Close ▲' : 'View Contracts ▼'}
                </button>
            </div>

            {/* Body */}
            {isOpen && (
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {loading && (
                        <div style={{ color: '#7d848c', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
                            Loading…
                        </div>
                    )}
                    {!loading && error && (
                        <div style={{ color: '#e0524b', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
                            {error}
                        </div>
                    )}
                    {!loading && !error && futures.length === 0 && (
                        <div style={{ color: '#7d848c', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
                            No futures data available
                        </div>
                    )}
                    {!loading && futures.map((fut) => (
                        <button
                            key={fut.token}
                            id={`futures-contract-${fut.token}`}
                            onClick={() => selectFuture(fut)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,158,0,0.15)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                width: '100%',
                                textAlign: 'left',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700,
                                    color: labelColor(fut.label),
                                    background: `${labelColor(fut.label)}18`,
                                    padding: '1px 6px',
                                    borderRadius: '3px',
                                }}>
                                    {fut.label}
                                </span>
                                <span style={{ fontSize: '12px', color: '#fff', fontFamily: 'Consolas, monospace', fontWeight: 600 }}>
                                    {fut.expiry}
                                </span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#7d848c', fontFamily: 'Consolas, monospace' }}>
                                Lot: {fut.lot_size}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
