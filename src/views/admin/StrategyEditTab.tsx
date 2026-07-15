'use client'

import { useEffect, useState } from 'react'
import Button from '@/src/components/dashboard/ui/Button'
import type { AdminStrategy, StrategyEditFormData } from '@/src/types/admin'
import { Save, CheckCircle } from 'lucide-react'

interface Props {
    strategy: AdminStrategy
    onSave: (data: StrategyEditFormData) => Promise<boolean>
    saving: boolean
}

export default function StrategyEditTab({ strategy, onSave, saving }: Props) {
    const [form, setForm] = useState<StrategyEditFormData>({
        name: strategy.name,
        description: strategy.description,
        version: strategy.version,
        instruments: strategy.instruments.join(', '),
        entryRules: 'EMA(20) crosses above EMA(50) AND RSI > 55',
        exitRules: 'EMA(20) crosses below EMA(50) OR RSI < 40 OR Stop-Loss hit',
        positionSizePct: '5',
        stopLossPct: '3',
        targetPct: '10',
        indicators: 'EMA(20), EMA(50), RSI(14), ATR(14)',
        riskSettings: 'Max 5 concurrent positions. Daily loss limit 2% of portfolio.',
    })
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setForm({
            name: strategy.name, description: strategy.description, version: strategy.version,
            instruments: strategy.instruments.join(', '),
            entryRules: 'EMA(20) crosses above EMA(50) AND RSI > 55',
            exitRules: 'EMA(20) crosses below EMA(50) OR RSI < 40 OR Stop-Loss hit',
            positionSizePct: '5', stopLossPct: '3', targetPct: '10',
            indicators: 'EMA(20), EMA(50), RSI(14), ATR(14)',
            riskSettings: 'Max 5 concurrent positions. Daily loss limit 2% of portfolio.',
        })
    }, [strategy.id])

    const set = (k: keyof StrategyEditFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }))

    const handleSave = async () => {
        const ok = await onSave(form)
        if (ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    }

    const fieldStyle = {
        width: '100%', boxSizing: 'border-box' as const,
        background: 'var(--db-elevated)', border: '1px solid var(--db-border)',
        borderRadius: 'var(--db-radius-md)', color: 'var(--db-text)', fontSize: '13px',
        padding: '10px 12px', resize: 'vertical' as const, lineHeight: 1.5,
        outline: 'none', transition: 'border-color var(--db-transition)',
        fontFamily: 'inherit',
    }

    const labelStyle = { display: 'block', fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '6px', fontWeight: 500 }

    const Field = ({ label, field, textarea = false, rows = 3 }: { label: string; field: keyof StrategyEditFormData; textarea?: boolean; rows?: number }) => (
        <div>
            <label style={labelStyle}>{label}</label>
            {textarea ? (
                <textarea value={form[field]} onChange={set(field)} rows={rows} style={fieldStyle} />
            ) : (
                <input value={form[field]} onChange={set(field)} style={{ ...fieldStyle, resize: undefined }} />
            )}
        </div>
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '760px' }}>

            {/* Basic Info */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Basic Information</h3>
                <Field label="Strategy Name" field="name" />
                <Field label="Description" field="description" textarea rows={3} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <Field label="Version" field="version" />
                    <Field label="Instruments (comma-separated)" field="instruments" />
                </div>
            </section>

            {/* Rules */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Strategy Rules</h3>
                <Field label="Entry Rules" field="entryRules" textarea rows={4} />
                <Field label="Exit Rules" field="exitRules" textarea rows={4} />
                <Field label="Indicators Used" field="indicators" textarea rows={2} />
            </section>

            {/* Risk */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Risk Management</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
                    <Field label="Position Size %" field="positionSizePct" />
                    <Field label="Stop Loss %" field="stopLossPct" />
                    <Field label="Target %" field="targetPct" />
                </div>
                <Field label="Risk Settings & Notes" field="riskSettings" textarea rows={3} />
            </section>

            {/* Save */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--db-border)' }}>
                <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving…' : <><Save size={14} /> Save Changes</>}
                </Button>
                {saved && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--db-profit)' }}>
                        <CheckCircle size={14} /> Saved successfully
                    </span>
                )}
            </div>
        </div>
    )
}
