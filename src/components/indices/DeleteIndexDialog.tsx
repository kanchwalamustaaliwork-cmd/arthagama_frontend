'use client'

/**
 * src/components/indices/DeleteIndexDialog.tsx
 *
 * Confirmation modal for deleting or deactivating an Arthagama Index.
 */

import { useEffect } from 'react'
import { X, AlertTriangle, Archive, Trash2 } from 'lucide-react'
import { ArthagamaIndex } from '@/src/types/indices'
import Button from '@/src/components/dashboard/ui/Button'

interface DeleteIndexDialogProps {
    open: boolean
    index: ArthagamaIndex | null
    onConfirmDelete: () => void
    onDeactivate?: () => void
    onCancel: () => void
    isDeleting?: boolean
}

export default function DeleteIndexDialog({
    open,
    index,
    onConfirmDelete,
    onDeactivate,
    onCancel,
    isDeleting = false,
}: DeleteIndexDialogProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) onCancel()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [open, onCancel])

    if (!open || !index) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                background: 'rgba(0,0,0,0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
            onClick={e => {
                if (e.target === e.currentTarget) onCancel()
            }}
        >
            <div
                className="db-card"
                style={{
                    background: 'var(--db-elevated)',
                    border: '1px solid var(--db-border)',
                    borderRadius: 'var(--db-radius-xl)',
                    padding: '28px',
                    width: '100%',
                    maxWidth: '460px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    boxShadow: 'var(--db-shadow-lg)',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'var(--db-loss-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <AlertTriangle size={20} color="var(--db-loss)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--db-text)' }}>
                                Delete Index Confirmation
                            </h3>
                            <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                                ID: #{index.indexId} • {index.sector}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onCancel}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--db-text-muted)',
                            padding: '4px',
                        }}
                        aria-label="Close dialog"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '13.5px', color: 'var(--db-text-2)', lineHeight: 1.6 }}>
                        Are you sure you want to permanently delete{' '}
                        <strong style={{ color: 'var(--db-text)' }}>{index.indexName}</strong>?
                    </p>
                    <p style={{ fontSize: '12.5px', color: 'var(--db-text-muted)', lineHeight: 1.5 }}>
                        This will remove the index from the user dashboard and dissolve all constituent instrument relations. If you wish to preserve performance history, consider deactivating or archiving the index instead.
                    </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end', paddingTop: '10px' }}>
                    <Button variant="ghost" size="sm" onClick={onCancel} disabled={isDeleting}>
                        Cancel
                    </Button>

                    {onDeactivate && index.status === 'ACTIVE' && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onDeactivate}
                            disabled={isDeleting}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Archive size={14} /> Deactivate Instead
                        </Button>
                    )}

                    <Button
                        variant="danger"
                        size="sm"
                        onClick={onConfirmDelete}
                        disabled={isDeleting}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Trash2 size={14} /> {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
