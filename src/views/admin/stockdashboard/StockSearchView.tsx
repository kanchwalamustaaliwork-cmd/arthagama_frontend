/**
 * src/views/admin/stockdashboard/StockSearchView.tsx
 *
 * Dedicated search and discovery view (/admin/stockdashboard/search).
 */

'use client'

import React, { useState } from 'react'
import { GlobalStockSearch } from '@/src/components/stockdashboard/shared/GlobalStockSearch'
import { SearchResultsTable } from '@/src/components/stockdashboard/search/SearchResultsTable'
import { useStockSearch } from '@/src/hooks/stockdashboard/useStockSearch'
import { MOCK_INSTRUMENTS } from '@/src/mocks/stockdashboard/instruments.mock'

export default function StockSearchView() {
    const {
        query,
        setQuery,
        exchange,
        setExchange,
        results,
        loading,
        error,
    } = useStockSearch('ALL')

    const popularStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'TATAMOTORS', 'ITC']

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Search Header Bar */}
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--db-text, #F7FAF9)', margin: '0 0 6px 0' }}>
                        Stock Discovery &amp; Search
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>
                        Query canonical securities by trading ticker, official legal name, or ISIN across NSE and BSE.
                    </p>
                </div>

                <div style={{ maxWidth: '640px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Type company or symbol (e.g. RELIANCE, Tata Motors, Infosys)…"
                            style={{
                                flex: 1,
                                background: 'var(--db-elevated, #20353A)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.18))',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                color: 'var(--db-text, #F7FAF9)',
                                fontSize: '13.5px',
                                outline: 'none',
                            }}
                        />

                        {/* Exchange Pills */}
                        <div style={{ display: 'flex', gap: '4px', background: 'var(--db-elevated, #20353A)', padding: '3px', borderRadius: '8px' }}>
                            {(['ALL', 'NSE', 'BSE'] as const).map(ex => (
                                <button
                                    key={ex}
                                    onClick={() => setExchange(ex)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '11.5px',
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
                    </div>
                </div>

                {/* Popular Tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--db-text-muted, #708482)' }}>Quick Tags:</span>
                    {popularStocks.map(sym => (
                        <button
                            key={sym}
                            onClick={() => setQuery(sym)}
                            style={{
                                padding: '3px 9px',
                                borderRadius: '6px',
                                background: 'var(--db-elevated, #20353A)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                                color: 'var(--db-mint, #B8CEC2)',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{ padding: '16px', background: 'var(--db-loss-bg, rgba(227, 93, 106, 0.1))', border: '1px solid var(--db-loss, #E35D6A)', borderRadius: '12px', color: 'var(--db-loss, #E35D6A)', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            {/* Results Table */}
            <SearchResultsTable
                results={results}
                loading={loading}
                query={query}
            />
        </div>
    )
}
