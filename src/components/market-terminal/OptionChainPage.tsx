'use client'

import React, { useMemo } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useOptionChainContext } from '@/src/context/OptionChainContext'
import { useLiveOptionChain } from '@/src/hooks/terminal/useLiveOptionChain'
import { LiveOptionLeg, Instrument } from '@/src/types/terminal'

// ── Formatting Helpers ────────────────────────────────────────────────────────

function fmtNumber(val?: number | null, decimals = 2): string {
    if (val === undefined || val === null || isNaN(val)) return '—'
    return val.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

function fmtInteger(val?: number | null): string {
    if (val === undefined || val === null || isNaN(val)) return '—'
    return Math.round(val).toLocaleString('en-IN')
}

function fmtCompact(val?: number | null): string {
    if (val === undefined || val === null || isNaN(val) || val === 0) return '—'
    const abs = Math.abs(val)
    if (abs >= 10000000) return `${(val / 10000000).toFixed(2)} Cr`
    if (abs >= 100000) return `${(val / 100000).toFixed(2)} L`
    if (abs >= 1000) return `${(val / 1000).toFixed(1)} k`
    return val.toLocaleString('en-IN')
}

function fmtPercent(val?: number | null): string {
    if (val === undefined || val === null || isNaN(val)) return '—'
    const sign = val > 0 ? '+' : ''
    return `${sign}${val.toFixed(2)}%`
}

function fmtGreek(val?: number | null, decimals = 3): string {
    if (val === undefined || val === null || isNaN(val)) return '—'
    return val.toFixed(decimals)
}

// ── Quick Symbol Pills ────────────────────────────────────────────────────────

const QUICK_INSTRUMENTS = [
    { symbol: 'NIFTY', name: 'NIFTY 50', exchange: 'NSE', type: 'index' as const },
    { symbol: 'BANKNIFTY', name: 'BANK NIFTY', exchange: 'NSE', type: 'index' as const },
    { symbol: 'FINNIFTY', name: 'FIN NIFTY', exchange: 'NSE', type: 'index' as const },
    { symbol: 'SENSEX', name: 'SENSEX', exchange: 'BSE', type: 'index' as const },
]

export default function OptionChainPage() {
    const { isOptionChainOpen, closeOptionChain } = useOptionChainContext()
    const { instrument, setInstrument } = useInstrument()

    // Active symbol: use the current instrument symbol or default to NIFTY
    const activeSymbol = instrument.symbol || 'NIFTY'
    const activeExchange = instrument.exchange || (activeSymbol === 'SENSEX' ? 'BSE' : 'NSE')

    const {
        data,
        expiries,
        activeExpiry,
        setActiveExpiry,
        strikeCount,
        setStrikeCount,
        loading,
        isRefreshing,
        error,
        lastUpdated,
        refetch,
    } = useLiveOptionChain({
        symbol: activeSymbol,
        exchange: activeExchange,
        enabled: isOptionChainOpen,
        defaultStrikeCount: 50,
    })

    // Calculate maximum OI across both sides for relative visual distribution bars
    const maxOI = useMemo(() => {
        if (!data?.rows || data.rows.length === 0) return 1
        let maxVal = 1
        for (const row of data.rows) {
            if (row.ce?.oi && row.ce.oi > maxVal) maxVal = row.ce.oi
            if (row.pe?.oi && row.pe.oi > maxVal) maxVal = row.pe.oi
        }
        return maxVal
    }, [data])

    if (!isOptionChainOpen) return null

    const handleSelectContract = (leg: LiveOptionLeg | null | undefined, strike: number, type: 'CE' | 'PE') => {
        if (!leg) return
        const tradingSym = leg.symbol || `${activeSymbol}${strike}${type}`
        const next: Instrument = {
            symbol: activeSymbol,
            tradingSymbol: tradingSym,
            displayName: `${activeSymbol} ${strike} ${type}`,
            type: 'options',
            exchange: activeExchange,
            strike,
            optionType: type,
            expiry: activeExpiry || undefined,
            token: leg.fy_token,
            lotSize: data?.lot_size,
        }
        setInstrument(next)
        closeOptionChain()
    }

    const underlyingPrice = data?.underlying_price
    const priceChange = data?.underlying_change
    const priceChangePct = data?.underlying_change_pct
    const isUp = (priceChange ?? 0) >= 0

    return (
        <div
            id="fullpage-option-chain"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: '#090b0e',
                color: '#e1e7ec',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                overflow: 'hidden',
            }}
        >
            {/* ── Top Header Navigation Bar ── */}
            <div
                style={{
                    padding: '10px 16px',
                    backgroundColor: '#101419',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexShrink: 0,
                }}
            >
                {/* Left: Back button + Title + Quick Switch Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <button
                        id="back-to-terminal-btn"
                        onClick={closeOptionChain}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#a0a6ac',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a6ac')}
                    >
                        <span>←</span> Back to Terminal
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: 'rgba(168,85,247,0.2)',
                                color: '#a855f7',
                                border: '1px solid rgba(168,85,247,0.4)',
                                letterSpacing: '0.04em',
                            }}
                        >
                            LIVE OPTION CHAIN
                        </span>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                            {activeSymbol}
                            <span style={{ fontSize: '12px', color: '#7d848c', marginLeft: '6px', fontWeight: 500 }}>
                                · {activeExchange}
                            </span>
                        </div>
                    </div>

                    {/* Quick Switch Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
                        {QUICK_INSTRUMENTS.map((inst) => {
                            const isSelected = activeSymbol === inst.symbol
                            return (
                                <button
                                    key={inst.symbol}
                                    id={`quick-switch-${inst.symbol}`}
                                    onClick={() => {
                                        setInstrument({
                                            symbol: inst.symbol,
                                            displayName: inst.name,
                                            type: inst.type,
                                            exchange: inst.exchange,
                                        })
                                    }}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '11px',
                                        fontWeight: isSelected ? 700 : 500,
                                        borderRadius: '4px',
                                        backgroundColor: isSelected ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.04)',
                                        color: isSelected ? '#d8b4fe' : '#8a929a',
                                        border: isSelected ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.06)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {inst.name}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Right: Controls + Live Status Indicator + Close Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Strike Count Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#7d848c', fontWeight: 500 }}>Strikes:</span>
                        <select
                            id="option-chain-strike-count"
                            value={strikeCount}
                            onChange={(e) => setStrikeCount(Number(e.target.value))}
                            style={{
                                background: '#181d24',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: '#e1e7ec',
                                fontSize: '11px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                padding: '3px 8px',
                                cursor: 'pointer',
                            }}
                        >
                            <option value={20}>20 strikes</option>
                            <option value={30}>30 strikes</option>
                            <option value={40}>40 strikes</option>
                            <option value={50}>50 strikes (Max)</option>
                        </select>
                    </div>

                    {/* Live Indicator */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(38, 166, 91, 0.12)',
                            border: '1px solid rgba(38, 166, 91, 0.25)',
                        }}
                    >
                        <span
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: isRefreshing ? '#f59e0b' : '#26a65b',
                                display: 'inline-block',
                                transition: 'background-color 0.2s',
                            }}
                        />
                        <span style={{ fontSize: '11px', color: '#26a65b', fontWeight: 600 }}>
                            {isRefreshing ? 'Updating...' : 'Live (1s)'}
                        </span>
                        {lastUpdated && (
                            <span style={{ fontSize: '10px', color: '#7d848c', marginLeft: '4px' }}>
                                {lastUpdated.toLocaleTimeString('en-IN', { hour12: false })}
                            </span>
                        )}
                    </div>

                    {/* Manual Refresh */}
                    <button
                        id="option-chain-refresh-btn"
                        onClick={refetch}
                        title="Force refresh"
                        style={{
                            padding: '4px 8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            color: '#a0a6ac',
                            cursor: 'pointer',
                            fontSize: '12px',
                        }}
                    >
                        ↻
                    </button>

                    {/* Close */}
                    <button
                        id="close-option-chain-fullpage"
                        onClick={closeOptionChain}
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#a0a6ac',
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* ── Expiry Selection Tabs ── */}
            <div
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#0c0f13',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    overflowX: 'auto',
                    flexShrink: 0,
                }}
            >
                <span style={{ fontSize: '11px', color: '#7d848c', fontWeight: 600, flexShrink: 0 }}>
                    Select Expiry:
                </span>
                {expiries.length > 0 ? (
                    expiries.map((item, idx) => {
                        const isSelected = item.expiry === activeExpiry || (!activeExpiry && idx === 0)
                        return (
                            <button
                                key={item.expiry || idx}
                                id={`expiry-tab-${item.expiry || idx}`}
                                onClick={() => setActiveExpiry(item.expiry)}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: isSelected ? 700 : 500,
                                    backgroundColor: isSelected ? '#a855f7' : 'rgba(255, 255, 255, 0.04)',
                                    color: isSelected ? '#ffffff' : '#8d949d',
                                    border: isSelected ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {item.date || item.expiry}
                            </button>
                        )
                    })
                ) : (
                    <span style={{ fontSize: '11px', color: '#555d66', fontStyle: 'italic' }}>
                        Loading expiries from FYERS...
                    </span>
                )}
            </div>

            {/* ── Underlying Summary Metrics Strip ── */}
            <div
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#12161b',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                    flexShrink: 0,
                }}
            >
                {/* Underlying Price & Net Change */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#7d848c', fontWeight: 600, textTransform: 'uppercase' }}>
                            {activeSymbol} Spot
                        </span>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                            {underlyingPrice ? `₹${fmtNumber(underlyingPrice, 2)}` : '—'}
                        </span>
                    </div>

                    {priceChange !== undefined && priceChange !== null && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: isUp ? '#26a65b' : '#ef5350',
                            }}
                        >
                            <span>{isUp ? '▲' : '▼'}</span>
                            <span>{fmtNumber(Math.abs(priceChange), 2)}</span>
                            <span>({fmtPercent(priceChangePct)})</span>
                        </div>
                    )}

                    {data?.atm_strike && (
                        <div
                            style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                fontSize: '11px',
                                color: '#d1d5db',
                                fontWeight: 600,
                            }}
                        >
                            ATM Strike: <span style={{ color: '#f59e0b' }}>{fmtInteger(data.atm_strike)}</span>
                        </div>
                    )}
                </div>

                {/* Key Options Metrics: VIX, PCR, Total OI */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {data?.vix && (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#7d848c', fontWeight: 500 }}>India VIX:</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                                {fmtNumber(data.vix, 2)}
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#7d848c', fontWeight: 500 }}>PCR (OI):</span>
                        <span
                            style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: (data?.pcr ?? 1) >= 1 ? '#26a65b' : '#ef5350',
                            }}
                        >
                            {fmtNumber(data?.pcr, 3)}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#26a65b', fontWeight: 600 }}>CALL OI:</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#e1e7ec' }}>
                                {fmtCompact(data?.total_ce_oi)}
                            </span>
                        </div>
                        <span style={{ color: '#444c56', fontSize: '10px' }}>vs</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#ef5350', fontWeight: 600 }}>PUT OI:</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#e1e7ec' }}>
                                {fmtCompact(data?.total_pe_oi)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Error / Alert Banner ── */}
            {error && (
                <div
                    style={{
                        padding: '10px 16px',
                        backgroundColor: 'rgba(239, 83, 80, 0.12)',
                        borderBottom: '1px solid rgba(239, 83, 80, 0.3)',
                        color: '#ef5350',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⚠</span>
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={refetch}
                        style={{
                            padding: '3px 10px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(239, 83, 80, 0.2)',
                            border: '1px solid rgba(239, 83, 80, 0.4)',
                            color: '#ef5350',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* ── Main Option Chain Table ── */}
            <div
                data-lenis-prevent
                style={{
                    flex: 1,
                    overflow: 'auto',
                    backgroundColor: '#090b0e',
                }}
            >
                {loading && !data ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: '12px',
                            color: '#7d848c',
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                border: '3px solid rgba(168,85,247,0.2)',
                                borderTopColor: '#a855f7',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                            }}
                        />
                        <span style={{ fontSize: '13px' }}>Loading {activeSymbol} Option Chain from FYERS...</span>
                    </div>
                ) : data && data.rows && data.rows.length > 0 ? (
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '11px',
                            textAlign: 'right',
                        }}
                    >
                        {/* Table Header */}
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#13171d' }}>
                            {/* Super Header: CALLS | STRIKE | PUTS */}
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                                <th
                                    colSpan={12}
                                    style={{
                                        padding: '7px 12px',
                                        backgroundColor: 'rgba(38, 166, 91, 0.12)',
                                        color: '#26a65b',
                                        fontWeight: 800,
                                        fontSize: '12px',
                                        letterSpacing: '0.05em',
                                        textAlign: 'center',
                                        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    }}
                                >
                                    CALLS (CE)
                                </th>
                                <th
                                    style={{
                                        padding: '7px 12px',
                                        backgroundColor: '#1b2129',
                                        color: '#f59e0b',
                                        fontWeight: 800,
                                        fontSize: '12px',
                                        letterSpacing: '0.05em',
                                        textAlign: 'center',
                                        width: '100px',
                                        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    }}
                                >
                                    STRIKE
                                </th>
                                <th
                                    colSpan={12}
                                    style={{
                                        padding: '7px 12px',
                                        backgroundColor: 'rgba(239, 83, 80, 0.12)',
                                        color: '#ef5350',
                                        fontWeight: 800,
                                        fontSize: '12px',
                                        letterSpacing: '0.05em',
                                        textAlign: 'center',
                                    }}
                                >
                                    PUTS (PE)
                                </th>
                            </tr>

                            {/* Sub Header: Individual Columns */}
                            <tr
                                style={{
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: '#7d848c',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                }}
                            >
                                {/* CALLS Columns */}
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '50px' }}>Delta</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '50px' }}>Theta</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '50px' }}>Vega</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '45px' }}>IV%</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '60px' }}>Prev OI</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '60px' }}>OI Chg%</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '60px' }}>OI Chg</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '80px' }}>OI</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '60px' }}>Volume</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '55px' }}>Bid</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: '55px' }}>Ask</th>
                                <th
                                    style={{
                                        padding: '6px 10px',
                                        textAlign: 'right',
                                        width: '75px',
                                        color: '#26a65b',
                                        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    }}
                                >
                                    LTP
                                </th>

                                {/* STRIKE Column */}
                                <th
                                    style={{
                                        padding: '6px 8px',
                                        textAlign: 'center',
                                        width: '100px',
                                        backgroundColor: '#1b2129',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    }}
                                >
                                    STRIKE
                                </th>

                                {/* PUTS Columns */}
                                <th
                                    style={{
                                        padding: '6px 10px',
                                        textAlign: 'left',
                                        width: '75px',
                                        color: '#ef5350',
                                    }}
                                >
                                    LTP
                                </th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '55px' }}>Ask</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '55px' }}>Bid</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '60px' }}>Volume</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '80px' }}>OI</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '60px' }}>OI Chg</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '60px' }}>OI Chg%</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '60px' }}>Prev OI</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '45px' }}>IV%</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '50px' }}>Vega</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '50px' }}>Theta</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: '50px' }}>Delta</th>
                            </tr>
                        </thead>

                        {/* Table Body: Striking rows sorted in DESCENDING ORDER */}
                        <tbody>
                            {data.rows.map((row) => {
                                const strike = row.strike
                                const ce = row.ce
                                const pe = row.pe
                                const isAtm = row.is_atm

                                // ITM styling:
                                // For CE: strikes < spot are ITM (amber tint)
                                // For PE: strikes > spot are ITM (amber tint)
                                const ceBg =
                                    ce?.moneyness === 'ITM'
                                        ? 'rgba(245, 158, 11, 0.08)'
                                        : isAtm
                                        ? 'rgba(168, 85, 247, 0.12)'
                                        : 'transparent'
                                const peBg =
                                    pe?.moneyness === 'ITM'
                                        ? 'rgba(245, 158, 11, 0.08)'
                                        : isAtm
                                        ? 'rgba(168, 85, 247, 0.12)'
                                        : 'transparent'

                                const ceOiPct = ce?.oi ? Math.min(100, Math.round((ce.oi / maxOI) * 100)) : 0
                                const peOiPct = pe?.oi ? Math.min(100, Math.round((pe.oi / maxOI) * 100)) : 0

                                const ceLtpUp = (ce?.ltpch ?? 0) >= 0
                                const peLtpUp = (pe?.ltpch ?? 0) >= 0

                                const ceOiUp = (ce?.oich ?? 0) >= 0
                                const peOiUp = (pe?.oich ?? 0) >= 0

                                return (
                                    <tr
                                        key={strike}
                                        id={`strike-row-${strike}`}
                                        style={{
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                            backgroundColor: isAtm ? 'rgba(168, 85, 247, 0.06)' : 'transparent',
                                            transition: 'background-color 0.1s',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isAtm) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isAtm) e.currentTarget.style.backgroundColor = 'transparent'
                                        }}
                                    >
                                        {/* ── CALLS (CE) ── */}
                                        <td style={{ padding: '5px 8px', backgroundColor: ceBg, color: '#9ba1a6' }}>
                                            {fmtGreek(ce?.delta, 2)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: ceBg, color: '#9ba1a6' }}>
                                            {fmtGreek(ce?.theta, 1)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: ceBg, color: '#9ba1a6' }}>
                                            {fmtGreek(ce?.vega, 1)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: ceBg, color: '#e5e7eb' }}>
                                            {fmtNumber(ce?.iv, 1)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: ceBg, color: '#7d848c' }}>
                                            {fmtCompact(ce?.prev_oi)}
                                        </td>
                                        <td
                                            style={{
                                                padding: '5px 8px',
                                                backgroundColor: ceBg,
                                                color: ceOiUp ? '#26a65b' : '#ef5350',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {fmtPercent(ce?.oichp)}
                                        </td>
                                        <td
                                            style={{
                                                padding: '5px 8px',
                                                backgroundColor: ceBg,
                                                color: ceOiUp ? '#26a65b' : '#ef5350',
                                            }}
                                        >
                                            {fmtCompact(ce?.oich)}
                                        </td>

                                        {/* CE OI with horizontal distribution bar */}
                                        <td
                                            style={{
                                                padding: '5px 8px',
                                                backgroundColor: ceBg,
                                                position: 'relative',
                                                fontWeight: 600,
                                                color: '#ffffff',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    width: `${ceOiPct}%`,
                                                    backgroundColor: 'rgba(38, 166, 91, 0.2)',
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                            <span style={{ position: 'relative', zIndex: 1 }}>{fmtCompact(ce?.oi)}</span>
                                        </td>

                                        <td style={{ padding: '5px 8px', backgroundColor: ceBg, color: '#9ba1a6' }}>
                                            {fmtCompact(ce?.volume)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: ceBg, color: '#9ba1a6' }}>
                                            {fmtNumber(ce?.bid, 2)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: ceBg, color: '#9ba1a6' }}>
                                            {fmtNumber(ce?.ask, 2)}
                                        </td>

                                        {/* CE LTP (Clickable) */}
                                        <td
                                            onClick={() => handleSelectContract(ce, strike, 'CE')}
                                            title="Click to select CE contract for chart"
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: ceBg,
                                                fontWeight: 700,
                                                color: ceLtpUp ? '#26a65b' : '#ef5350',
                                                borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div>{fmtNumber(ce?.ltp, 2)}</div>
                                            {ce?.ltpchp !== undefined && ce?.ltpchp !== null && (
                                                <div style={{ fontSize: '9px', fontWeight: 500, opacity: 0.85 }}>
                                                    {fmtPercent(ce.ltpchp)}
                                                </div>
                                            )}
                                        </td>

                                        {/* ── CENTER: STRIKE PRICE ── */}
                                        <td
                                            style={{
                                                padding: '5px 12px',
                                                textAlign: 'center',
                                                backgroundColor: isAtm ? 'rgba(168, 85, 247, 0.25)' : '#14181f',
                                                color: isAtm ? '#f59e0b' : '#ffffff',
                                                fontWeight: 800,
                                                fontSize: '12px',
                                                borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                {isAtm && <span style={{ fontSize: '9px', color: '#f59e0b' }}>●</span>}
                                                <span>{fmtInteger(strike)}</span>
                                            </div>
                                        </td>

                                        {/* ── PUTS (PE) ── */}
                                        {/* PE LTP (Clickable) */}
                                        <td
                                            onClick={() => handleSelectContract(pe, strike, 'PE')}
                                            title="Click to select PE contract for chart"
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: peBg,
                                                textAlign: 'left',
                                                fontWeight: 700,
                                                color: peLtpUp ? '#26a65b' : '#ef5350',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div>{fmtNumber(pe?.ltp, 2)}</div>
                                            {pe?.ltpchp !== undefined && pe?.ltpchp !== null && (
                                                <div style={{ fontSize: '9px', fontWeight: 500, opacity: 0.85 }}>
                                                    {fmtPercent(pe.ltpchp)}
                                                </div>
                                            )}
                                        </td>

                                        <td style={{ padding: '5px 8px', backgroundColor: peBg, textAlign: 'left', color: '#9ba1a6' }}>
                                            {fmtNumber(pe?.ask, 2)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: peBg, textAlign: 'left', color: '#9ba1a6' }}>
                                            {fmtNumber(pe?.bid, 2)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: peBg, textAlign: 'left', color: '#9ba1a6' }}>
                                            {fmtCompact(pe?.volume)}
                                        </td>

                                        {/* PE OI with horizontal distribution bar */}
                                        <td
                                            style={{
                                                padding: '5px 8px',
                                                backgroundColor: peBg,
                                                textAlign: 'left',
                                                position: 'relative',
                                                fontWeight: 600,
                                                color: '#ffffff',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    width: `${peOiPct}%`,
                                                    backgroundColor: 'rgba(239, 83, 80, 0.2)',
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                            <span style={{ position: 'relative', zIndex: 1 }}>{fmtCompact(pe?.oi)}</span>
                                        </td>

                                        <td
                                            style={{
                                                padding: '5px 8px',
                                                backgroundColor: peBg,
                                                textAlign: 'left',
                                                color: peOiUp ? '#26a65b' : '#ef5350',
                                            }}
                                        >
                                            {fmtCompact(pe?.oich)}
                                        </td>
                                        <td
                                            style={{
                                                padding: '5px 8px',
                                                backgroundColor: peBg,
                                                textAlign: 'left',
                                                color: peOiUp ? '#26a65b' : '#ef5350',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {fmtPercent(pe?.oichp)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: peBg, textAlign: 'left', color: '#7d848c' }}>
                                            {fmtCompact(pe?.prev_oi)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: peBg, textAlign: 'left', color: '#e5e7eb' }}>
                                            {fmtNumber(pe?.iv, 1)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: peBg, textAlign: 'left', color: '#9ba1a6' }}>
                                            {fmtGreek(pe?.vega, 1)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: peBg, textAlign: 'left', color: '#9ba1a6' }}>
                                            {fmtGreek(pe?.theta, 1)}
                                        </td>
                                        <td style={{ padding: '5px 8px', backgroundColor: peBg, textAlign: 'left', color: '#9ba1a6' }}>
                                            {fmtGreek(pe?.delta, 2)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: '8px',
                            color: '#7d848c',
                        }}
                    >
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>No Option Chain data available</span>
                        <span style={{ fontSize: '12px' }}>
                            Verify that {activeSymbol} has active option contracts and that FYERS API credentials are set.
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
