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
        version: 'v1.0',
        instruments: 'NIFTY50, NIFTY BANK',
        databaseName: 'timescale_prod_db',
        universeName: 'Nifty 50 Index',
        isActive: true,
        status: 'draft',
        entryRules: 'EMA(20) crosses above EMA(50) AND RSI(14) > 50',
        exitRules: 'EMA(20) crosses below EMA(50) OR Stop-Loss hit (-2%)',
        positionSizePct: '5',
        stopLossPct: '2',
        targetPct: '6',
        indicators: 'EMA(20), EMA(50), RSI(14)',
        riskSettings: 'Max 5 concurrent trades. Max daily loss limit 2% of capital.',
    })

    const set = (k: keyof StrategyEditFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setForm(prev => ({ ...prev, [k]: val }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return alert('Strategy Name is required')

        setSaving(true)
        try {
            await createStrategy(form)
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
                        <label style={labelStyle}>Description</label>
                        <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Explain the high-level logic, timeframe, and goals of this strategy..." style={fieldStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Version</label>
                            <input value={form.version} onChange={set('version')} style={{ ...fieldStyle, resize: undefined }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Instruments (comma-separated)</label>
                            <input value={form.instruments} onChange={set('instruments')} style={{ ...fieldStyle, resize: undefined }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Database Name</label>
                            <input value={form.databaseName} onChange={set('databaseName')} style={{ ...fieldStyle, resize: undefined }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Universe Name</label>
                            <input value={form.universeName} onChange={set('universeName')} style={{ ...fieldStyle, resize: undefined }} />
                        </div>
                    </div>

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

                {/* Rules */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--db-border)', paddingBottom: '8px' }}>Strategy Rules</h3>
                    
                    <div>
                        <label style={labelStyle}>Entry Rules</label>
                        <textarea value={form.entryRules} onChange={set('entryRules')} rows={3} style={fieldStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Exit Rules</label>
                        <textarea value={form.exitRules} onChange={set('exitRules')} rows={3} style={fieldStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Indicators Used</label>
                        <textarea value={form.indicators} onChange={set('indicators')} rows={2} style={fieldStyle} />
                    </div>
                </div>

                {/* Risk */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--db-border)', paddingBottom: '8px' }}>Risk Management</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Position Size %</label>
                            <input value={form.positionSizePct} onChange={set('positionSizePct')} style={{ ...fieldStyle, resize: undefined }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Stop Loss %</label>
                            <input value={form.stopLossPct} onChange={set('stopLossPct')} style={{ ...fieldStyle, resize: undefined }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Target %</label>
                            <input value={form.targetPct} onChange={set('targetPct')} style={{ ...fieldStyle, resize: undefined }} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Risk Settings & Notes</label>
                        <textarea value={form.riskSettings} onChange={set('riskSettings')} rows={3} style={fieldStyle} />
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
