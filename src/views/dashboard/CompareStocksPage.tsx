'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import Badge from '@/src/components/dashboard/ui/Badge'
import { COMPARE_TABS, STOCK_DB, METRIC_DATA } from '@/src/data/dashboard/compare-stocks'

export default function DashboardCompareStocksPage() {
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<string[]>(['RELIANCE', 'TCS'])
    const [tab, setTab] = useState('fundamentals')

    const suggestions = Object.keys(STOCK_DB).filter(t =>
        t.includes(search.toUpperCase()) || STOCK_DB[t].name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5)

    const addStock = (ticker: string) => {
        if (selected.length >= 3 || selected.includes(ticker)) return
        setSelected(s => [...s, ticker])
        setSearch('')
    }

    const removeStock = (ticker: string) => setSelected(s => s.filter(x => x !== ticker))

    const metrics = METRIC_DATA[tab] ?? {}

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }}>

            <div>
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--db-text)' }}>Compare Stocks</h1>
                <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', marginTop: '4px' }}>
                    Compare up to 3 stocks side-by-side across fundamentals, technicals, and financials.
                </p>
            </div>

            {/* ── Stock Picker ── */}
            <div className="db-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Selected stocks */}
                    {selected.map(ticker => (
                        <div
                            key={ticker}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'var(--db-elevated)',
                                border: '1px solid var(--db-border)',
                                borderRadius: '10px',
                                padding: '8px 12px',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--db-text)' }}>{ticker}</div>
                                <div style={{ fontSize: '10.5px', color: 'var(--db-text-muted)' }}>
                                    {STOCK_DB[ticker]?.sector} · {STOCK_DB[ticker]?.price}
                                </div>
                            </div>
                            <button
                                onClick={() => removeStock(ticker)}
                                className="db-btn db-btn-ghost db-btn-sm"
                                style={{ padding: '3px', borderRadius: '6px', color: 'var(--db-text-muted)' }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}

                    {/* Add stock */}
                    {selected.length < 3 && (
                        <div style={{ position: 'relative' }}>
                            <SearchBar value={search} onChange={setSearch} placeholder="Add stock…" width="200px" />
                            {search && suggestions.length > 0 && (
                                <div
                                    style={{
                                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                                        background: 'var(--db-elevated)',
                                        border: '1px solid var(--db-border)',
                                        borderRadius: 'var(--db-radius-md)',
                                        zIndex: 20,
                                        overflow: 'hidden',
                                        boxShadow: 'var(--db-shadow-lg)',
                                    }}
                                >
                                    {suggestions.map(ticker => (
                                        <button
                                            key={ticker}
                                            onClick={() => addStock(ticker)}
                                            className="db-nav-link"
                                            style={{ width: '100%', borderRadius: 0, padding: '10px 14px' }}
                                        >
                                            <span style={{ fontWeight: 600 }}>{ticker}</span>
                                            <span style={{ color: 'var(--db-text-muted)', fontSize: '11.5px' }}> — {STOCK_DB[ticker].name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {selected.length < 2 && (
                    <p style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                        <Plus size={11} style={{ display: 'inline' }} /> Add at least 2 stocks to compare.
                    </p>
                )}
            </div>

            {/* ── Comparison table ── */}
            {selected.length >= 2 && (
                <>
                    <FilterBar options={COMPARE_TABS} active={tab} onChange={setTab} />

                    <div className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table className="db-table" style={{ tableLayout: 'fixed' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '200px' }}>Metric</th>
                                    {selected.map(ticker => (
                                        <th key={ticker} style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                                <span style={{ color: 'var(--db-text)', fontSize: '13px', fontWeight: 700 }}>{ticker}</span>
                                                <span style={{ color: 'var(--db-text-muted)', fontSize: '10px', textTransform: 'none', letterSpacing: 0 }}>
                                                    {STOCK_DB[ticker]?.name}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(metrics).map(([metric, values]) => (
                                    <tr key={metric}>
                                        <td style={{ color: 'var(--db-text-2)', fontWeight: 450 }}>{metric}</td>
                                        {selected.map(ticker => {
                                            const val = values[ticker]
                                            const isRec = metric === 'Recommendation'
                                            const isMacd = typeof val === 'string' && ['Bullish', 'Bearish', 'Neutral'].includes(String(val))
                                            return (
                                                <td key={ticker} style={{ textAlign: 'center', fontWeight: 500, color: 'var(--db-text)' }}>
                                                    {isRec ? (
                                                        <Badge variant={val === 'Buy' ? 'success' : 'neutral'}>{String(val)}</Badge>
                                                    ) : isMacd ? (
                                                        <Badge variant={val === 'Bullish' ? 'success' : val === 'Bearish' ? 'error' : 'neutral'}>{String(val)}</Badge>
                                                    ) : (
                                                        String(val ?? '—')
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}
