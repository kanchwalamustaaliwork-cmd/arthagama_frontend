'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useOptionChainContext } from '@/src/context/OptionChainContext'
import { useExpiries, useContracts } from '@/src/hooks/terminal/useOptionChain'
import { ContractRecord, Instrument } from '@/src/types/terminal'
import { Skeleton } from './Skeleton'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtExpiry(iso: string) {
    // "2026-08-11" → "11 Aug 26"
    try {
        const d = new Date(iso + 'T00:00:00Z')
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', timeZone: 'UTC' })
    } catch {
        return iso
    }
}

function fmtStrike(n: number) {
    return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

// ── Skeleton placeholder ───────────────────────────────────────────────────────

function ChainSkeleton() {
    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <Skeleton height={12} width="20%" borderRadius={2} />
                <Skeleton height={12} width="12%" borderRadius={2} />
                <Skeleton height={12} width="20%" borderRadius={2} />
            </div>
            {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Skeleton height={28} style={{ flex: 1 }} borderRadius={4} />
                    <Skeleton height={28} width="14%" borderRadius={4} />
                    <Skeleton height={28} style={{ flex: 1 }} borderRadius={4} />
                </div>
            ))}
        </div>
    )
}

// ── Main modal ─────────────────────────────────────────────────────────────────

export default function OptionChainModal() {
    const { isOpen, closeChain } = useOptionChainContext()
    const { instrument, setInstrument } = useInstrument()

    // The "underlying" for the chain is always instrument.symbol
    const underlyingSymbol = instrument.symbol
    const underlyingExchange = instrument.exchange

    // ── Expiries (from instrument master) ─────────────────────────────────────
    const { expiries, loading: expiriesLoading } = useExpiries(
        underlyingSymbol,
        underlyingExchange,
        isOpen,
    )

    // ── Active expiry ─────────────────────────────────────────────────────────
    // If we're viewing an option contract, honour its expiry.
    // Otherwise (equity/index/general open), use the first (nearest) expiry once loaded.
    const [activeExpiry, setActiveExpiry] = useState<string>('')

    useEffect(() => {
        if (!isOpen) return

        if (instrument.type === 'options' && instrument.expiry) {
            // Case 1: opened from an option chart — snap to its expiry
            setActiveExpiry(instrument.expiry)
        } else if (expiries.length > 0) {
            // Case 2: general open — pick nearest available expiry
            setActiveExpiry(expiries[0])
        }
    }, [isOpen, instrument.type, instrument.expiry, expiries])

    // Reset when the underlying symbol changes (e.g. user searches a different stock)
    useEffect(() => {
        if (isOpen) setActiveExpiry('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [underlyingSymbol])

    // ── Contracts for active expiry (master data only) ─────────────────────────
    const { contracts, loading: contractsLoading, error: contractsError } = useContracts(
        underlyingSymbol,
        activeExpiry,
        underlyingExchange,
        isOpen && !!activeExpiry,
    )

    // ── Group contracts into a strike map (CE + PE per strike) ────────────────
    type StrikeRow = { ce?: ContractRecord; pe?: ContractRecord }
    const strikeRows = useMemo<{ strike: number; ce?: ContractRecord; pe?: ContractRecord }[]>(() => {
        const map = new Map<number, StrikeRow>()
        for (const c of contracts) {
            if (!map.has(c.strike)) map.set(c.strike, {})
            const row = map.get(c.strike)!
            if (c.option_type === 'CE') row.ce = c
            else row.pe = c
        }
        return [...map.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([strike, row]) => ({ strike, ...row }))
    }, [contracts])

    // ── Select a contract → build full Instrument → set context ───────────────
    const handleSelectContract = (rec: ContractRecord) => {
        const next: Instrument = {
            symbol: underlyingSymbol,
            tradingSymbol: rec.trading_symbol || `${underlyingSymbol}${rec.strike}${rec.option_type}`,
            displayName: `${underlyingSymbol} ${fmtStrike(rec.strike)} ${rec.option_type}`,
            type: 'options',
            exchange: underlyingExchange,
            strike: rec.strike,
            optionType: rec.option_type,
            expiry: activeExpiry,
            token: rec.token,
            segment: rec.segment || 'NFO',
            lotSize: rec.lot_size,
        }
        setInstrument(next)
        closeChain()
    }

    // ── Keyboard close ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeChain() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, closeChain])

    // ── Highlighted rows ───────────────────────────────────────────────────────
    const selectedStrike = instrument.type === 'options' ? instrument.strike : undefined
    const selectedOptionType = instrument.type === 'options' ? instrument.optionType : undefined

    const loading = expiriesLoading || (contractsLoading && contracts.length === 0)

    if (!isOpen) return null

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div
            onClick={closeChain}
            data-lenis-prevent
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '700px',
                    maxWidth: '95vw',
                    maxHeight: '88vh',
                    background: '#111417',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#161a1e',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                            STRIKE SELECTION
                        </span>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                            {underlyingSymbol}
                            <span style={{ fontSize: '12px', color: '#7d848c', marginLeft: '6px', fontWeight: 500 }}>
                                · {underlyingExchange}
                            </span>
                        </div>
                    </div>
                    <button
                        id="close-option-chain-modal"
                        onClick={closeChain}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#a0a6ac',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
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

                {/* ── Expiry Tabs ── */}
                {expiries.length > 0 && (
                    <div
                        style={{
                            padding: '8px 20px',
                            background: 'rgba(255,255,255,0.02)',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            overflowX: 'auto',
                        }}
                    >
                        <span style={{ fontSize: '11px', color: '#7d848c', fontWeight: 600, marginRight: '4px', flexShrink: 0 }}>
                            Expiry:
                        </span>
                        {expiries.map((exp) => {
                            const active = exp === activeExpiry
                            return (
                                <button
                                    key={exp}
                                    onClick={() => setActiveExpiry(exp)}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '11px',
                                        fontFamily: 'Consolas, monospace',
                                        borderRadius: '5px',
                                        border: `1px solid ${active ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                                        background: active ? 'rgba(168,85,247,0.25)' : 'transparent',
                                        color: active ? '#a855f7' : '#9a9ea4',
                                        cursor: 'pointer',
                                        fontWeight: active ? 600 : 400,
                                        flexShrink: 0,
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {fmtExpiry(exp)}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* ── Body ── */}
                <div style={{ flex: 1, overflowY: 'auto', minHeight: '300px' }}>

                    {loading && <ChainSkeleton />}

                    {!loading && contractsError && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '48px', color: '#7d848c' }}>
                            <span style={{ fontSize: '28px', opacity: 0.5 }}>⚠️</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e0524b' }}>Could not load contracts</span>
                            <span style={{ fontSize: '11px', color: '#666' }}>{contractsError}</span>
                        </div>
                    )}

                    {!loading && !contractsError && strikeRows.length === 0 && activeExpiry && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '48px', color: '#7d848c' }}>
                            <span style={{ fontSize: '32px', opacity: 0.4 }}>⊘</span>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>No contracts found</span>
                            <span style={{ fontSize: '11px', color: '#555' }}>
                                No option contracts in the master for {underlyingSymbol} · {fmtExpiry(activeExpiry)}
                            </span>
                        </div>
                    )}

                    {!loading && !contractsError && strikeRows.length > 0 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#161a1e', zIndex: 2 }}>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <th
                                        style={{
                                            padding: '10px 16px',
                                            textAlign: 'center',
                                            color: '#26a65b',
                                            fontWeight: 700,
                                            fontSize: '11px',
                                            letterSpacing: '0.06em',
                                            width: '35%',
                                        }}
                                    >
                                        CALLS
                                    </th>
                                    <th
                                        style={{
                                            padding: '10px 12px',
                                            textAlign: 'center',
                                            color: '#a855f7',
                                            fontWeight: 700,
                                            fontSize: '11px',
                                            letterSpacing: '0.06em',
                                            width: '30%',
                                        }}
                                    >
                                        STRIKE
                                    </th>
                                    <th
                                        style={{
                                            padding: '10px 16px',
                                            textAlign: 'center',
                                            color: '#e0524b',
                                            fontWeight: 700,
                                            fontSize: '11px',
                                            letterSpacing: '0.06em',
                                            width: '35%',
                                        }}
                                    >
                                        PUTS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {strikeRows.map(({ strike, ce, pe }) => {
                                    const isSelectedCE = selectedStrike === strike && selectedOptionType === 'CE'
                                    const isSelectedPE = selectedStrike === strike && selectedOptionType === 'PE'

                                    return (
                                        <tr
                                            key={strike}
                                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                        >
                                            {/* CALLS cell */}
                                            <td
                                                onClick={() => ce && handleSelectContract(ce)}
                                                style={{
                                                    padding: '9px 16px',
                                                    textAlign: 'center',
                                                    cursor: ce ? 'pointer' : 'default',
                                                    fontWeight: isSelectedCE ? 700 : 500,
                                                    color: isSelectedCE ? '#26a65b' : ce ? '#d6d9dc' : '#444',
                                                    background: isSelectedCE
                                                        ? 'rgba(38, 166, 91, 0.18)'
                                                        : 'transparent',
                                                    transition: 'background 0.12s',
                                                    userSelect: 'none',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (ce && !isSelectedCE)
                                                        (e.currentTarget as HTMLElement).style.background = 'rgba(38,166,91,0.08)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelectedCE)
                                                        (e.currentTarget as HTMLElement).style.background = 'transparent'
                                                }}
                                            >
                                                {ce ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                        {isSelectedCE && (
                                                            <span style={{ fontSize: '8px', background: 'rgba(38,166,91,0.35)', color: '#26a65b', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                                                                ●
                                                            </span>
                                                        )}
                                                        <span style={{ fontSize: '11px', color: '#555' }}>CE</span>
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#333' }}>—</span>
                                                )}
                                            </td>

                                            {/* STRIKE cell */}
                                            <td
                                                style={{
                                                    padding: '9px 12px',
                                                    textAlign: 'center',
                                                    fontWeight: 700,
                                                    fontSize: '12.5px',
                                                    color: (selectedStrike === strike) ? '#a855f7' : '#fff',
                                                    background: (selectedStrike === strike)
                                                        ? 'rgba(168,85,247,0.12)'
                                                        : 'rgba(255,255,255,0.02)',
                                                    borderLeft: '1px solid rgba(255,255,255,0.04)',
                                                    borderRight: '1px solid rgba(255,255,255,0.04)',
                                                }}
                                            >
                                                {fmtStrike(strike)}
                                            </td>

                                            {/* PUTS cell */}
                                            <td
                                                onClick={() => pe && handleSelectContract(pe)}
                                                style={{
                                                    padding: '9px 16px',
                                                    textAlign: 'center',
                                                    cursor: pe ? 'pointer' : 'default',
                                                    fontWeight: isSelectedPE ? 700 : 500,
                                                    color: isSelectedPE ? '#e0524b' : pe ? '#d6d9dc' : '#444',
                                                    background: isSelectedPE
                                                        ? 'rgba(224, 82, 75, 0.18)'
                                                        : 'transparent',
                                                    transition: 'background 0.12s',
                                                    userSelect: 'none',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (pe && !isSelectedPE)
                                                        (e.currentTarget as HTMLElement).style.background = 'rgba(224,82,75,0.08)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelectedPE)
                                                        (e.currentTarget as HTMLElement).style.background = 'transparent'
                                                }}
                                            >
                                                {pe ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                        <span style={{ fontSize: '11px', color: '#555' }}>PE</span>
                                                        {isSelectedPE && (
                                                            <span style={{ fontSize: '8px', background: 'rgba(224,82,75,0.35)', color: '#e0524b', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                                                                ●
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#333' }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
