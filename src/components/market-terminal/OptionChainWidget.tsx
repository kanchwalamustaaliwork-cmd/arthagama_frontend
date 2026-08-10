'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useOptionChain, useContracts } from '@/src/hooks/terminal/useOptionChain'
import { OptionLeg, Instrument } from '@/src/types/terminal'
import { Skeleton } from './Skeleton'

// ── Skeleton for the chain table ──────────────────────────────────────────────
function ChainSkeleton() {
    return (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* header row */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                <Skeleton height={9} width="12%" borderRadius={2} />
                <Skeleton height={9} style={{ flex: 1 }} borderRadius={2} />
                <Skeleton height={9} width="12%" borderRadius={2} />
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Skeleton height={13} width="25%" borderRadius={2} />
                    <Skeleton height={13} style={{ flex: 1 }} borderRadius={2} />
                    <Skeleton height={13} width="10%" borderRadius={3} />
                    <Skeleton height={13} style={{ flex: 1 }} borderRadius={2} />
                    <Skeleton height={13} width="25%" borderRadius={2} />
                </div>
            ))}
        </div>
    )
}

export default function OptionChainWidget() {
    const { instrument, setInstrument } = useInstrument()
    const [isOpen, setIsOpen] = useState(false)

    // Collapse automatically when the instrument changes (prevents stale chain)
    useEffect(() => {
        setIsOpen(false)
    }, [instrument.symbol, instrument.exchange])

    const { chain, expiry, setExpiry, loading, error } = useOptionChain(
        instrument,
        undefined,
        isOpen,          // ← fetch only when the widget is open
    )

    const maxOI = useMemo(() => {
        if (!chain) return 1
        return Math.max(1, ...chain.rows.flatMap((r) => [r.ce?.oi || 0, r.pe?.oi || 0]))
    }, [chain])

    const oiBar = (oi: number, side: 'left' | 'right', color: string) => ({
        background: `linear-gradient(to ${side}, ${color} ${(oi / maxOI) * 100}%, transparent ${(oi / maxOI) * 100}%)`,
    })

    const fmt = (n?: number | null, d = 2) =>
        n === undefined || n === null || isNaN(n) ? '—' : n.toLocaleString('en-IN', { maximumFractionDigits: d })

    const compact = (n?: number | null) => {
        if (!n) return '—'
        if (n >= 1e7) return (n / 1e7).toFixed(2) + 'Cr'
        if (n >= 1e5) return (n / 1e5).toFixed(1) + 'L'
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k'
        return String(n)
    }

    const { contracts: masterContracts } = useContracts(
        instrument.symbol,
        expiry,
        instrument.exchange,
        isOpen && !!expiry,   // fetch only when open and expiry is known
    )

    const selectOptionLeg = (optType: 'CE' | 'PE', strike: number) => {
        if (!chain) return
        // Look up token from master contracts for token-aware selection
        const masterRec = masterContracts.find(
            (c) => c.strike === strike && c.option_type === optType
        )
        const inst: Instrument = {
            symbol: chain.symbol,
            tradingSymbol: masterRec?.trading_symbol || `${chain.symbol} ${strike} ${optType}`,
            displayName: `${chain.symbol} ${strike} ${optType}`,
            type: 'options',
            exchange: instrument.exchange,
            strike,
            optionType: optType,
            expiry: chain.expiry,
            lotSize: masterRec?.lot_size ?? chain.lot_size,
            token: masterRec?.token,
            segment: masterRec?.segment || 'NFO',
        }
        setInstrument(inst)
    }

    const isUnavailable = !loading && !error && chain && (chain as any).available === false

    return (
        <div
            style={{
                borderRadius: '10px',
                background: '#111417',
                border: '1px solid var(--db-border, rgba(255,255,255,0.08))',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* ── Collapsed header (always visible) ── */}
            <div
                style={{
                    padding: '10px 16px',
                    borderBottom: isOpen ? '1px solid var(--db-border, rgba(255,255,255,0.08))' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7', letterSpacing: '0.04em' }}>
                        OMON
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                        {instrument.symbol} · Option Chain
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Expiry selector — only visible when open */}
                    {isOpen && (
                        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
                            {chain?.expiries?.slice(0, 5).map((e) => (
                                <button
                                    key={e}
                                    onClick={() => setExpiry(e)}
                                    style={{
                                        padding: '3px 8px',
                                        fontSize: '11px',
                                        fontFamily: 'Consolas, monospace',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: e === expiry ? 'rgba(168,85,247,0.25)' : 'transparent',
                                        color: e === expiry ? '#a855f7' : '#7d848c',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {e.slice(5)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Open / Close toggle */}
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: '1px solid rgba(168,85,247,0.35)',
                            background: isOpen ? 'rgba(168,85,247,0.2)' : 'transparent',
                            color: '#a855f7',
                            cursor: 'pointer',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {isOpen ? 'Close ▲' : 'Open Chain ▼'}
                    </button>
                </div>
            </div>

            {/* ── Expandable body ── */}
            {isOpen && (
                <>
                    {/* Summary metrics bar */}
                    {chain && !isUnavailable && (
                        <div
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.02)',
                                borderBottom: '1px solid var(--db-border, rgba(255,255,255,0.05))',
                                display: 'flex',
                                gap: '16px',
                                fontSize: '11px',
                                fontFamily: 'Consolas, monospace',
                                color: '#7d848c',
                            }}
                        >
                            <div>SPOT <b style={{ color: '#fff' }}>{fmt(chain.spot)}</b></div>
                            <div>ATM <b style={{ color: '#fff' }}>{fmt(chain.atm_strike, 0)}</b></div>
                            <div>
                                PCR{' '}
                                <b style={{ color: (chain.pcr ?? 1) >= 1 ? 'var(--db-gain, #26a65b)' : 'var(--db-loss, #e0524b)' }}>
                                    {fmt(chain.pcr, 2)}
                                </b>
                            </div>
                            <div>MAX PAIN <b style={{ color: '#fff' }}>{fmt(chain.max_pain, 0)}</b></div>
                            <div style={{ marginLeft: 'auto', color: '#a855f7', fontSize: '9.5px' }}>
                                {(chain as any).source?.toUpperCase()}
                            </div>
                        </div>
                    )}

                    {/* Grid body */}
                    <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                        {/* Loading skeleton */}
                        {loading && !chain && <ChainSkeleton />}

                        {/* Error state */}
                        {!loading && error && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '32px', color: '#7d848c' }}>
                                <span style={{ fontSize: '22px', opacity: 0.4 }}>⚠</span>
                                <span style={{ fontSize: '12px', fontWeight: 500 }}>Could not load option chain</span>
                                <span style={{ fontSize: '11px', color: '#555' }}>{error}</span>
                            </div>
                        )}

                        {/* Data unavailable from backend */}
                        {isUnavailable && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '32px', color: '#7d848c' }}>
                                <span style={{ fontSize: '26px', opacity: 0.4 }}>⊘</span>
                                <span style={{ fontSize: '12px', fontWeight: 500 }}>Option Chain Unavailable</span>
                                <span style={{ fontSize: '11px', color: '#555', textAlign: 'center', lineHeight: 1.5 }}>
                                    NSE option chain data could not be retrieved at this time.
                                </span>
                            </div>
                        )}

                        {/* Chain table */}
                        {!loading && !error && chain && !isUnavailable && (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'Consolas, monospace' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                                        <th colSpan={4} style={{ color: 'var(--db-gain, #26a65b)', padding: '6px', textAlign: 'center' }}>CALLS</th>
                                        <th style={{ color: '#a855f7', padding: '6px', textAlign: 'center' }}>STRIKE</th>
                                        <th colSpan={4} style={{ color: 'var(--db-loss, #e0524b)', padding: '6px', textAlign: 'center' }}>PUTS</th>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#7d848c', fontSize: '10px' }}>
                                        <th style={{ padding: '4px 6px', textAlign: 'right' }}>OI</th>
                                        <th style={{ padding: '4px 6px', textAlign: 'right' }}>IV</th>
                                        <th style={{ padding: '4px 6px', textAlign: 'right' }}>Δ</th>
                                        <th style={{ padding: '4px 6px', textAlign: 'right' }}>LTP</th>
                                        <th style={{ padding: '4px 6px', textAlign: 'center' }}></th>
                                        <th style={{ padding: '4px 6px', textAlign: 'left' }}>LTP</th>
                                        <th style={{ padding: '4px 6px', textAlign: 'left' }}>Δ</th>
                                        <th style={{ padding: '4px 6px', textAlign: 'left' }}>IV</th>
                                        <th style={{ padding: '4px 6px', textAlign: 'left' }}>OI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chain.rows.map((r) => {
                                        const isAtm = r.strike === chain.atm_strike
                                        const ceItm = r.strike < chain.spot
                                        const peItm = r.strike > chain.spot
                                        const isSelectedCE = instrument.type === 'options' && instrument.strike === r.strike && instrument.optionType === 'CE'
                                        const isSelectedPE = instrument.type === 'options' && instrument.strike === r.strike && instrument.optionType === 'PE'

                                        return (
                                            <tr
                                                key={r.strike}
                                                style={{
                                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                    background: isAtm ? 'rgba(168,85,247,0.08)' : 'transparent',
                                                }}
                                            >
                                                <td style={{ ...oiBar(r.ce?.oi || 0, 'left', 'rgba(255,158,0,0.14)'), padding: '4px 6px', textAlign: 'right', color: '#7d848c' }}>
                                                    {compact(r.ce?.oi)}
                                                </td>
                                                <td style={{ padding: '4px 6px', textAlign: 'right', color: '#7d848c' }}>{fmt(r.ce?.iv, 1)}</td>
                                                <td style={{ padding: '4px 6px', textAlign: 'right', color: '#7d848c' }}>{fmt(r.ce?.delta, 2)}</td>
                                                <td
                                                    onClick={() => selectOptionLeg('CE', r.strike)}
                                                    style={{ padding: '4px 6px', textAlign: 'right', cursor: 'pointer', fontWeight: 600, color: ceItm ? '#26a65b' : '#d6d9dc', background: isSelectedCE ? 'rgba(38,166,91,0.25)' : 'transparent' }}
                                                >
                                                    {fmt(r.ce?.ltp)}
                                                </td>
                                                <td style={{ padding: '4px 8px', textAlign: 'center', fontWeight: isAtm ? 700 : 500, color: isAtm ? '#a855f7' : '#fff', background: isAtm ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.02)' }}>
                                                    {r.strike}
                                                </td>
                                                <td
                                                    onClick={() => selectOptionLeg('PE', r.strike)}
                                                    style={{ padding: '4px 6px', textAlign: 'left', cursor: 'pointer', fontWeight: 600, color: peItm ? '#e0524b' : '#d6d9dc', background: isSelectedPE ? 'rgba(224,82,75,0.25)' : 'transparent' }}
                                                >
                                                    {fmt(r.pe?.ltp)}
                                                </td>
                                                <td style={{ padding: '4px 6px', textAlign: 'left', color: '#7d848c' }}>{fmt(r.pe?.delta, 2)}</td>
                                                <td style={{ padding: '4px 6px', textAlign: 'left', color: '#7d848c' }}>{fmt(r.pe?.iv, 1)}</td>
                                                <td style={{ ...oiBar(r.pe?.oi || 0, 'right', 'rgba(74,159,212,0.16)'), padding: '4px 6px', textAlign: 'left', color: '#7d848c' }}>
                                                    {compact(r.pe?.oi)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
