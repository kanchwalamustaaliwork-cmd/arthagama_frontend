/**
 * src/components/stockdashboard/fundamentals/PeerComparison.tsx
 *
 * Peer Comparison table for the Stock Fundamentals tab.
 * Compares the selected stock against industry peers with horizontally scrolling
 * metric columns and a sticky company name column.
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
    Users2,
    Plus,
    X,
    Search,
    ChevronDown,
    Building2,
    Info,
} from 'lucide-react'
import { PeerCompanyMetricData } from '@/src/types/stockdashboard'
import { usePeerComparison } from '@/src/hooks/stockdashboard/usePeerComparison'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

interface PeerComparisonProps {
    exchange: string
    symbol: string
}

type MetricCategory = 'overview' | 'valuation' | 'profitability' | 'growth' | 'health_ownership' | 'all'

interface ColumnDef {
    id: string
    label: string
    unit?: string
    category: MetricCategory
    align?: 'left' | 'right'
    getValue: (c: PeerCompanyMetricData) => string
    getHighlight?: (c: PeerCompanyMetricData) => 'positive' | 'negative' | 'neutral'
}

export function PeerComparison({ exchange, symbol }: PeerComparisonProps) {
    const {
        data,
        loading,
        error,
        displayedCompanies,
        availableToAdd,
        addPeer,
        removePeer,
        canAddMore,
        maxCompanies,
    } = usePeerComparison(exchange, symbol)

    const [activeCategory, setActiveCategory] = useState<MetricCategory>('overview')
    const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const addDropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (addDropdownRef.current && !addDropdownRef.current.contains(e.target as Node)) {
                setIsAddDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (loading) {
        return <TableSkeleton rows={5} cols={8} />
    }

    if (error || !data) {
        return (
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    borderRadius: '16px',
                    padding: '24px',
                    color: 'var(--db-text-muted, #708482)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                }}
            >
                <Info size={16} color="var(--db-text-muted, #708482)" />
                {error || 'Peer comparison data is currently unavailable for this instrument.'}
            </div>
        )
    }

    // Helper formatters
    const fmtNum = (val: number | null | undefined, decimals = 2, prefix = '', suffix = '') => {
        if (val === null || val === undefined) return '—'
        return `${prefix}${val.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })}${suffix}`
    }

    const fmtPct = (val: number | null | undefined) => {
        if (val === null || val === undefined) return '—'
        const sign = val > 0 ? '+' : ''
        return `${sign}${val.toFixed(2)}%`
    }

    const fmtRatio = (val: number | null | undefined) => {
        if (val === null || val === undefined) return '—'
        return val.toFixed(2)
    }

    // Comprehensive column definitions
    const allColumns: ColumnDef[] = [
        // ── Overview & Valuation ──
        {
            id: 'cmp',
            label: 'CMP',
            unit: '₹',
            category: 'valuation',
            getValue: c => fmtNum(c.cmp, 2, '₹'),
        },
        {
            id: 'pe',
            label: 'P/E',
            unit: 'x',
            category: 'valuation',
            getValue: c => fmtRatio(c.pe),
        },
        {
            id: 'marketCap',
            label: 'Market Cap',
            unit: '₹ Cr',
            category: 'valuation',
            getValue: c => fmtNum(c.marketCapCr, 2),
        },
        {
            id: 'divYield',
            label: 'Div. Yield',
            unit: '%',
            category: 'valuation',
            getValue: c => (c.divYieldPct !== null ? `${c.divYieldPct.toFixed(2)}%` : '—'),
        },
        {
            id: 'pb',
            label: 'P/B',
            unit: 'x',
            category: 'valuation',
            getValue: c => fmtRatio(c.pb),
        },
        {
            id: 'bookValue',
            label: 'Book Value',
            unit: '₹',
            category: 'valuation',
            getValue: c => fmtNum(c.bookValue, 2, '₹'),
        },

        // ── Profitability ──
        {
            id: 'netProfit',
            label: 'Net Profit (Qtr)',
            unit: '₹ Cr',
            category: 'profitability',
            getValue: c => fmtNum(c.netProfitCr, 2),
            getHighlight: c => (c.netProfitCr !== null && c.netProfitCr < 0 ? 'negative' : 'neutral'),
        },
        {
            id: 'profitGrowth',
            label: 'Profit Growth',
            unit: '%',
            category: 'profitability',
            getValue: c => fmtPct(c.profitGrowthPct),
            getHighlight: c => {
                if (c.profitGrowthPct === null) return 'neutral'
                return c.profitGrowthPct >= 0 ? 'positive' : 'negative'
            },
        },
        {
            id: 'roce',
            label: 'ROCE',
            unit: '%',
            category: 'profitability',
            getValue: c => (c.rocePct !== null ? `${c.rocePct.toFixed(2)}%` : '—'),
        },
        {
            id: 'roe',
            label: 'ROE',
            unit: '%',
            category: 'profitability',
            getValue: c => (c.roePct !== null ? `${c.roePct.toFixed(2)}%` : '—'),
        },
        {
            id: 'opm',
            label: 'OPM',
            unit: '%',
            category: 'profitability',
            getValue: c => (c.opmPct !== null ? `${c.opmPct.toFixed(2)}%` : '—'),
        },
        {
            id: 'npm',
            label: 'NPM',
            unit: '%',
            category: 'profitability',
            getValue: c => (c.npmPct !== null ? `${c.npmPct.toFixed(2)}%` : '—'),
        },

        // ── Revenue & Growth ──
        {
            id: 'sales',
            label: 'Sales (Qtr)',
            unit: '₹ Cr',
            category: 'growth',
            getValue: c => fmtNum(c.salesCr, 2),
        },
        {
            id: 'salesGrowth',
            label: 'Sales Growth',
            unit: '%',
            category: 'growth',
            getValue: c => fmtPct(c.salesGrowthPct),
            getHighlight: c => {
                if (c.salesGrowthPct === null) return 'neutral'
                return c.salesGrowthPct >= 0 ? 'positive' : 'negative'
            },
        },
        {
            id: 'annRevGrowth',
            label: 'Ann. Rev Growth',
            unit: '%',
            category: 'growth',
            getValue: c => fmtPct(c.annualRevenueGrowthPct),
        },
        {
            id: 'annProfitGrowth',
            label: 'Ann. Profit Growth',
            unit: '%',
            category: 'growth',
            getValue: c => fmtPct(c.annualProfitGrowthPct),
        },
        {
            id: 'epsGrowth',
            label: 'EPS Growth',
            unit: '%',
            category: 'growth',
            getValue: c => fmtPct(c.epsGrowthPct),
        },

        // ── Financial Health & Ownership ──
        {
            id: 'debtToEquity',
            label: 'Debt / Equity',
            unit: 'x',
            category: 'health_ownership',
            getValue: c => fmtRatio(c.debtToEquity),
        },
        {
            id: 'currentRatio',
            label: 'Current Ratio',
            unit: 'x',
            category: 'health_ownership',
            getValue: c => fmtRatio(c.currentRatio),
        },
        {
            id: 'interestCoverage',
            label: 'Interest Coverage',
            unit: 'x',
            category: 'health_ownership',
            getValue: c => fmtRatio(c.interestCoverage),
        },
        {
            id: 'promoterHolding',
            label: 'Promoter Holding',
            unit: '%',
            category: 'health_ownership',
            getValue: c => (c.promoterHoldingPct !== null ? `${c.promoterHoldingPct.toFixed(2)}%` : '—'),
        },
        {
            id: 'promoterPledging',
            label: 'Promoter Pledging',
            unit: '%',
            category: 'health_ownership',
            getValue: c => (c.promoterPledgingPct !== null ? `${c.promoterPledgingPct.toFixed(2)}%` : '—'),
            getHighlight: c => (c.promoterPledgingPct !== null && c.promoterPledgingPct > 0 ? 'negative' : 'neutral'),
        },
    ]

    // Filter columns based on active category
    const activeColumns = allColumns.filter(col => {
        if (activeCategory === 'all') return true
        if (activeCategory === 'overview') {
            // Selected key metrics matching the exact prompt table
            return ['cmp', 'pe', 'marketCap', 'divYield', 'netProfit', 'profitGrowth', 'sales', 'salesGrowth', 'roce'].includes(col.id)
        }
        return col.category === activeCategory
    })

    // Search filter for add peer dropdown
    const filteredAvailablePeers = availableToAdd.filter(p => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return true
        return p.symbol.toLowerCase().includes(query) || p.name.toLowerCase().includes(query)
    })

    const categories: { id: MetricCategory; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'valuation', label: 'Valuation' },
        { id: 'profitability', label: 'Profitability' },
        { id: 'growth', label: 'Revenue & Growth' },
        { id: 'health_ownership', label: 'Health & Ownership' },
        { id: 'all', label: 'All Metrics' },
    ]

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}
        >
            {/* Header: Title, Sector/Industry info, Category Switcher, Add Peer dropdown */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                }}
            >
                {/* Left: Title & Industry Context */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users2 size={16} color="var(--db-mint, #B8CEC2)" />
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                            Peer Comparison
                        </h3>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: 'rgba(184, 206, 194, 0.12)',
                                color: 'var(--db-mint, #B8CEC2)',
                            }}
                        >
                            {displayedCompanies.length} / {maxCompanies} Companies
                        </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '4px 0 0 0' }}>
                        Sector: <strong style={{ color: 'var(--db-text-2, #A5B7B3)' }}>{data.sector}</strong> • Industry:{' '}
                        <strong style={{ color: 'var(--db-text-2, #A5B7B3)' }}>{data.industry}</strong>
                    </p>
                </div>

                {/* Right: Add Peer Search Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div ref={addDropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                            disabled={!canAddMore}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: canAddMore ? 'var(--db-teal, #244147)' : 'rgba(32, 53, 58, 0.4)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.18))',
                                color: canAddMore ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                cursor: canAddMore ? 'pointer' : 'not-allowed',
                                transition: 'all 0.15s ease',
                            }}
                            title={canAddMore ? 'Add industry peer' : `Maximum ${maxCompanies} companies reached`}
                        >
                            <Plus size={13} />
                            <span>Add Peer</span>
                            <ChevronDown size={13} />
                        </button>

                        {/* Add Peer Dropdown Menu */}
                        {isAddDropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 6px)',
                                    right: 0,
                                    width: '280px',
                                    background: 'var(--db-surface, #18282C)',
                                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
                                    borderRadius: '12px',
                                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
                                    zIndex: 100,
                                    padding: '8px',
                                }}
                            >
                                {/* Search input inside dropdown */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'var(--db-elevated, #20353A)',
                                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                        borderRadius: '6px',
                                        padding: '5px 8px',
                                        marginBottom: '6px',
                                    }}
                                >
                                    <Search size={12} color="var(--db-text-muted, #708482)" />
                                    <input
                                        type="text"
                                        placeholder="Search peer in industry…"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        autoFocus
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            color: 'var(--db-text, #F7FAF9)',
                                            fontSize: '11.5px',
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
                                            }}
                                        >
                                            <X size={11} />
                                        </button>
                                    )}
                                </div>

                                {/* List of unselected peers */}
                                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    {filteredAvailablePeers.length > 0 ? (
                                        filteredAvailablePeers.map(peer => (
                                            <div
                                                key={peer.symbol}
                                                onClick={() => {
                                                    addPeer(peer.symbol)
                                                    setIsAddDropdownOpen(false)
                                                    setSearchQuery('')
                                                }}
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
                                                        {peer.symbol}
                                                    </div>
                                                    <div style={{ fontSize: '10.5px', color: 'var(--db-text-muted, #708482)' }}>
                                                        {peer.name}
                                                    </div>
                                                </div>
                                                <Plus size={13} color="var(--db-mint, #B8CEC2)" />
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '12px', textAlign: 'center', fontSize: '11.5px', color: 'var(--db-text-muted, #708482)' }}>
                                            {searchQuery ? 'No matching peers in this industry' : 'All available peers added'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Metric Category Tabs */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                {categories.map(cat => {
                    const isActive = activeCategory === cat.id
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: isActive ? 600 : 500,
                                background: isActive ? 'var(--db-teal, #244147)' : 'var(--db-elevated, #20353A)',
                                color: isActive ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.12s ease',
                            }}
                        >
                            {cat.label}
                        </button>
                    )
                })}
            </div>

            {/* Peer Comparison Table with Sticky Left Company Column */}
            <div
                style={{
                    overflowX: 'auto',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                    borderRadius: '12px',
                    position: 'relative',
                }}
            >
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '12.5px',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <thead>
                        <tr style={{ background: 'var(--db-elevated, #20353A)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))' }}>
                            {/* Sticky Company Header */}
                            <th
                                style={{
                                    padding: '12px 16px',
                                    fontWeight: 700,
                                    color: 'var(--db-text, #F7FAF9)',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 2,
                                    background: 'var(--db-elevated, #20353A)',
                                    minWidth: '220px',
                                    boxShadow: '4px 0 8px rgba(0,0,0,0.25)',
                                }}
                            >
                                Company
                            </th>

                            {/* Metric Columns Headers */}
                            {activeColumns.map(col => (
                                <th
                                    key={col.id}
                                    style={{
                                        padding: '12px 16px',
                                        fontWeight: 600,
                                        color: 'var(--db-mint, #B8CEC2)',
                                        textAlign: 'right',
                                        fontSize: '11.5px',
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    <div>{col.label}</div>
                                    {col.unit && (
                                        <div style={{ fontSize: '10px', color: 'var(--db-text-muted, #708482)', fontWeight: 400 }}>
                                            ({col.unit})
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayedCompanies.map((company, idx) => {
                            const isCurrent = company.isCurrentStock || company.symbol === symbol.toUpperCase()

                            return (
                                <tr
                                    key={company.symbol}
                                    style={{
                                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                                        background: isCurrent ? 'rgba(184, 206, 194, 0.06)' : idx % 2 === 1 ? 'rgba(32, 53, 58, 0.25)' : 'transparent',
                                        transition: 'background 0.12s ease',
                                    }}
                                >
                                    {/* Sticky Company Column */}
                                    <td
                                        style={{
                                            padding: '10px 16px',
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 1,
                                            background: isCurrent
                                                ? 'var(--db-surface, #18282C)'
                                                : idx % 2 === 1
                                                ? 'var(--db-elevated, #20353A)'
                                                : 'var(--db-surface, #18282C)',
                                            boxShadow: '4px 0 8px rgba(0,0,0,0.25)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Building2 size={13} color={isCurrent ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)'} />
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Link
                                                            href={`/admin/stockdashboard/stocks/${company.exchange.toLowerCase()}/${company.symbol}`}
                                                            style={{
                                                                color: isCurrent ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text, #F7FAF9)',
                                                                fontWeight: isCurrent ? 700 : 600,
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            {company.symbol}
                                                        </Link>
                                                        {isCurrent && (
                                                            <span
                                                                style={{
                                                                    fontSize: '9.5px',
                                                                    fontWeight: 700,
                                                                    padding: '1px 5px',
                                                                    borderRadius: '4px',
                                                                    background: 'rgba(184, 206, 194, 0.18)',
                                                                    color: 'var(--db-mint, #B8CEC2)',
                                                                    textTransform: 'uppercase',
                                                                }}
                                                            >
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '10.5px', color: 'var(--db-text-muted, #708482)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {company.name}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove Button for optional peers only */}
                                            {!isCurrent && (
                                                <button
                                                    onClick={() => removePeer(company.symbol)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--db-text-muted, #708482)',
                                                        cursor: 'pointer',
                                                        padding: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        borderRadius: '4px',
                                                        transition: 'color 0.15s ease',
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--db-loss, #E35D6A)')}
                                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--db-text-muted, #708482)')}
                                                    title={`Remove ${company.symbol} from comparison`}
                                                    aria-label={`Remove ${company.symbol}`}
                                                >
                                                    <X size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                    {/* Metric Values Columns */}
                                    {activeColumns.map(col => {
                                        const value = col.getValue(company)
                                        const highlight = col.getHighlight ? col.getHighlight(company) : 'neutral'

                                        let textColor = 'var(--db-text, #F7FAF9)'
                                        if (highlight === 'positive') textColor = 'var(--db-profit, #38D996)'
                                        if (highlight === 'negative') textColor = 'var(--db-loss, #E35D6A)'

                                        return (
                                            <td
                                                key={col.id}
                                                style={{
                                                    padding: '10px 16px',
                                                    textAlign: 'right',
                                                    fontFamily: 'Consolas, monospace',
                                                    color: textColor,
                                                    fontWeight: isCurrent ? 600 : 400,
                                                }}
                                            >
                                                {value}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
