/**
 * src/components/stockdashboard/overview/EditRatiosModal.tsx
 *
 * Modal dialog for managing and customizing financial ratios displayed on the Stock Overview.
 */

'use client'

import React, { useState, useEffect } from 'react'
import {
    X,
    Lock,
    Trash2,
    ChevronUp,
    ChevronDown,
    Plus,
    RotateCcw,
    Search,
    Check,
} from 'lucide-react'
import {
    DEFAULT_RATIO_DEFINITIONS,
    AVAILABLE_RATIOS_CATALOGUE,
} from '@/src/mocks/stockdashboard/available-ratios.mock'


interface EditRatiosModalProps {
    isOpen: boolean
    onClose: () => void
    addedMetricIds: string[]
    onApply: (newAddedIds: string[]) => void
    onRestoreDefaults: () => void
}

export function EditRatiosModal({
    isOpen,
    onClose,
    addedMetricIds,
    onApply,
    onRestoreDefaults,
}: EditRatiosModalProps) {
    const [pendingAddedIds, setPendingAddedIds] = useState<string[]>(addedMetricIds)
    const [searchQuery, setSearchQuery] = useState('')

    // Reset pending buffer when modal opens
    useEffect(() => {
        if (isOpen) {
            setPendingAddedIds(addedMetricIds)
            setSearchQuery('')
        }
    }, [isOpen, addedMetricIds])

    if (!isOpen) return null

    // Handlers inside modal buffer
    const handleAdd = (id: string) => {
        if (!pendingAddedIds.includes(id)) {
            setPendingAddedIds(prev => [...prev, id])
        }
    }

    const handleRemove = (id: string) => {
        setPendingAddedIds(prev => prev.filter(item => item !== id))
    }

    const handleMoveUp = (index: number) => {
        if (index <= 0) return
        setPendingAddedIds(prev => {
            const next = [...prev]
            const temp = next[index - 1]
            next[index - 1] = next[index]
            next[index] = temp
            return next
        })
    }

    const handleMoveDown = (index: number) => {
        if (index >= pendingAddedIds.length - 1) return
        setPendingAddedIds(prev => {
            const next = [...prev]
            const temp = next[index + 1]
            next[index + 1] = next[index]
            next[index] = temp
            return next
        })
    }

    const handleRestore = () => {
        setPendingAddedIds([])
        onRestoreDefaults()
        onClose()
    }

    const handleSave = () => {
        onApply(pendingAddedIds)
        onClose()
    }

    // Available catalogue filtered by search and excluded currently added
    const filteredAvailable = AVAILABLE_RATIOS_CATALOGUE.filter(item => {
        const isNotAdded = !pendingAddedIds.includes(item.id)
        const matchesQuery =
            searchQuery.trim() === '' ||
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        return isNotAdded && matchesQuery
    })

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(5, 10, 12, 0.75)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
            onClick={e => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.18))',
                    borderRadius: '18px',
                    width: '100%',
                    maxWidth: '680px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.65)',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '18px 24px',
                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                            Edit Financial Ratios
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '4px 0 0 0' }}>
                            Customize the key metric rows shown in the Stock Overview header across all tabs.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--db-text-muted, #708482)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body / Scrollable Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    {/* 1. Default Metrics (Locked) */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <Lock size={13} color="var(--db-mint, #B8CEC2)" />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--db-mint, #B8CEC2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Default Metrics (Fixed)
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '8px',
                            }}
                        >
                            {DEFAULT_RATIO_DEFINITIONS.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '7px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(32, 53, 58, 0.4)',
                                        border: '1px solid rgba(184, 206, 194, 0.08)',
                                        fontSize: '12px',
                                        color: 'var(--db-text-2, #A5B7B3)',
                                    }}
                                >
                                    <span>{item.label}</span>
                                    <Lock size={11} color="var(--db-text-muted, #708482)" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. User-Added Metrics */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Custom Added Metrics ({pendingAddedIds.length})
                            </span>
                            {pendingAddedIds.length > 0 && (
                                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                                    Use arrows to reorder
                                </span>
                            )}
                        </div>

                        {pendingAddedIds.length === 0 ? (
                            <div
                                style={{
                                    padding: '18px',
                                    borderRadius: '8px',
                                    background: 'var(--db-elevated, #20353A)',
                                    border: '1px dashed var(--db-border, rgba(184, 206, 194, 0.15))',
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    color: 'var(--db-text-muted, #708482)',
                                }}
                            >
                                No custom ratios added yet. Select metrics below to add them to your view.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {pendingAddedIds.map((id, index) => {
                                    const def = AVAILABLE_RATIOS_CATALOGUE.find(item => item.id === id)
                                    if (!def) return null
                                    return (
                                        <div
                                            key={id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                background: 'var(--db-elevated, #20353A)',
                                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                                    {def.label}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                                                    {def.category}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {/* Move Up */}
                                                <button
                                                    onClick={() => handleMoveUp(index)}
                                                    disabled={index === 0}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: index === 0 ? 'rgba(255,255,255,0.1)' : 'var(--db-mint, #B8CEC2)',
                                                        cursor: index === 0 ? 'default' : 'pointer',
                                                        padding: '2px',
                                                    }}
                                                    title="Move up"
                                                >
                                                    <ChevronUp size={16} />
                                                </button>
                                                {/* Move Down */}
                                                <button
                                                    onClick={() => handleMoveDown(index)}
                                                    disabled={index === pendingAddedIds.length - 1}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: index === pendingAddedIds.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--db-mint, #B8CEC2)',
                                                        cursor: index === pendingAddedIds.length - 1 ? 'default' : 'pointer',
                                                        padding: '2px',
                                                    }}
                                                    title="Move down"
                                                >
                                                    <ChevronDown size={16} />
                                                </button>
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleRemove(id)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--db-loss, #E35D6A)',
                                                        cursor: 'pointer',
                                                        padding: '4px',
                                                        marginLeft: '4px',
                                                    }}
                                                    title="Remove ratio"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* 3. Available Catalogue to Add */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Available Ratios Catalogue
                            </span>
                        </div>

                        {/* Search input */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--db-elevated, #20353A)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                marginBottom: '12px',
                            }}
                        >
                            <Search size={14} color="var(--db-text-muted, #708482)" />
                            <input
                                type="text"
                                placeholder="Search available ratios (e.g. Price to Sales, Cash Flow, Margin)…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--db-text, #F7FAF9)',
                                    fontSize: '12.5px',
                                    width: '100%',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredAvailable.length === 0 ? (
                                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>
                                    {searchQuery ? `No matching ratios found for "${searchQuery}".` : 'All catalogue ratios have been added.'}
                                </div>
                            ) : (
                                filteredAvailable.map(item => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            background: 'rgba(32, 53, 58, 0.3)',
                                            border: '1px solid rgba(184, 206, 194, 0.06)',
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--db-text, #F7FAF9)' }}>
                                                {item.label}
                                            </span>
                                            <span style={{ fontSize: '10.5px', color: 'var(--db-text-muted, #708482)', marginLeft: '8px' }}>
                                                ({item.category})
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleAdd(item.id)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                background: 'var(--db-teal, #244147)',
                                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
                                                color: 'var(--db-mint, #B8CEC2)',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <Plus size={12} /> Add
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div
                    style={{
                        padding: '14px 24px',
                        borderTop: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(24, 40, 44, 0.95)',
                    }}
                >
                    <button
                        onClick={handleRestore}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--db-text-muted, #708482)',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        <RotateCcw size={13} /> Restore Defaults
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '7px 14px',
                                borderRadius: '8px',
                                background: 'transparent',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                color: 'var(--db-text-2, #A5B7B3)',
                                fontSize: '12.5px',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '7px 18px',
                                borderRadius: '8px',
                                background: 'var(--db-mint, #B8CEC2)',
                                border: 'none',
                                color: 'var(--db-teal, #244147)',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            <Check size={14} /> Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
