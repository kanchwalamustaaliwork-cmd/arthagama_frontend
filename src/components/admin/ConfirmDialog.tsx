'use client'

import { useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import Button from '@/src/components/dashboard/ui/Button'

interface ConfirmDialogProps {
    open: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning'
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', onConfirm, onCancel }: ConfirmDialogProps) {
    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onCancel() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [open, onCancel])

    if (!open) return null

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
            <div style={{ background: 'var(--db-elevated)', border: '1px solid var(--db-border)', borderRadius: 'var(--db-radius-xl)', padding: '28px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--db-shadow-lg)' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: variant === 'danger' ? 'var(--db-loss-bg)' : 'var(--db-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <AlertTriangle size={18} color={variant === 'danger' ? 'var(--db-loss)' : 'var(--db-warning)'} />
                        </div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--db-text)' }}>{title}</h2>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--db-text-muted)', padding: '4px', flexShrink: 0 }}>
                        <X size={16} />
                    </button>
                </div>

                <p style={{ fontSize: '13.5px', color: 'var(--db-text-2)', lineHeight: 1.6 }}>{message}</p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <Button variant="ghost" size="md" onClick={onCancel}>{cancelLabel}</Button>
                    <Button variant="danger" size="md" onClick={onConfirm}>{confirmLabel}</Button>
                </div>
            </div>
        </div>
    )
}
