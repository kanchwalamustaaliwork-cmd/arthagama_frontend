/**
 * src/views/admin/stockdashboard/WatchlistsPortfolioView.tsx
 *
 * View for custom Watchlists and simulated institutional portfolio holdings.
 */

'use client'

import React, { useState } from 'react'
import { Bookmark, Plus, Trash2, Shield } from 'lucide-react'
import { useWatchlists } from '@/src/hooks/stockdashboard/useWatchlists'
import { WatchlistTable } from '@/src/components/stockdashboard/watchlists/WatchlistTable'
import { PortfolioSection } from '@/src/components/stockdashboard/watchlists/PortfolioSection'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

export default function WatchlistsPortfolioView() {
    const {
        watchlists,
        activeWatchlist,
        activeWatchlistId,
        setActiveWatchlistId,
        watchlistQuotes,
        portfolioSummary,
        portfolioHoldings,
        loading,
        createWatchlist,
        deleteWatchlist,
        removeStock,
    } = useWatchlists()

    const [isCreating, setIsCreating] = useState(false)
    const [newWatchlistName, setNewWatchlistName] = useState('')

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newWatchlistName.trim()) return
        createWatchlist(newWatchlistName)
        setNewWatchlistName('')
        setIsCreating(false)
    }

    if (loading) {
        return <TableSkeleton rows={6} cols={6} />
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Watchlist Section */}
            <div>
                {/* Watchlist Controls Header */}
                <div
                    style={{
                        background: 'var(--db-surface, #18282C)',
                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        marginBottom: '16px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bookmark size={18} color="var(--db-mint, #B8CEC2)" />
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                                Equity Watchlists
                            </h2>
                            <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '2px 0 0 0' }}>
                                Manage monitored ticker baskets with real-time simulated quote telemetry.
                            </p>
                        </div>
                    </div>

                    {/* Switcher & Create Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '4px', background: 'var(--db-elevated, #20353A)', padding: '3px', borderRadius: '8px' }}>
                            {watchlists.map(w => {
                                const isSelected = w.id === activeWatchlistId
                                return (
                                    <button
                                        key={w.id}
                                        onClick={() => setActiveWatchlistId(w.id)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            background: isSelected ? 'var(--db-teal, #244147)' : 'transparent',
                                            color: isSelected ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        {w.name} ({w.stockSymbols.length})
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            onClick={() => setIsCreating(true)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: 'var(--db-teal, #244147)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
                                color: 'var(--db-mint, #B8CEC2)',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <Plus size={14} /> New Basket
                        </button>

                        {activeWatchlist && !activeWatchlist.isDefault && (
                            <button
                                onClick={() => deleteWatchlist(activeWatchlist.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--db-loss, #E35D6A)',
                                    cursor: 'pointer',
                                    padding: '6px',
                                }}
                                title="Delete current watchlist"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Create Watchlist Modal / Form */}
                {isCreating && (
                    <form
                        onSubmit={handleCreateSubmit}
                        style={{
                            background: 'var(--db-elevated, #20353A)',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
                            borderRadius: '12px',
                            padding: '14px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '16px',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter watchlist name (e.g. Dividend Aristocrats)…"
                            value={newWatchlistName}
                            onChange={e => setNewWatchlistName(e.target.value)}
                            autoFocus
                            style={{
                                flex: 1,
                                background: 'var(--db-surface, #18282C)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                color: 'var(--db-text, #F7FAF9)',
                                fontSize: '13px',
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                background: 'var(--db-mint, #B8CEC2)',
                                color: 'var(--db-teal, #244147)',
                                border: 'none',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Save Basket
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                background: 'transparent',
                                color: 'var(--db-text-muted, #708482)',
                                border: 'none',
                                fontSize: '12.5px',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                )}

                {/* Active Watchlist Table */}
                <WatchlistTable
                    quotes={watchlistQuotes}
                    onRemove={removeStock}
                />
            </div>

            {/* Portfolio Section */}
            <PortfolioSection
                summary={portfolioSummary}
                holdings={portfolioHoldings}
            />
        </div>
    )
}
