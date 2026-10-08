'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useOptionChainContext } from '@/src/context/OptionChainContext'
import { useLiveOptionChain } from '@/src/hooks/terminal/useLiveOptionChain'
import { LiveOptionLeg, Instrument } from '@/src/types/terminal'

// ── Formatting Helpers ────────────────────────────────────────────────────────

const isEmpty = (val?: number | null): val is undefined | null =>
    val === undefined || val === null || isNaN(val as number)

function fmtNumber(val?: number | null, decimals = 2): string {
    if (isEmpty(val)) return '—'
    return val.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

function fmtInteger(val?: number | null): string {
    if (isEmpty(val)) return '—'
    return Math.round(val).toLocaleString('en-IN')
}

function fmtCompact(val?: number | null): string {
    if (isEmpty(val) || val === 0) return '—'
    const abs = Math.abs(val)
    if (abs >= 10000000) return `${(val / 10000000).toFixed(2)} Cr`
    if (abs >= 100000) return `${(val / 100000).toFixed(2)} L`
    if (abs >= 1000) return `${(val / 1000).toFixed(1)} k`
    return val.toLocaleString('en-IN')
}

function fmtPercent(val?: number | null): string {
    if (isEmpty(val)) return '—'
    const sign = val > 0 ? '+' : ''
    return `${sign}${val.toFixed(2)}%`
}

function fmtGreek(val?: number | null, decimals = 3): string {
    if (isEmpty(val)) return '—'
    return val.toFixed(decimals)
}

/**
 * 2nd / 3rd order greeks span many orders of magnitude (e.g. 0.00000312 vs 12.4),
 * so a fixed decimal count either hides them or wastes space. This picks a format
 * based on magnitude and falls back to scientific notation for very small values.
 */
function fmtSmallGreek(val?: number | null): string {
    if (isEmpty(val)) return '—'
    if (val === 0) return '0'
    const abs = Math.abs(val)
    if (abs < 0.0001) return val.toExponential(1)
    if (abs < 0.01) return val.toFixed(5)
    if (abs < 1) return val.toFixed(4)
    if (abs < 100) return val.toFixed(3)
    return val.toFixed(1)
}

// ── Column configuration ──────────────────────────────────────────────────────

type GroupId = 'depth' | 'oi' | 'g1' | 'g2' | 'g3'
type ColId =
    | 'ltp' | 'bid' | 'ask' | 'volume'
    | 'oi' | 'oich' | 'oichp' | 'prev_oi'
    | 'iv'
    | 'delta' | 'gamma' | 'theta' | 'vega' | 'rho'
    | 'vanna' | 'charm' | 'vomma' | 'veta'
    | 'speed' | 'zomma' | 'color' | 'ultima'

interface ColDef {
    id: ColId
    label: string
    width: number
    /** undefined = always visible */
    group?: GroupId
}

// Order is OUTER → INNER for calls (left → right). Puts are mirrored automatically.
const COLUMNS: ColDef[] = [
    // 1st order
    { id: 'delta', label: 'Delta', width: 62, group: 'g1' },
    { id: 'gamma', label: 'Gamma', width: 62, group: 'g1' },
    { id: 'theta', label: 'Theta', width: 62, group: 'g1' },
    { id: 'vega', label: 'Vega', width: 62, group: 'g1' },
    { id: 'rho', label: 'Rho', width: 62, group: 'g1' },
    // 2nd order
    { id: 'vanna', label: 'Vanna', width: 70, group: 'g2' },
    { id: 'charm', label: 'Charm', width: 70, group: 'g2' },
    { id: 'vomma', label: 'Vomma', width: 70, group: 'g2' },
    { id: 'veta', label: 'Veta', width: 70, group: 'g2' },
    // 3rd order
    { id: 'speed', label: 'Speed', width: 70, group: 'g3' },
    { id: 'zomma', label: 'Zomma', width: 70, group: 'g3' },
    { id: 'color', label: 'Color', width: 70, group: 'g3' },
    { id: 'ultima', label: 'Ultima', width: 70, group: 'g3' },
    // Always visible
    { id: 'iv', label: 'IV%', width: 54 },
    // OI detail
    { id: 'prev_oi', label: 'Prev OI', width: 70, group: 'oi' },
    { id: 'oichp', label: 'OI Chg%', width: 72, group: 'oi' },
    { id: 'oich', label: 'OI Chg', width: 70, group: 'oi' },
    { id: 'oi', label: 'OI', width: 92 },
    // Depth
    { id: 'volume', label: 'Volume', width: 70, group: 'depth' },
    { id: 'bid', label: 'Bid', width: 62, group: 'depth' },
    { id: 'ask', label: 'Ask', width: 62, group: 'depth' },
    { id: 'ltp', label: 'LTP', width: 84 },
]

const GROUP_META: { id: GroupId; label: string; short: string }[] = [
    { id: 'depth', label: 'Bid / Ask / Vol', short: 'Depth' },
    { id: 'oi', label: 'OI details', short: 'OI+' },
    { id: 'g1', label: '1st order Greeks', short: 'Greeks 1' },
    { id: 'g2', label: '2nd order Greeks', short: 'Greeks 2' },
    { id: 'g3', label: '3rd order Greeks', short: 'Greeks 3' },
]

const DESKTOP_GROUPS: GroupId[] = ['depth', 'oi', 'g1']
const MOBILE_GROUPS: GroupId[] = []

// ── Quick Symbol Pills ────────────────────────────────────────────────────────

const QUICK_INSTRUMENTS = [
    { symbol: 'NIFTY', name: 'NIFTY 50', short: 'NIFTY', exchange: 'NSE', type: 'index' as const },
    { symbol: 'BANKNIFTY', name: 'BANK NIFTY', short: 'BANKNIFTY', exchange: 'NSE', type: 'index' as const },
    { symbol: 'FINNIFTY', name: 'FIN NIFTY', short: 'FINNIFTY', exchange: 'NSE', type: 'index' as const },
    { symbol: 'SENSEX', name: 'SENSEX', short: 'SENSEX', exchange: 'BSE', type: 'index' as const },
]

// ── Responsive CSS (scoped by class prefix) ───────────────────────────────────

const RESPONSIVE_CSS = `
@keyframes oc-spin { to { transform: rotate(360deg); } }

#fullpage-option-chain * { box-sizing: border-box; }
#fullpage-option-chain .oc-scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
#fullpage-option-chain .oc-scroll-x::-webkit-scrollbar { height: 4px; }
#fullpage-option-chain .oc-scroll-x::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

#fullpage-option-chain .oc-table-wrap {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.18) transparent;
    overscroll-behavior: contain;
}
#fullpage-option-chain .oc-table-wrap::-webkit-scrollbar { width: 8px; height: 8px; }
#fullpage-option-chain .oc-table-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 4px; }
#fullpage-option-chain .oc-table-wrap::-webkit-scrollbar-corner { background: transparent; }

#fullpage-option-chain .oc-btn-label { display: inline; }
#fullpage-option-chain .oc-hide-sm { display: inline; }
#fullpage-option-chain .oc-show-sm { display: none; }

/* Tablet */
@media (max-width: 1024px) {
    #fullpage-option-chain .oc-topbar { padding: 8px 12px !important; }
    #fullpage-option-chain .oc-strip { padding: 8px 12px !important; }
}

/* Phone */
@media (max-width: 767px) {
    #fullpage-option-chain .oc-topbar { flex-direction: column; align-items: stretch !important; gap: 8px !important; }
    #fullpage-option-chain .oc-topbar-left,
    #fullpage-option-chain .oc-topbar-right { width: 100%; justify-content: space-between; gap: 8px !important; }
    #fullpage-option-chain .oc-pills { margin-left: 0 !important; width: 100%; }
    #fullpage-option-chain .oc-btn-label { display: none; }
    #fullpage-option-chain .oc-hide-sm { display: none !important; }
    #fullpage-option-chain .oc-show-sm { display: inline !important; }
    #fullpage-option-chain .oc-strip { gap: 8px !important; }
    #fullpage-option-chain .oc-strip-block { width: 100%; justify-content: space-between; }
    #fullpage-option-chain .oc-spot-price { font-size: 16px !important; }
}
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function OptionChainPage() {
    const { isOptionChainOpen, closeOptionChain } = useOptionChainContext()
    const { instrument, setInstrument } = useInstrument()

    // Column group visibility (user-toggleable)
    const [visibleGroups, setVisibleGroups] = useState<GroupId[]>(DESKTOP_GROUPS)

    // On first mount, pick a lean default on phones so the chain stays readable
    useEffect(() => {
        if (typeof window === 'undefined') return
        if (window.matchMedia('(max-width: 767px)').matches) {
            setVisibleGroups(MOBILE_GROUPS)
        }
    }, [])

    const toggleGroup = (id: GroupId) =>
        setVisibleGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))

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

    // Maximum OI across both sides for relative distribution bars
    const maxOI = useMemo(() => {
        if (!data?.rows || data.rows.length === 0) return 1
        let maxVal = 1
        for (const row of data.rows) {
            if (row.ce?.oi && row.ce.oi > maxVal) maxVal = row.ce.oi
            if (row.pe?.oi && row.pe.oi > maxVal) maxVal = row.pe.oi
        }
        return maxVal
    }, [data])

    // Visible columns: calls = outer → inner, puts = mirrored
    const ceColumns = useMemo(
        () => COLUMNS.filter((c) => !c.group || visibleGroups.includes(c.group)),
        [visibleGroups],
    )
    const peColumns = useMemo(() => [...ceColumns].reverse(), [ceColumns])

    const tableMinWidth = useMemo(() => {
        const side = ceColumns.reduce((sum, c) => sum + c.width, 0)
        return side * 2 + 92
    }, [ceColumns])

    // ── Auto-center on the ATM strike ────────────────────────────────────────
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const theadRef = useRef<HTMLTableSectionElement | null>(null)
    const centeredKeyRef = useRef<string | null>(null)

    // Row to center: ATM from the API, else the strike closest to spot, else the middle row
    const centerStrike = useMemo(() => {
        const rows = data?.rows
        if (!rows || rows.length === 0) return null
        const flagged = rows.find((r) => r.is_atm)
        if (flagged) return flagged.strike
        if (!isEmpty(data?.atm_strike)) return data!.atm_strike as number
        if (!isEmpty(data?.underlying_price)) {
            const spot = data!.underlying_price as number
            return rows.reduce((best, r) => (Math.abs(r.strike - spot) < Math.abs(best - spot) ? r.strike : best), rows[0].strike)
        }
        return rows[Math.floor(rows.length / 2)].strike
    }, [data])

    const centerOnStrike = useCallback(
        (smooth = false) => {
            const box = scrollRef.current
            if (!box) return
            const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto'

            // Horizontal: the strike column is the middle of the (mirrored) table
            const left = Math.max(0, (box.scrollWidth - box.clientWidth) / 2)

            // Vertical: put the ATM row in the middle of the area below the sticky header
            let top = box.scrollTop
            if (centerStrike !== null) {
                const row = box.querySelector<HTMLElement>(`#strike-row-${centerStrike}`)
                if (row) {
                    const boxRect = box.getBoundingClientRect()
                    const rowRect = row.getBoundingClientRect()
                    const rowTop = rowRect.top - boxRect.top + box.scrollTop
                    const headerH = theadRef.current?.offsetHeight ?? 0
                    top = rowTop + rowRect.height / 2 - headerH - (box.clientHeight - headerH) / 2
                }
            }
            box.scrollTo({ left, top: Math.max(0, top), behavior })
        },
        [centerStrike],
    )

    // Forget the "already centered" flag whenever the page is closed
    useEffect(() => {
        if (!isOptionChainOpen) centeredKeyRef.current = null
    }, [isOptionChainOpen])

    // Center once per open / symbol / expiry — NOT on every 1s live refresh,
    // otherwise the chain would jump while the user is scrolling.
    useEffect(() => {
        if (!isOptionChainOpen || !data?.rows?.length) return
        const key = `${activeSymbol}|${activeExpiry ?? data.active_expiry ?? ''}`
        if (centeredKeyRef.current === key) return
        centeredKeyRef.current = key
        const id = requestAnimationFrame(() => centerOnStrike(false))
        return () => cancelAnimationFrame(id)
    }, [isOptionChainOpen, data, activeSymbol, activeExpiry, centerOnStrike])

    // Column set / viewport size changes the table width, so re-center horizontally
    useEffect(() => {
        if (!isOptionChainOpen) return
        const id = requestAnimationFrame(() => {
            const box = scrollRef.current
            if (box) box.scrollLeft = Math.max(0, (box.scrollWidth - box.clientWidth) / 2)
        })
        return () => cancelAnimationFrame(id)
    }, [isOptionChainOpen, visibleGroups])

    useEffect(() => {
        if (!isOptionChainOpen) return
        const onResize = () => {
            const box = scrollRef.current
            if (box) box.scrollLeft = Math.max(0, (box.scrollWidth - box.clientWidth) / 2)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [isOptionChainOpen])

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

    // ── Cell renderer ─────────────────────────────────────────────────────────
    const renderCell = (
        col: ColDef,
        leg: LiveOptionLeg | null | undefined,
        side: 'CE' | 'PE',
        strike: number,
        bg: string,
    ) => {
        const isCE = side === 'CE'
        const align: 'left' | 'right' = isCE ? 'right' : 'left'
        const base: React.CSSProperties = {
            padding: '5px 8px',
            backgroundColor: bg,
            textAlign: align,
            color: '#9ba1a6',
            whiteSpace: 'nowrap',
        }
        const key = `${side}-${col.id}`
        const oiUp = (leg?.oich ?? 0) >= 0

        switch (col.id) {
            case 'ltp': {
                const up = (leg?.ltpch ?? 0) >= 0
                return (
                    <td
                        key={key}
                        onClick={() => handleSelectContract(leg, strike, side)}
                        title={`Click to select ${side} contract for chart`}
                        style={{
                            ...base,
                            padding: '5px 10px',
                            fontWeight: 700,
                            color: up ? '#26a65b' : '#ef5350',
                            cursor: leg ? 'pointer' : 'default',
                            borderRight: isCE ? '1px solid rgba(255, 255, 255, 0.12)' : undefined,
                        }}
                    >
                        <div>{fmtNumber(leg?.ltp, 2)}</div>
                        {!isEmpty(leg?.ltpchp) && (
                            <div style={{ fontSize: '9px', fontWeight: 500, opacity: 0.85 }}>
                                {fmtPercent(leg?.ltpchp)}
                            </div>
                        )}
                    </td>
                )
            }
            case 'oi': {
                const pct = leg?.oi ? Math.min(100, Math.round((leg.oi / maxOI) * 100)) : 0
                return (
                    <td key={key} style={{ ...base, position: 'relative', fontWeight: 600, color: '#ffffff' }}>
                        <div
                            style={{
                                position: 'absolute',
                                [isCE ? 'right' : 'left']: 0,
                                top: 0,
                                bottom: 0,
                                width: `${pct}%`,
                                backgroundColor: isCE ? 'rgba(38, 166, 91, 0.2)' : 'rgba(239, 83, 80, 0.2)',
                                pointerEvents: 'none',
                            }}
                        />
                        <span style={{ position: 'relative', zIndex: 1 }}>{fmtCompact(leg?.oi)}</span>
                    </td>
                )
            }
            case 'oich':
                return (
                    <td key={key} style={{ ...base, color: oiUp ? '#26a65b' : '#ef5350' }}>
                        {fmtCompact(leg?.oich)}
                    </td>
                )
            case 'oichp':
                return (
                    <td key={key} style={{ ...base, color: oiUp ? '#26a65b' : '#ef5350', fontWeight: 600 }}>
                        {fmtPercent(leg?.oichp)}
                    </td>
                )
            case 'prev_oi':
                return (
                    <td key={key} style={{ ...base, color: '#7d848c' }}>
                        {fmtCompact(leg?.prev_oi)}
                    </td>
                )
            case 'volume':
                return (
                    <td key={key} style={base}>
                        {fmtCompact(leg?.volume)}
                    </td>
                )
            case 'bid':
                return (
                    <td key={key} style={base}>
                        {fmtNumber(leg?.bid, 2)}
                    </td>
                )
            case 'ask':
                return (
                    <td key={key} style={base}>
                        {fmtNumber(leg?.ask, 2)}
                    </td>
                )
            case 'iv':
                return (
                    <td key={key} style={{ ...base, color: '#e5e7eb' }}>
                        {fmtNumber(leg?.iv, 1)}
                    </td>
                )
            case 'delta':
                return (
                    <td
                        key={key}
                        style={base}
                        title={leg?.greeks_source ? `Greeks source: ${leg.greeks_source}` : undefined}
                    >
                        {fmtGreek(leg?.delta, 2)}
                    </td>
                )
            case 'gamma':
                return <td key={key} style={base}>{fmtGreek(leg?.gamma, 4)}</td>
            case 'theta':
                return <td key={key} style={base}>{fmtGreek(leg?.theta, 2)}</td>
            case 'vega':
                return <td key={key} style={base}>{fmtGreek(leg?.vega, 2)}</td>
            case 'rho':
                return <td key={key} style={base}>{fmtGreek(leg?.rho, 3)}</td>
            // 2nd order
            case 'vanna':
                return <td key={key} style={{ ...base, color: '#a5b4fc' }}>{fmtSmallGreek(leg?.vanna)}</td>
            case 'charm':
                return <td key={key} style={{ ...base, color: '#a5b4fc' }}>{fmtSmallGreek(leg?.charm)}</td>
            case 'vomma':
                return <td key={key} style={{ ...base, color: '#a5b4fc' }}>{fmtSmallGreek(leg?.vomma)}</td>
            case 'veta':
                return <td key={key} style={{ ...base, color: '#a5b4fc' }}>{fmtSmallGreek(leg?.veta)}</td>
            // 3rd order
            case 'speed':
                return <td key={key} style={{ ...base, color: '#fdba74' }}>{fmtSmallGreek(leg?.speed)}</td>
            case 'zomma':
                return <td key={key} style={{ ...base, color: '#fdba74' }}>{fmtSmallGreek(leg?.zomma)}</td>
            case 'color':
                return <td key={key} style={{ ...base, color: '#fdba74' }}>{fmtSmallGreek(leg?.color)}</td>
            case 'ultima':
                return <td key={key} style={{ ...base, color: '#fdba74' }}>{fmtSmallGreek(leg?.ultima)}</td>
            default:
                return <td key={key} style={base}>—</td>
        }
    }

    // ── Header cell style helper ──────────────────────────────────────────────
    const headStyle = (col: ColDef, side: 'CE' | 'PE'): React.CSSProperties => {
        const isCE = side === 'CE'
        const isLtp = col.id === 'ltp'
        const tint =
            col.group === 'g2' ? '#a5b4fc' : col.group === 'g3' ? '#fdba74' : isLtp ? (isCE ? '#26a65b' : '#ef5350') : undefined
        return {
            padding: isLtp ? '6px 10px' : '6px 8px',
            textAlign: isCE ? 'right' : 'left',
            minWidth: `${col.width}px`,
            whiteSpace: 'nowrap',
            color: tint,
            borderRight: isCE && isLtp ? '1px solid rgba(255, 255, 255, 0.12)' : undefined,
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
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
            <style>{RESPONSIVE_CSS}</style>

            {/* ── Top Header Navigation Bar ── */}
            <div
                className="oc-topbar"
                style={{
                    padding: '10px 16px',
                    backgroundColor: '#101419',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexShrink: 0,
                    flexWrap: 'wrap',
                }}
            >
                {/* Left: Back button + Title + Quick Switch Pills */}
                <div
                    className="oc-topbar-left"
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', minWidth: 0 }}
                >
                    <button
                        id="back-to-terminal-btn"
                        onClick={closeOptionChain}
                        aria-label="Back to Terminal"
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
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a6ac')}
                    >
                        <span>←</span>
                        <span className="oc-btn-label">Back to Terminal</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span
                            className="oc-hide-sm"
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: 'rgba(168,85,247,0.2)',
                                color: '#a855f7',
                                border: '1px solid rgba(168,85,247,0.4)',
                                letterSpacing: '0.04em',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            LIVE OPTION CHAIN
                        </span>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap' }}>
                            {activeSymbol}
                            <span style={{ fontSize: '12px', color: '#7d848c', marginLeft: '6px', fontWeight: 500 }}>
                                · {activeExchange}
                            </span>
                        </div>
                    </div>

                    {/* Quick Switch Pills */}
                    <div
                        className="oc-pills oc-scroll-x"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginLeft: '8px',
                            minWidth: 0,
                        }}
                    >
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
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                    }}
                                >
                                    {inst.name}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Right: Controls + Live Status Indicator + Close Button */}
                <div
                    className="oc-topbar-right"
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
                >
                    {/* Strike Count Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="oc-hide-sm" style={{ fontSize: '11px', color: '#7d848c', fontWeight: 500 }}>
                            Strikes:
                        </span>
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
                            whiteSpace: 'nowrap',
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
                            <span
                                className="oc-hide-sm"
                                style={{ fontSize: '10px', color: '#7d848c', marginLeft: '4px' }}
                            >
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
                        aria-label="Close option chain"
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
                className="oc-scroll-x"
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#0c0f13',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                }}
            >
                <span className="oc-hide-sm" style={{ fontSize: '11px', color: '#7d848c', fontWeight: 600, flexShrink: 0 }}>
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
                                    flexShrink: 0,
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
                className="oc-strip"
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
                <div
                    className="oc-strip-block"
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
                >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#7d848c', fontWeight: 600, textTransform: 'uppercase' }}>
                            {activeSymbol} Spot
                        </span>
                        <span className="oc-spot-price" style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                            {underlyingPrice ? `₹${fmtNumber(underlyingPrice, 2)}` : '—'}
                        </span>
                    </div>

                    {!isEmpty(priceChange) && (
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
                            ATM: <span style={{ color: '#f59e0b' }}>{fmtInteger(data.atm_strike)}</span>
                        </div>
                    )}
                </div>

                {/* Key Options Metrics: VIX, PCR, Total OI */}
                <div
                    className="oc-strip-block"
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
                >
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

            {/* ── Column Group Toggles ── */}
            <div
                className="oc-scroll-x"
                style={{
                    padding: '6px 16px',
                    backgroundColor: '#0c0f13',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                }}
            >
                <span style={{ fontSize: '11px', color: '#7d848c', fontWeight: 600, flexShrink: 0 }}>Columns:</span>
                <button
                    id="center-atm-btn"
                    onClick={() => centerOnStrike(true)}
                    title="Scroll to the ATM strike"
                    style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        color: '#f59e0b',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        marginLeft: 'auto',
                        order: 99,
                    }}
                >
                    ◎ Center ATM
                </button>
                {GROUP_META.map((g) => {
                    const on = visibleGroups.includes(g.id)
                    const accent = g.id === 'g2' ? '#a5b4fc' : g.id === 'g3' ? '#fdba74' : '#d8b4fe'
                    return (
                        <button
                            key={g.id}
                            id={`column-group-${g.id}`}
                            onClick={() => toggleGroup(g.id)}
                            aria-pressed={on}
                            title={g.label}
                            style={{
                                padding: '3px 10px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: on ? 700 : 500,
                                backgroundColor: on ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                color: on ? accent : '#6b727a',
                                border: on ? `1px solid ${accent}66` : '1px solid rgba(255,255,255,0.07)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}
                        >
                            <span className="oc-hide-sm">{g.label}</span>
                            <span className="oc-show-sm">{g.short}</span>
                        </button>
                    )
                })}
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
                        gap: '8px',
                        flexShrink: 0,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span>⚠</span>
                        <span style={{ overflowWrap: 'anywhere' }}>{error}</span>
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
                            flexShrink: 0,
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* ── Main Option Chain Table (scrolls on both axes) ── */}
            <div
                data-lenis-prevent
                ref={scrollRef}
                className="oc-table-wrap"
                style={{
                    flex: 1,
                    minHeight: 0, // lets the flex child shrink so vertical scrolling works
                    overflowY: 'auto',
                    overflowX: 'auto',
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
                            padding: '0 16px',
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                border: '3px solid rgba(168,85,247,0.2)',
                                borderTopColor: '#a855f7',
                                borderRadius: '50%',
                                animation: 'oc-spin 0.8s linear infinite',
                            }}
                        />
                        <span style={{ fontSize: '13px' }}>Loading {activeSymbol} Option Chain from FYERS...</span>
                    </div>
                ) : data && data.rows && data.rows.length > 0 ? (
                    <table
                        style={{
                            width: '100%',
                            minWidth: `${tableMinWidth}px`,
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            fontSize: '11px',
                            textAlign: 'right',
                        }}
                    >
                        {/* Table Header */}
                        <thead ref={theadRef} style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#13171d' }}>
                            {/* Super Header: CALLS | STRIKE | PUTS */}
                            <tr>
                                <th
                                    colSpan={ceColumns.length}
                                    style={{
                                        padding: '7px 12px',
                                        backgroundColor: '#12201a',
                                        color: '#26a65b',
                                        fontWeight: 800,
                                        fontSize: '12px',
                                        letterSpacing: '0.05em',
                                        textAlign: 'center',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
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
                                        minWidth: '92px',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                                        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    }}
                                >
                                    STRIKE
                                </th>
                                <th
                                    colSpan={peColumns.length}
                                    style={{
                                        padding: '7px 12px',
                                        backgroundColor: '#241617',
                                        color: '#ef5350',
                                        fontWeight: 800,
                                        fontSize: '12px',
                                        letterSpacing: '0.05em',
                                        textAlign: 'center',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                                    }}
                                >
                                    PUTS (PE)
                                </th>
                            </tr>

                            {/* Sub Header: Individual Columns */}
                            <tr
                                style={{
                                    color: '#7d848c',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                }}
                            >
                                {ceColumns.map((col) => (
                                    <th
                                        key={`h-ce-${col.id}`}
                                        style={{
                                            ...headStyle(col, 'CE'),
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                                            backgroundColor: '#13171d',
                                        }}
                                    >
                                        {col.label}
                                    </th>
                                ))}

                                <th
                                    style={{
                                        padding: '6px 8px',
                                        textAlign: 'center',
                                        minWidth: '92px',
                                        backgroundColor: '#1b2129',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                                        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    }}
                                >
                                    STRIKE
                                </th>

                                {peColumns.map((col) => (
                                    <th
                                        key={`h-pe-${col.id}`}
                                        style={{
                                            ...headStyle(col, 'PE'),
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                                            backgroundColor: '#13171d',
                                        }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body: strikes in descending order */}
                        <tbody>
                            {data.rows.map((row) => {
                                const strike = row.strike
                                const ce = row.ce
                                const pe = row.pe
                                const isAtm = row.is_atm

                                // ITM styling (amber tint), ATM gets a purple tint
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

                                return (
                                    <tr
                                        key={strike}
                                        id={`strike-row-${strike}`}
                                        style={{
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
                                        {ceColumns.map((col) => renderCell(col, ce, 'CE', strike, ceBg))}

                                        {/* ── CENTER: STRIKE PRICE ── */}
                                        <td
                                            style={{
                                                padding: '5px 12px',
                                                textAlign: 'center',
                                                backgroundColor: isAtm ? '#2a1f3d' : '#14181f',
                                                color: isAtm ? '#f59e0b' : '#ffffff',
                                                fontWeight: 800,
                                                fontSize: '12px',
                                                borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                {isAtm && <span style={{ fontSize: '9px', color: '#f59e0b' }}>●</span>}
                                                <span>{fmtInteger(strike)}</span>
                                            </div>
                                        </td>

                                        {/* ── PUTS (PE) ── */}
                                        {peColumns.map((col) => renderCell(col, pe, 'PE', strike, peBg))}
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
                            padding: '0 16px',
                            textAlign: 'center',
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