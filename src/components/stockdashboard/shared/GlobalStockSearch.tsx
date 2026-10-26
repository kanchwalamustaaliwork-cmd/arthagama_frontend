/**
 * src/components/stockdashboard/shared/GlobalStockSearch.tsx
 *
 * Universal stock search component with debounced autocomplete,
 * exchange pill filter, keyboard navigation, loading indicator,
 * and direct routing to /admin/stockdashboard/stocks/:exchange/:symbol.
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import { StockIdentity } from '@/src/types/stockdashboard'
import { useStockSearch } from '@/src/hooks/stockdashboard/useStockSearch'

interface GlobalStockSearchProps {
    placeholder?: string
    exchangeFilter?: boolean
    width?: string | number
    onSelect?: (stock: StockIdentity) => void
    variant?: 'default' | 'compact' | 'hero'
}

export function GlobalStockSearch({
    placeholder = 'Search stocks by name or symbol (e.g. RELIANCE, TCS, HDFCBANK)…',
    exchangeFilter = true,
    width = '100%',
    onSelect,
    variant = 'default',
}: GlobalStockSearchProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const {
        query,
        setQuery,
        exchange,
        setExchange,
        results,
        loading,
        selectedIndex,
        setSelectedIndex,
        handleKeyDown,
        clearSearch,
    } = useStockSearch('ALL')

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectStock = (stock: StockIdentity) => {
        setIsOpen(false)
        clearSearch()
        if (onSelect) {
            onSelect(stock)
        } else {
            router.push(`/admin/stockdashboard/stocks/${stock.exchange.toLowerCase()}/${stock.symbol}`)
        }
    }

    const isHero = variant === 'hero'

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width,
                maxWidth: '680px',
            }}
        >
            {/* Search Input Bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                    borderRadius: isHero ? '12px' : '8px',
                    padding: isHero ? '12px 16px' : '8px 12px',
                    gap: '10px',
                    boxShadow: isHero ? '0 8px 24px rgba(0, 0, 0, 0.35)' : 'none',
                    transition: 'border-color 0.18s ease',
                }}
            >
                <Search size={isHero ? 18 : 16} color="var(--db-text-muted, #708482)" />

                <input
                    type="text"
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={e => handleKeyDown(e, handleSelectStock)}
                    placeholder={placeholder}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--db-text, #F7FAF9)',
                        fontSize: isHero ? '14.5px' : '13px',
                        fontFamily: 'inherit',
                    }}
                />

                {loading && (
                    <Loader2
                        size={14}
                        color="var(--db-mint, #B8CEC2)"
                        className="animate-spin"
                        style={{ animation: 'spin 1s linear infinite' }}
                    />
                )}

                {query && (
                    <button
                        onClick={clearSearch}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--db-text-muted, #708482)',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        aria-label="Clear search"
                    >
                        <X size={14} />
                    </button>
                )}

                {exchangeFilter && (
                    <div
                        style={{
                            display: 'flex',
                            gap: '4px',
                            borderLeft: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                            paddingLeft: '8px',
                        }}
                    >
                        {(['ALL', 'NSE', 'BSE'] as const).map(ex => (
                            <button
                                key={ex}
                                onClick={() => setExchange(ex)}
                                style={{
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    fontSize: '10.5px',
                                    fontWeight: 600,
                                    background: exchange === ex ? 'var(--db-teal, #244147)' : 'transparent',
                                    color: exchange === ex ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Dropdown Suggestions */}
            {isOpen && query.trim().length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        background: 'var(--db-surface, #18282C)',
                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.18))',
                        borderRadius: '10px',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
                        maxHeight: '340px',
                        overflowY: 'auto',
                    }}
                >
                    {results.length > 0 ? (
                        <div style={{ padding: '6px' }}>
                            {results.map((stock, idx) => {
                                const isSelected = idx === selectedIndex
                                return (
                                    <div
                                        key={`${stock.exchange}-${stock.symbol}`}
                                        onClick={() => handleSelectStock(stock)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            background: isSelected ? 'var(--db-elevated, #20353A)' : 'transparent',
                                            transition: 'background 0.12s ease',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span
                                                style={{
                                                    fontSize: '10.5px',
                                                    fontWeight: 700,
                                                    padding: '2px 5px',
                                                    borderRadius: '4px',
                                                    background: 'rgba(184, 206, 194, 0.12)',
                                                    color: 'var(--db-mint, #B8CEC2)',
                                                }}
                                            >
                                                {stock.exchange}
                                            </span>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                                    {stock.symbol}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                                                    {stock.name} • {stock.sector}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span
                                                style={{
                                                    fontSize: '10.5px',
                                                    color: 'var(--db-text-muted, #708482)',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                {stock.marketCapCategory}
                                            </span>
                                            <ArrowRight size={13} color="var(--db-mint, #B8CEC2)" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : !loading ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--db-text-muted, #708482)', fontSize: '13px' }}>
                            No instruments matching &ldquo;{query}&rdquo;
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
