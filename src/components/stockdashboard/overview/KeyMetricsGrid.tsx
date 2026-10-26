/**
 * src/components/stockdashboard/overview/KeyMetricsGrid.tsx
 *
 * Financial Ratios section for Stock Overview.
 * Displays fixed default ratios, customizable user-added ratios,
 * inline "Add ratio to table" search autocomplete, and "EDIT RATIOS" modal.
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Sliders, X, Search } from 'lucide-react'
import { KeyFinancialMetrics, StockQuote, CompanyProfile } from '@/src/types/stockdashboard'
import {
    DEFAULT_RATIO_DEFINITIONS,
    AVAILABLE_RATIOS_CATALOGUE,
    RatioCatalogueItem,
} from '@/src/mocks/stockdashboard/available-ratios.mock'
import { EditRatiosModal } from './EditRatiosModal'

const STORAGE_KEY = 'arthagama_stock_added_ratios'

interface KeyMetricsGridProps {
    metrics: KeyFinancialMetrics
    quote?: StockQuote
    profile?: CompanyProfile
}

export function KeyMetricsGrid({ metrics, quote, profile }: KeyMetricsGridProps) {
    const [addedMetricIds, setAddedMetricIds] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)
    const searchContainerRef = useRef<HTMLDivElement>(null)

    // Load persisted user-added metrics from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) {
                    // Filter to only valid catalogue IDs
                    const validIds = parsed.filter(id =>
                        AVAILABLE_RATIOS_CATALOGUE.some(item => item.id === id)
                    )
                    setAddedMetricIds(validIds)
                }
            }
        } catch {
            // LocalStorage fallback
        } finally {
            setIsHydrated(true)
        }
    }, [])

    // Save user-added metrics to localStorage whenever updated
    const persistAddedMetricIds = (ids: string[]) => {
        setAddedMetricIds(ids)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
        } catch {
            // Ignored
        }
    }

    // Close search dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Add a ratio from the dropdown
    const handleAddRatio = (id: string) => {
        if (!addedMetricIds.includes(id)) {
            const next = [...addedMetricIds, id]
            persistAddedMetricIds(next)
        }
        setSearchQuery('')
        setIsDropdownOpen(false)
    }

    // Remove user-added ratio
    const handleRemoveRatio = (id: string) => {
        const next = addedMetricIds.filter(item => item !== id)
        persistAddedMetricIds(next)
    }

    // Restore defaults
    const handleRestoreDefaults = () => {
        persistAddedMetricIds([])
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch {
            // Ignored
        }
    }

    // Filter available catalogue for the search dropdown
    const matchingCatalogue = AVAILABLE_RATIOS_CATALOGUE.filter(item => {
        const isAlreadyAdded = addedMetricIds.includes(item.id)
        const matchesQuery =
            searchQuery.trim() === '' ||
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        return !isAlreadyAdded && matchesQuery
    })

    // Prepare displayed list: default metrics first, followed by user-added metrics
    const userAddedDefinitions: RatioCatalogueItem[] = addedMetricIds
        .map(id => AVAILABLE_RATIOS_CATALOGUE.find(item => item.id === id))
        .filter((item): item is RatioCatalogueItem => Boolean(item))

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '20px',
            }}
        >
            {/* Top Bar: Section Title + Add Ratio Search + Edit Ratios Button */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    marginBottom: '16px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--db-mint, #B8CEC2)', margin: 0 }}>
                        Key Financial Ratios
                    </h4>
                    {isHydrated && addedMetricIds.length > 0 && (
                        <span
                            style={{
                                fontSize: '11px',
                                padding: '2px 7px',
                                borderRadius: '999px',
                                background: 'rgba(184, 206, 194, 0.12)',
                                color: 'var(--db-mint, #B8CEC2)',
                                fontWeight: 600,
                            }}
                        >
                            +{addedMetricIds.length} Custom
                        </span>
                    )}
                </div>

                {/* Right controls: "Add ratio to table" input + "EDIT RATIOS" button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Search Input for Quick Add */}
                    <div ref={searchContainerRef} style={{ position: 'relative' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--db-elevated, #20353A)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.18))',
                                borderRadius: '8px',
                                padding: '5px 12px',
                                width: '230px',
                            }}
                        >
                            <Search size={13} color="var(--db-text-muted, #708482)" />
                            <input
                                type="text"
                                placeholder="Add ratio to table…"
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
                                    fontSize: '12px',
                                    width: '100%',
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--db-text-muted, #708482)',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                    }}
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Results */}
                        {isDropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 4px)',
                                    left: 0,
                                    right: 0,
                                    zIndex: 100,
                                    background: 'var(--db-surface, #18282C)',
                                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
                                    borderRadius: '10px',
                                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
                                    maxHeight: '260px',
                                    overflowY: 'auto',
                                    padding: '6px',
                                }}
                            >
                                {matchingCatalogue.length > 0 ? (
                                    matchingCatalogue.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleAddRatio(item.id)}
                                            style={{
                                                padding: '7px 10px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                fontSize: '12px',
                                                transition: 'background 0.12s ease',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--db-elevated, #20353A)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                                    {item.label}
                                                </div>
                                                <div style={{ fontSize: '10.5px', color: 'var(--db-text-muted, #708482)' }}>
                                                    {item.category}
                                                </div>
                                            </div>
                                            <Plus size={13} color="var(--db-mint, #B8CEC2)" />
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '12px', textAlign: 'center', fontSize: '11.5px', color: 'var(--db-text-muted, #708482)' }}>
                                        {searchQuery ? `No matching ratio for "${searchQuery}"` : 'All available ratios added'}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* EDIT RATIOS Button */}
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: 'var(--db-elevated, #20353A)',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.18))',
                            color: 'var(--db-mint, #B8CEC2)',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <Sliders size={13} /> EDIT RATIOS
                    </button>
                </div>
            </div>

            {/* Financial Ratios Grid (Responsive Columns, Screener.in clean inline key-values) */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    columnGap: '32px',
                }}
            >
                {/* 1. Permanent Default Metrics */}
                {DEFAULT_RATIO_DEFINITIONS.map(item => {
                    const displayValue = item.getValue(metrics, quote, profile)
                    return (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                gap: '12px',
                                padding: '9px 0',
                                borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                            }}
                        >
                            <span style={{ fontSize: '12.5px', color: 'var(--db-text-muted, #708482)' }}>
                                {item.label}
                            </span>
                            <span
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--db-text, #F7FAF9)',
                                    fontFamily: 'Consolas, monospace',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {displayValue}
                            </span>
                        </div>
                    )
                })}

                {/* 2. User-Added Metrics (with delete action) */}
                {userAddedDefinitions.map(item => {
                    const displayValue = item.getValue(metrics, quote, profile)
                    return (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '9px 0',
                                borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                                background: 'rgba(184, 206, 194, 0.02)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12.5px', color: 'var(--db-mint, #B8CEC2)', fontWeight: 500 }}>
                                    {item.label}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--db-text, #F7FAF9)',
                                        fontFamily: 'Consolas, monospace',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {displayValue}
                                </span>
                                <button
                                    onClick={() => handleRemoveRatio(item.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--db-text-muted, #708482)',
                                        cursor: 'pointer',
                                        padding: '2px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'color 0.15s ease',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--db-loss, #E35D6A)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--db-text-muted, #708482)')}
                                    title={`Remove ${item.label}`}
                                    aria-label={`Remove ${item.label}`}
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Edit Ratios Modal */}
            <EditRatiosModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                addedMetricIds={addedMetricIds}
                onApply={persistAddedMetricIds}
                onRestoreDefaults={handleRestoreDefaults}
            />
        </div>
    )
}