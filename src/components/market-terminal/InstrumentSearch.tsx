'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useSearch } from '@/src/hooks/terminal/useSearch'
import { useDebounce } from '@/src/hooks/useDebounce'
import { Instrument } from '@/src/types/terminal'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import SearchFilters, { InstrumentTypeFilter, ExchangeFilter } from './SearchFilters'
import SearchResultSymbolCard from './SearchResultSymbolCard'
import SearchResultContractPicker from './SearchResultContractPicker'
import SearchResultList from './SearchResultList'
import { useOptionChainContext } from '@/src/context/OptionChainContext'

export default function InstrumentSearch() {
    const { setInstrument } = useInstrument()
    const { openChain } = useOptionChainContext()
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [activeIdx, setActiveIdx] = useState(0)
    const [instrumentType, setInstrumentType] = useState<InstrumentTypeFilter>('all')
    const [exchange, setExchange] = useState<ExchangeFilter>('all')
    const ref = useRef<HTMLDivElement>(null)

    // Debounce the raw input query by 250ms before triggering API search
    const debouncedQuery = useDebounce(query, 250)

    const { results, resultShape, loading } = useSearch(debouncedQuery, {
        instrumentType: instrumentType === 'all' ? undefined : instrumentType,
        exchange: exchange === 'all' ? undefined : exchange,
        delay: 0,
    })

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Auto-select on direct resolution
    useEffect(() => {
        if (resultShape.kind === 'direct_resolution') {
            const c = resultShape.data.contract
            setInstrument({
                symbol: c.symbol,
                tradingSymbol: c.trading_symbol,
                displayName: c.trading_symbol,
                type: (c.instrument_type.toLowerCase() === 'option' ? 'options' : c.instrument_type.toLowerCase()) as any,
                exchange: c.display_exchange,
                strike: c.strike ?? undefined,
                optionType: c.option_type ?? undefined,
                expiry: c.expiry ?? undefined,
                token: c.token,
                segment: c.segment,
                lotSize: c.lot_size,
            })
            setQuery('')
            setOpen(false)
        }
    }, [resultShape, setInstrument])

    const handleSelect = (inst: Instrument) => {
        setInstrument(inst)
        setQuery('')
        setOpen(false)
    }

    const handleOpenOptionChain = (symbol: string, exch: string) => {
        // 1. Select the underlying instrument (equity/index)
        setInstrument({
            symbol,
            displayName: symbol,
            type: 'equity',
            exchange: exch,
        })
        // 2. Open the popup modal (fetch fires automatically on mount)
        openChain()
        // 3. Close search dropdown
        setQuery('')
        setOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIdx((prev) => prev + 1)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIdx((prev) => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (results.length > 0 && results[activeIdx]) {
                const r = results[activeIdx]
                handleSelect({
                    symbol: r.symbol,
                    tradingSymbol: (r as any).trading_symbol || r.name || r.symbol,
                    displayName: r.name || r.symbol,
                    type: r.instrument_type,
                    exchange: r.exchange,
                    strike: r.strike,
                    optionType: r.option_type,
                    expiry: r.expiry,
                    token: r.token,
                    segment: r.segment,
                    lotSize: r.lot_size,
                })
            }
        } else if (e.key === 'Escape') {
            setOpen(false)
        }
    }

    const hasDropdown = open && query.trim().length > 0 && (
        resultShape.kind === 'search_list' ||
        resultShape.kind === 'symbol_card' ||
        resultShape.kind === 'contract_picker' ||
        (resultShape.kind === 'empty' && !loading)
    )

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
            {/* Search card with reusable SearchBar component */}
            <div style={{
                display: 'flex', flexDirection: 'column',
                borderRadius: '8px',
                background: '#0a0c0e',
                border: '1px solid var(--db-border, rgba(255,255,255,0.12))',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <SearchBar
                        id="instrument-search-input"
                        value={query}
                        onChange={(val) => {
                            setQuery(val)
                            setOpen(true)
                            setActiveIdx(0)
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search symbol, contract… (e.g. RELIANCE, NIFTY 25000 CE)"
                        variant="default"
                        containerStyle={{
                            background: 'transparent',
                            border: 'none',
                            width: '100%',
                        }}
                        inputStyle={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12.5px',
                            fontFamily: 'Consolas, monospace',
                        }}
                        iconColor="#7d848c"
                        iconSize={15}
                    />
                    {loading && (
                        <span style={{
                            position: 'absolute',
                            right: query ? '36px' : '12px',
                            fontSize: '10px',
                            color: '#a855f7',
                            fontWeight: 600,
                            pointerEvents: 'none',
                        }}>
                            …
                        </span>
                    )}
                </div>

                {/* Filters — always visible */}
                <div style={{ padding: '0 12px 6px' }}>
                    <SearchFilters
                        instrumentType={instrumentType}
                        exchange={exchange}
                        onInstrumentTypeChange={setInstrumentType}
                        onExchangeChange={setExchange}
                    />
                </div>
            </div>

            {/* Dropdown */}
            {hasDropdown && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0, right: 0,
                    zIndex: 99,
                    background: '#111417',
                    border: '1px solid var(--db-border, rgba(255,255,255,0.15))',
                    borderRadius: '8px',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
                    maxHeight: '380px',
                    overflowY: 'auto',
                }}>
                    {/* Search list result */}
                    {resultShape.kind === 'search_list' && (
                        <SearchResultList
                            result={resultShape.data}
                            activeIndex={activeIdx}
                            onSelectInstrument={handleSelect}
                            onOpenOptionChain={handleOpenOptionChain}
                            onHoverIndex={setActiveIdx}
                        />
                    )}

                    {/* Symbol card result */}
                    {resultShape.kind === 'symbol_card' && (
                        <SearchResultSymbolCard
                            card={resultShape.data}
                            onSelect={handleSelect}
                        />
                    )}

                    {/* Contract picker result */}
                    {resultShape.kind === 'contract_picker' && (
                        <SearchResultContractPicker
                            result={resultShape.data}
                            activeIdx={activeIdx}
                            onSelect={handleSelect}
                            onHover={setActiveIdx}
                        />
                    )}

                    {/* Empty state */}
                    {resultShape.kind === 'empty' && query.trim().length > 1 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#7d848c', fontSize: '12px' }}>
                            No instruments found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
