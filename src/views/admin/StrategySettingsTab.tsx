'use client'

import { useEffect, useState } from 'react'
import Button from '@/src/components/dashboard/ui/Button'
import ConfirmDialog from '@/src/components/admin/ConfirmDialog'
import type { AdminStrategy, AdminStrategyStatus, StrategyEditFormData } from '@/src/types/admin'
import { Save, CheckCircle, Trash2, Power } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
    strategy: AdminStrategy
    onSave: (data: StrategyEditFormData) => Promise<boolean>
    saving: boolean
    onToggleActive?: () => Promise<void>
    onDelete?: () => Promise<boolean>
}

export default function StrategySettingsTab({ strategy, onSave, saving, onToggleActive, onDelete }: Props) {
    const router = useRouter()
    const [form, setForm] = useState<StrategyEditFormData>({
        name: strategy.name,
        description: strategy.description,
        summary: strategy.summary || '',
        databaseName: strategy.databaseName || '',
        universeName: strategy.universeName || '',
        category: strategy.category || 'Options',
        isActive: strategy.isActive,
        status: strategy.status,
        assignedUserId: strategy.assignedUserId,
    })
    const [saved, setSaved] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        setForm({
            name: strategy.name,
            description: strategy.description,
            summary: strategy.summary || '',
            databaseName: strategy.databaseName || '',
            universeName: strategy.universeName || '',
            category: strategy.category || 'Options',
            isActive: strategy.isActive,
            status: strategy.status,
            assignedUserId: strategy.assignedUserId,
        })
    }, [strategy])

    const set = (k: keyof StrategyEditFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setForm(prev => ({ ...prev, [k]: val }))
    }

    const handleSave = async () => {
        const ok = await onSave(form)
        if (ok) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
    }

    const handleDeleteConfirm = async () => {
        setShowDeleteConfirm(false)
        setIsDeleting(true)
        if (onDelete) {
            const ok = await onDelete()
            if (ok) {
                router.push('/admin/strategies')
            } else {
                setIsDeleting(false)
            }
        } else {
            setIsDeleting(false)
        }
    }

    const fieldStyle = {
        width: '100%',
        boxSizing: 'border-box' as const,
        background: 'var(--db-elevated)',
        border: '1px solid var(--db-border)',
        borderRadius: 'var(--db-radius-md)',
        color: 'var(--db-text)',
        fontSize: '13.5px',
        padding: '10px 12px',
        resize: 'vertical' as const,
        lineHeight: 1.5,
        outline: 'none',
        transition: 'border-color var(--db-transition)',
        fontFamily: 'inherit',
    }

    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        color: 'var(--db-text-muted)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.07em',
        marginBottom: '6px',
        fontWeight: 500,
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '760px' }}>
            
            {/* Quick Actions Panel */}
            <section style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--db-elevated)', borderRadius: 'var(--db-radius-lg)', border: '1px solid var(--db-border)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '2px' }}>Quick Controls</h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--db-text-muted)' }}>Manage state or remove strategy from platform</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {onToggleActive && (
                        <Button 
                            variant={strategy.isActive ? 'secondary' : 'primary'} 
                            size="sm" 
                            onClick={onToggleActive}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Power size={13} /> {strategy.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                    )}
                    {onDelete && (
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => setShowDeleteConfirm(true)} 
                            disabled={isDeleting}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Trash2 size={13} /> {isDeleting ? 'Deleting...' : 'Delete Strategy'}
                        </Button>
                    )}
                </div>
            </section>

            {/* Basic Info */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Basic Information</h3>
                
                <div>
                    <label style={labelStyle}>Strategy Name</label>
                    <input value={form.name} onChange={set('name')} style={{ ...fieldStyle, resize: undefined }} />
                </div>

                <div>
                    <label style={labelStyle}>Summary</label>
                    <input value={form.summary} onChange={set('summary')} style={{ ...fieldStyle, resize: undefined }} />
                </div>
                
                <div>
                    <label style={labelStyle}>Description</label>
                    <textarea value={form.description} onChange={set('description')} rows={3} style={fieldStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                        <label style={labelStyle}>Category</label>
                        <select value={form.category} onChange={set('category')} style={{ ...fieldStyle, WebkitAppearance: 'none', appearance: 'none', background: 'var(--db-elevated) url("data:image/svg+xml;utf8,<svg fill=\'%23A5B7B3\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 12px center' }}>
                            <option value="Options">Options</option>
                            <option value="Futures">Futures</option>
                            <option value="Equity">Equity</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Owner Admin</label>
                        <input value={strategy.ownerAdminName || 'Unassigned'} style={{ ...fieldStyle, resize: undefined, opacity: 0.7, cursor: 'not-allowed' }} disabled />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                        <label style={labelStyle}>Database Name</label>
                        <input value={form.databaseName} onChange={set('databaseName')} placeholder="e.g. timescale_nifty_prod" style={{ ...fieldStyle, resize: undefined }} />
                    </div>
                    <div>
                        <label style={labelStyle}>Universe Name</label>
                        <input value={form.universeName} onChange={set('universeName')} placeholder="e.g. Nifty 50 Bluechips" style={{ ...fieldStyle, resize: undefined }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                        <label style={labelStyle}>Status</label>
                        <select value={form.status} onChange={set('status')} style={{ ...fieldStyle, WebkitAppearance: 'none', appearance: 'none', background: 'var(--db-elevated) url("data:image/svg+xml;utf8,<svg fill=\'%23A5B7B3\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 12px center' }}>
                            <option value="running">Running</option>
                            <option value="paused">Paused</option>
                            <option value="draft">Draft</option>
                            <option value="error">Error</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                        <input 
                            type="checkbox" 
                            id="isActiveCheckbox"
                            checked={form.isActive} 
                            onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--db-mint)', cursor: 'pointer' }}
                        />
                        <label htmlFor="isActiveCheckbox" style={{ fontSize: '13px', color: 'var(--db-text-2)', cursor: 'pointer', userSelect: 'none' }}>
                            Active state enabled
                        </label>
                    </div>
                </div>
            </section>

            {/* Save */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--db-border)' }}>
                <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving…' : <><Save size={14} /> Save Changes</>}
                </Button>
                {saved && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--db-profit)' }}>
                        <CheckCircle size={14} /> Saved successfully
                    </span>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog 
                open={showDeleteConfirm}
                title="Delete Strategy?"
                message={`Are you sure you want to delete "${strategy.name}"? This will permanently remove all holdings, orders, and configurations. This action cannot be undone.`}
                confirmLabel="Delete Strategy"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    )
}
