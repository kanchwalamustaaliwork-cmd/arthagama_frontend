'use client'

import { useState } from 'react'
import Button from '@/src/components/dashboard/ui/Button'
import PageHeader from '@/src/components/admin/PageHeader'
import type { StrategyEditFormData } from '@/src/types/admin'
import { createStrategy } from '@/src/services/admin/adminApi'
import { Plus, X, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StrategyCreatePage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState<StrategyEditFormData>({
        name: '',
        description: '',
        summary: '',
        databaseName: 'timescale_prod_db',
        universeName: 'NIFTY 50',
        universeType: 'custom', // category default Options requires custom
        instruments: '',
        category: 'Options',
        isActive: true,
        status: 'draft',
        assignedUserId: null,
    })

    const set = (k: keyof StrategyEditFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setForm(prev => {
            const updated = { ...prev, [k]: val }
            if (k === 'category') {
                if (val === 'Futures' || val === 'Options') {
                    updated.universeType = 'custom'
                    updated.universeName = ''
                } else if (val === 'Equity') {
                    updated.universeType = 'default'
                    updated.universeName = 'NIFTY 50'
                    updated.instruments = ''
                }
            } else if (k === 'universeType') {
                if (val === 'default') {
                    updated.universeName = 'NIFTY 50'
                    updated.instruments = ''
                } else {
                    updated.universeName = ''
                }
            }
            return updated
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return alert('Strategy Name is required')

        // Validation based on category and type
        const payload = { ...form }
        if (payload.category === 'Futures' || payload.category === 'Options') {
            payload.universeType = 'custom'
        }

        if (payload.universeType === 'custom') {
            if (!payload.universeName.trim()) return alert('Universe Name is required for custom universes')
            if (!payload.instruments.trim()) return alert('Instruments are required for custom universes')
        } else {
            if (!payload.universeName) return alert('Default Universe selection is required')
            payload.instruments = '' // clear instruments for default universe
        }

        setSaving(true)
        try {
            await createStrategy(payload)
            setSaved(true)
            setTimeout(() => {
                router.push('/admin/strategies')
            }, 1000)
        } catch {
            alert('Failed to create strategy')
        } finally {
            setSaving(false)
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
            <PageHeader title="Create Strategy" subtitle="Configure and deploy a new trading strategy engine" icon={Plus} />

            <form onSubmit={handleSubmit} className="db-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Basic Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--db-border)', paddingBottom: '8px' }}>Basic Details</h3>

                    <div>
                        <label style={labelStyle}>Strategy Name *</label>
                        <input value={form.name} onChange={set('name')} placeholder="e.g. Nifty Mean Reversion Bands" style={{ ...fieldStyle, resize: undefined }} required />
                    </div>

                    <div>
                        <label style={labelStyle}>Summary</label>
                        <input value={form.summary} onChange={set('summary')} placeholder="e.g. Short-term mean reversion on index components" style={{ ...fieldStyle, resize: undefined }} />
                    </div>

                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Explain the high-level logic, timeframe, and goals of this strategy..." style={fieldStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                            <input value="Current Logged-in Admin" style={{ ...fieldStyle, resize: undefined, opacity: 0.7, cursor: 'not-allowed' }} disabled />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Database Name</label>
                            <input value={form.databaseName} onChange={set('databaseName')} style={{ ...fieldStyle, resize: undefined }} />
                        </div>
                        {form.category === 'Equity' ? (
                            <div>
                                <label style={labelStyle}>Universe Type</label>
                                <select value={form.universeType} onChange={set('universeType')} style={{ ...fieldStyle, WebkitAppearance: 'none', appearance: 'none', background: 'var(--db-elevated) url("data:image/svg+xml;utf8,<svg fill=\'%23A5B7B3\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 12px center' }}>
                                    <option value="default">Default Universe</option>
                                    <option value="custom">Custom Universe</option>
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label style={labelStyle}>Universe Type</label>
                                <input value="Custom Universe" style={{ ...fieldStyle, resize: undefined, opacity: 0.7, cursor: 'not-allowed' }} disabled />
                            </div>
                        )}
                    </div>

                    {form.universeType === 'default' && form.category === 'Equity' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Default Universe Name</label>
                                <input value={form.universeName} onChange={set('universeName')} placeholder="e.g. NIFTY 50" style={{ ...fieldStyle, resize: undefined }} />
                            </div>
                            <div />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Universe Name</label>
                                <input value={form.universeName} onChange={set('universeName')} placeholder="e.g. Momentum Stocks" style={{ ...fieldStyle, resize: undefined }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Instruments (Comma-separated)</label>
                                <input value={form.instruments} onChange={set('instruments')} placeholder="e.g. RELIANCE, TCS, INFY, HDFCBANK" style={{ ...fieldStyle, resize: undefined }} />
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <select value={form.status} onChange={set('status')} style={{ ...fieldStyle, WebkitAppearance: 'none', appearance: 'none', background: 'var(--db-elevated) url("data:image/svg+xml;utf8,<svg fill=\'%23A5B7B3\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 12px center' }}>
                                <option value="draft">Draft</option>
                                <option value="paused">Paused</option>
                                <option value="running">Running</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                            <input
                                type="checkbox"
                                id="createActiveCheckbox"
                                checked={form.isActive}
                                onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                style={{ width: '16px', height: '16px', accentColor: 'var(--db-mint)', cursor: 'pointer' }}
                            />
                            <label htmlFor="createActiveCheckbox" style={{ fontSize: '13px', color: 'var(--db-text-2)', cursor: 'pointer', userSelect: 'none' }}>
                                Set active immediately
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', paddingTop: '18px', borderTop: '1px solid var(--db-border)' }}>
                    <Button variant="ghost" size="md" onClick={() => router.push('/admin/strategies')} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <X size={14} /> Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit" disabled={saving}>
                        {saving ? 'Creating...' : <><Plus size={14} /> Create Strategy</>}
                    </Button>
                </div>
            </form>

            {saved && (
                <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--db-profit-bg)', border: '1px solid var(--db-profit)', borderRadius: 'var(--db-radius-md)', padding: '14px 20px', color: 'var(--db-profit)', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--db-shadow-lg)', zIndex: 100 }}>
                    <CheckCircle size={16} /> Created successfully! Redirecting...
                </div>
            )}
        </div>
    )
}
