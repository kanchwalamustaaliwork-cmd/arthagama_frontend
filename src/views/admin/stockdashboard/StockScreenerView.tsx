/**
 * src/views/admin/stockdashboard/StockScreenerView.tsx
 *
 * Dedicated stock screener view with multi-parameter filter builder,
 * preset screens, dynamic evaluation, sorting, and pagination.
 */

'use client'

import React from 'react'
import { Filter, RotateCcw, Play, BookmarkCheck } from 'lucide-react'
import { useStockScreener } from '@/src/hooks/stockdashboard/useStockScreener'
import { FilterBuilder } from '@/src/components/stockdashboard/screener/FilterBuilder'
import { ScreenerResultsTable } from '@/src/components/stockdashboard/screener/ScreenerResultsTable'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

export default function StockScreenerView() {
    const {
        fields,
        presets,
        selectedPresetId,
        rules,
        exchange,
        setExchange,
        sector,
        setSector,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        results,
        totalCount,
        loading,
        currentPage,
        setCurrentPage,
        totalPages,
        applyPreset,
        addRule,
        updateRule,
        removeRule,
        resetRules,
        executeScreen,
    } = useStockScreener()

    const handleSort = (col: any) => {
        if (sortBy === col) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortBy(col)
            setSortDirection('desc')
        }
    }

    const sectors = ['ALL', 'Information Technology', 'Financial Services', 'Energy & Retail', 'Automobile', 'Healthcare', 'Consumer Goods', 'Capital Goods', 'Telecommunication']

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Toolbar: Presets & Quick Filters */}
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
                }}
            >
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                        Institutional Stock Screener
                    </h2>
                    <p style={{ fontSize: '12.5px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
                        Screen Indian equities by fundamental ratios, technical parameters, and growth benchmarks.
                    </p>
                </div>

                {/* Presets & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Presets Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookmarkCheck size={14} color="var(--db-mint, #B8CEC2)" />
                        <select
                            value={selectedPresetId}
                            onChange={e => applyPreset(e.target.value)}
                            style={{
                                background: 'var(--db-elevated, #20353A)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                borderRadius: '8px',
                                padding: '7px 12px',
                                color: 'var(--db-text, #F7FAF9)',
                                fontSize: '12.5px',
                                outline: 'none',
                            }}
                        >
                            <option value="">Choose Screen Preset…</option>
                            {presets.map(p => (
                                <option key={p.id} value={p.id} style={{ background: '#18282C', color: '#F7FAF9' }}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sector Filter */}
                    <select
                        value={sector}
                        onChange={e => setSector(e.target.value)}
                        style={{
                            background: 'var(--db-elevated, #20353A)',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                            borderRadius: '8px',
                            padding: '7px 12px',
                            color: 'var(--db-text, #F7FAF9)',
                            fontSize: '12.5px',
                            outline: 'none',
                        }}
                    >
                        {sectors.map(sec => (
                            <option key={sec} value={sec} style={{ background: '#18282C', color: '#F7FAF9' }}>
                                Sector: {sec}
                            </option>
                        ))}
                    </select>

                    {/* Reset Button */}
                    <button
                        onClick={resetRules}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '7px 12px',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                            color: 'var(--db-text-muted, #708482)',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        <RotateCcw size={13} /> Reset
                    </button>

                    {/* Run Screen Button */}
                    <button
                        onClick={executeScreen}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 16px',
                            borderRadius: '8px',
                            background: 'var(--db-teal, #244147)',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.25))',
                            color: 'var(--db-mint, #B8CEC2)',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        <Play size={13} fill="currentColor" /> Run Screen
                    </button>
                </div>
            </div>

            {/* Filter Rules Builder */}
            <FilterBuilder
                rules={rules}
                fields={fields}
                onAddRule={addRule}
                onUpdateRule={updateRule}
                onRemoveRule={removeRule}
            />

            {/* Screener Results Table */}
            {loading ? (
                <TableSkeleton rows={6} cols={9} />
            ) : (
                <ScreenerResultsTable
                    results={results}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    loading={loading}
                />
            )}
        </div>
    )
}
