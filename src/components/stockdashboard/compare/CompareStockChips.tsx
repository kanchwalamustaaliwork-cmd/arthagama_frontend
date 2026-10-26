/**
 * src/components/stockdashboard/compare/CompareStockChips.tsx
 *
 * Selected stock chips bar with remove capability and quick stock search adder.
 */

'use client'

import React, { useState } from 'react'
import { X, Plus, Search } from 'lucide-react'
import { MOCK_INSTRUMENTS } from '@/src/mocks/stockdashboard/instruments.mock'

interface CompareChipsProps {
    selectedSymbols: string[]
    onAddStock: (symbol: string) => void
    onRemoveStock: (symbol: string) => void
}

export function CompareStockChips({
    selectedSymbols,
    onAddStock,
    onRemoveStock,
}: CompareChipsProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const availableSuggestions = MOCK_INSTRUMENTS.filter(
        i =>
            !selectedSymbols.includes(i.symbol) &&
            (searchQuery === '' ||
                i.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5)

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
            }}
        >
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text-muted, #708482)' }}>
                Comparing ({selectedSymbols.length}/4):
            </span>

            {/* Selected Chips */}
            {selectedSymbols.map(sym => (
                <div
                    key={sym}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'var(--db-elevated, #20353A)',
                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.18))',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--db-text, #F7FAF9)',
                    }}
                >
                    <span style={{ color: 'var(--db-mint, #B8CEC2)' }}>{sym}</span>
                    {selectedSymbols.length > 1 && (
                        <button
                            onClick={() => onRemoveStock(sym)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--db-text-muted, #708482)',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title={`Remove ${sym}`}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            ))}

            {/* Add Stock Selector */}
            {selectedSymbols.length < 4 && (
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'var(--db-elevated, #20353A)',
                            border: '1px dashed var(--db-border, rgba(184, 206, 194, 0.25))',
                            borderRadius: '8px',
                            padding: '4px 10px',
                        }}
                    >
                        <Search size={13} color="var(--db-text-muted, #708482)" />
                        <input
                            type="text"
                            placeholder="Add stock…"
                            value={searchQuery}
                            onChange={e => {
                                setSearchQuery(e.target.value)
                                setIsDropdownOpen(true)
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--db-text, #F7FAF9)',
                                fontSize: '12.5px',
                                width: '100px',
                            }}
                        />
                    </div>

                    {isDropdownOpen && availableSuggestions.length > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 4px)',
                                left: 0,
                                zIndex: 50,
                                width: '220px',
                                background: 'var(--db-surface, #18282C)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
                                borderRadius: '8px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                padding: '4px',
                            }}
                        >
                            {availableSuggestions.map(s => (
                                <div
                                    key={s.symbol}
                                    onClick={() => {
                                        onAddStock(s.symbol)
                                        setSearchQuery('')
                                        setIsDropdownOpen(false)
                                    }}
                                    style={{
                                        padding: '6px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '12.5px',
                                    }}
                                >
                                    <span style={{ fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>{s.symbol}</span>
                                    <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>{s.sector}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
