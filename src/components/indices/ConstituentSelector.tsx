'use client'

/**
 * src/components/indices/ConstituentSelector.tsx
 *
 * Instrument picker & constituent weight manager for the Index creation and edit form.
 */

import { useState } from 'react'
import { Plus, Trash2, Search, Check, AlertCircle } from 'lucide-react'
import { Instrument, IndexConstituentInput } from '@/src/types/indices'
import { useInstrumentSearch } from '@/src/hooks/indices/useInstrumentSearch'
import { MOCK_INDEX_INSTRUMENTS } from '@/src/mocks/indices/instruments.mock'

interface SelectedConstituentItem extends IndexConstituentInput {
    instrument?: Instrument
}

interface ConstituentSelectorProps {
    constituents: SelectedConstituentItem[]
    onChange: (constituents: SelectedConstituentItem[]) => void
    error?: string
}

export default function ConstituentSelector({
    constituents,
    onChange,
    error,
}: ConstituentSelectorProps) {
    const [isSearching, setIsSearching] = useState(false)
    const { query, setQuery, results, loading } = useInstrumentSearch()

    const selectedIds = new Set(constituents.map(c => c.instrumentId))

    const handleAdd = (inst: Instrument) => {
        if (selectedIds.has(inst.instrument_id)) return
        const nextList = [
            ...constituents,
            {
                instrumentId: inst.instrument_id,
                weight: null,
                instrument: inst,
            },
        ]
        onChange(nextList)
    }

    const handleRemove = (instrumentId: number) => {
        onChange(constituents.filter(c => c.instrumentId !== instrumentId))
    }

    const handleWeightChange = (instrumentId: number, val: string) => {
        const num = val === '' ? null : parseFloat(val)
        onChange(
            constituents.map(c =>
                c.instrumentId === instrumentId ? { ...c, weight: num } : c
            )
        )
    }

    const handleAutoDistribute = () => {
        if (constituents.length === 0) return
        const evenWeight = Math.round((100 / constituents.length) * 100) / 100
        onChange(
            constituents.map(c => ({
                ...c,
                weight: evenWeight,
            }))
        )
    }

    const totalWeight = constituents.reduce((acc, c) => acc + (Number(c.weight) || 0), 0)
    const isWeightsValid = constituents.length === 0 || Math.abs(totalWeight - 100) < 0.5

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)' }}>
                        Constituent Instruments ({constituents.length})
                    </label>
                    <p style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                        Select eligible NSE equity constituents and specify target weight percentages.
                    </p>
                </div>

                {constituents.length > 0 && (
                    <button
                        type="button"
                        onClick={handleAutoDistribute}
                        style={{
                            background: 'var(--db-elevated)',
                            border: '1px solid var(--db-border)',
                            color: 'var(--db-mint)',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            cursor: 'pointer',
                        }}
                    >
                        Equal Weight ({constituents.length > 0 ? (100 / constituents.length).toFixed(1) : 0}%)
                    </button>
                )}
            </div>

            {/* Error banner if validation fails */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--db-loss)', fontSize: '12px' }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}

            {/* Selected Constituents Table */}
            {constituents.length > 0 && (
                <div
                    className="db-card"
                    style={{
                        overflow: 'hidden',
                        background: 'var(--db-elevated)',
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--db-border)', background: 'rgba(0,0,0,0.2)' }}>
                                <th style={{ padding: '8px 14px', color: 'var(--db-text-muted)' }}>Symbol</th>
                                <th style={{ padding: '8px 14px', color: 'var(--db-text-muted)' }}>Name</th>
                                <th style={{ padding: '8px 14px', color: 'var(--db-text-muted)', width: '110px' }}>Weight %</th>
                                <th style={{ padding: '8px 14px', width: '40px' }} />
                            </tr>
                        </thead>
                        <tbody>
                            {constituents.map(c => {
                                const inst = c.instrument || MOCK_INDEX_INSTRUMENTS.find(i => i.instrument_id === c.instrumentId)
                                return (
                                    <tr key={c.instrumentId} style={{ borderBottom: '1px solid var(--db-border)' }}>
                                        <td style={{ padding: '8px 14px', fontWeight: 600, color: 'var(--db-text)' }}>
                                            {inst?.symbol || `ID: ${c.instrumentId}`}
                                        </td>
                                        <td style={{ padding: '8px 14px', color: 'var(--db-text-2)', fontSize: '12px' }}>
                                            {inst?.name || '—'}
                                        </td>
                                        <td style={{ padding: '8px 14px' }}>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={c.weight !== null && c.weight !== undefined ? c.weight : ''}
                                                onChange={e => handleWeightChange(c.instrumentId, e.target.value)}
                                                placeholder="0.0"
                                                style={{
                                                    width: '80px',
                                                    padding: '4px 8px',
                                                    background: 'var(--db-surface)',
                                                    border: '1px solid var(--db-border)',
                                                    borderRadius: '4px',
                                                    color: 'var(--db-text)',
                                                    fontSize: '12px',
                                                    textAlign: 'right',
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '8px 14px', textAlign: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(c.instrumentId)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--db-loss)',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                }}
                                                aria-label="Remove constituent"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={2} style={{ padding: '8px 14px', fontWeight: 600, color: 'var(--db-text)' }}>
                                    Total Weight
                                </td>
                                <td
                                    style={{
                                        padding: '8px 14px',
                                        fontWeight: 700,
                                        textAlign: 'right',
                                        color: isWeightsValid ? 'var(--db-profit)' : 'var(--db-loss)',
                                    }}
                                >
                                    {totalWeight.toFixed(1)}%
                                </td>
                                <td />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Instrument Search & Picker Drawer / Trigger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                    <Search
                        size={15}
                        color="var(--db-text-muted)"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value)
                            setIsSearching(true)
                        }}
                        onFocus={() => setIsSearching(true)}
                        placeholder="Search equity symbol or company to add (e.g. INFY, TCS)..."
                        style={{
                            width: '100%',
                            padding: '9px 12px 9px 36px',
                            background: 'var(--db-surface)',
                            border: '1px solid var(--db-border)',
                            borderRadius: 'var(--db-radius-md)',
                            color: 'var(--db-text)',
                            fontSize: '13px',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Search Results Dropdown List */}
                {isSearching && (
                    <div
                        className="db-card"
                        style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            background: 'var(--db-elevated)',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                        }}
                    >
                        {loading ? (
                            <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--db-text-muted)' }}>
                                Searching instruments...
                            </div>
                        ) : results.length === 0 ? (
                            <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--db-text-muted)' }}>
                                No matching equity instruments found.
                            </div>
                        ) : (
                            results.map(inst => {
                                const isAdded = selectedIds.has(inst.instrument_id)
                                return (
                                    <div
                                        key={inst.instrument_id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            background: isAdded ? 'rgba(56, 217, 150, 0.08)' : 'var(--db-surface)',
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--db-text)' }}>
                                                    {inst.symbol}
                                                </span>
                                                <span style={{ fontSize: '11px', color: 'var(--db-mint)', background: 'var(--db-mint-faint)', padding: '1px 4px', borderRadius: '3px' }}>
                                                    {inst.exchange}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '11.5px', color: 'var(--db-text-muted)' }}>
                                                {inst.name} • {inst.sector || 'Equity'}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={isAdded}
                                            onClick={() => handleAdd(inst)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 10px',
                                                borderRadius: '5px',
                                                border: '1px solid',
                                                borderColor: isAdded ? 'var(--db-profit)' : 'var(--db-border)',
                                                background: isAdded ? 'transparent' : 'var(--db-teal)',
                                                color: isAdded ? 'var(--db-profit)' : 'var(--db-text)',
                                                fontSize: '11.5px',
                                                fontWeight: 500,
                                                cursor: isAdded ? 'default' : 'pointer',
                                            }}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check size={12} /> Added
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={12} /> Add
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
