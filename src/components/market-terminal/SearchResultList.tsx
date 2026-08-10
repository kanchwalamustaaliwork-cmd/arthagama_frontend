'use client'

import { SearchListResult, SearchListItem, SearchListGroup } from '@/src/types/terminal'
import { Instrument } from '@/src/types/terminal'

interface SearchResultListProps {
    result: SearchListResult
    activeIndex: number
    onSelectInstrument: (inst: Instrument) => void
    onOpenOptionChain: (symbol: string, exchange: string) => void
    onHoverIndex: (index: number) => void
}

export default function SearchResultList({
    result,
    activeIndex,
    onSelectInstrument,
    onOpenOptionChain,
    onHoverIndex,
}: SearchResultListProps) {
    let globalIndexCounter = 0

    const getTypeColor = (type?: string) => {
        if (!type) {
            return { bg: 'rgba(255,158,0,0.15)', text: '#ff9e00', border: 'rgba(255,158,0,0.3)', label: 'FUT' }
        }
        switch (type.toLowerCase()) {
            case 'index':
                return { bg: 'rgba(168,85,247,0.15)', text: '#a855f7', border: 'rgba(168,85,247,0.3)', label: 'INDX' }
            case 'equity':
            case 'stock':
                return { bg: 'rgba(38,166,91,0.15)', text: '#26a65b', border: 'rgba(38,166,91,0.3)', label: 'EQ' }
            case 'futures':
                return { bg: 'rgba(255,158,0,0.15)', text: '#ff9e00', border: 'rgba(255,158,0,0.3)', label: 'FUT' }
            case 'options':
                return { bg: 'rgba(74,159,212,0.15)', text: '#4a9fd4', border: 'rgba(74,159,212,0.3)', label: 'OPT' }
            default:
                return { bg: 'rgba(125,132,140,0.15)', text: '#7d848c', border: 'rgba(125,132,140,0.3)', label: type.toUpperCase() }
        }
    }

    const getFuturesLabelColor = (label?: string) => {
        if (label === 'Current') return '#ff9e00'
        if (label === 'Next') return '#f7c948'
        return '#e5b800'
    }

    const handleItemClick = (item: SearchListItem) => {
        const itemType = (item.instrument_type || 'equity') as any
        const instType = itemType === 'equity' || itemType === 'index'
            ? itemType
            : itemType === 'futures'
                ? 'futures'
                : itemType === 'options'
                    ? 'options'
                    : 'equity'

        const displayName = item.is_family
            ? `${item.symbol} ${(item.instrument_type || 'options').toUpperCase()}`
            : item.label
                ? `${item.symbol} FUT ${item.expiry?.slice(5) ?? ''}`
                : item.name || item.symbol

        const inst: Instrument = {
            symbol: item.symbol,
            tradingSymbol: item.name || displayName,
            displayName,
            type: instType,
            exchange: item.exchange,
            contractExpiry: item.expiry,
            expiry: item.expiry,
            lotSize: item.lot_size,
            token: item.token,
            segment: item.segment,
        }
        onSelectInstrument(inst)
    }

    if (!result.groups || result.groups.length === 0) {
        return (
            <div style={{ padding: '16px', textAlign: 'center', color: '#7d848c', fontSize: '13px' }}>
                No instruments found
            </div>
        )
    }

    return (
        <div data-lenis-prevent style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '6px 0' }}>
            {result.groups.map((group: SearchListGroup) => {
                if (!group.items || group.items.length === 0) return null

                return (
                    <div key={group.group} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {/* Group Header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 10px',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#7d848c', letterSpacing: '0.08em' }}>
                                {group.group}
                            </span>
                            <span style={{ fontSize: '10px', color: '#4a5056', fontWeight: 600 }}>
                                ({group.items.length})
                            </span>
                        </div>

                        {/* Group Items */}
                        {group.items.map((item: SearchListItem) => {
                            const itemIndex = globalIndexCounter++
                            const isActive = itemIndex === activeIndex
                            const itemType = item.instrument_type || (group.group === 'FUTURES' ? 'futures' : group.group === 'OPTIONS' ? 'options' : 'equity')
                            const badge = getTypeColor(itemType)
                            const isOptionFamily = group.group === 'OPTIONS' && item.is_family

                            return (
                                <div
                                    key={`${group.group}-${item.symbol}-${item.exchange}-${item.token || itemIndex}`}
                                    id={`search-item-${itemIndex}`}
                                    onMouseEnter={() => onHoverIndex(itemIndex)}
                                    onClick={() => {
                                        if (isOptionFamily) {
                                            onOpenOptionChain(item.symbol, item.exchange)
                                        } else {
                                            handleItemClick(item)
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        background: isActive ? 'rgba(168,85,247,0.12)' : 'transparent',
                                        border: `1px solid ${isActive ? 'rgba(168,85,247,0.3)' : 'transparent'}`,
                                        cursor: 'pointer',
                                        transition: 'background 0.1s ease',
                                    }}
                                >
                                    {/* Left side: Symbol + Name */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
                                                {item.symbol}
                                            </span>
                                            {item.label && (
                                                <span
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        color: getFuturesLabelColor(item.label),
                                                        background: `${getFuturesLabelColor(item.label)}18`,
                                                        padding: '1px 6px',
                                                        borderRadius: '3px',
                                                    }}
                                                >
                                                    {item.label}
                                                </span>
                                            )}
                                            {item.expiry && !item.is_family && (
                                                <span style={{ fontSize: '11px', color: '#a0a6ac', fontFamily: 'Consolas, monospace' }}>
                                                    {item.expiry}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#7d848c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.name}
                                        </div>
                                    </div>

                                    {/* Right side: Action / Badges */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isOptionFamily ? (
                                            <button
                                                id={`open-chain-btn-${item.symbol}`}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onOpenOptionChain(item.symbol, item.exchange)
                                                }}
                                                style={{
                                                    padding: '4px 10px',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    borderRadius: '4px',
                                                    background: 'rgba(74,159,212,0.18)',
                                                    color: '#4a9fd4',
                                                    border: '1px solid rgba(74,159,212,0.35)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                Open Option Chain →
                                            </button>
                                        ) : (
                                            <>
                                                <span
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        background: badge.bg,
                                                        color: badge.text,
                                                        border: `1px solid ${badge.border}`,
                                                    }}
                                                >
                                                    {badge.label}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        padding: '2px 5px',
                                                        borderRadius: '3px',
                                                        background: 'rgba(255,255,255,0.05)',
                                                        color: '#7d848c',
                                                    }}
                                                >
                                                    {item.exchange}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
