'use client'

import Button from '@/src/components/dashboard/ui/Button'
import PageHeader from '@/src/components/admin/PageHeader'
import StrategyFormFields from '@/src/components/admin/stratergy/forms/StrategyFormFields'
import { useStrategyForm, buildStrategyPayload } from '@/src/hooks/admin/useStrategyForm'
import { createStrategy } from '@/src/services/admin/adminApi'
import { Plus, X, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CREATE_STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'paused', label: 'Paused' },
    { value: 'running', label: 'Running' },
]

export default function StrategyCreatePage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const { form, set, setIsActive } = useStrategyForm({
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = buildStrategyPayload(form)
        if (result.error || !result.payload) return alert(result.error)

        setSaving(true)
        try {
            await createStrategy(result.payload)
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
            <PageHeader title="Create Strategy" subtitle="Configure and deploy a new trading strategy engine" icon={Plus} />

            <form onSubmit={handleSubmit} className="db-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--db-border)', paddingBottom: '8px' }}>
                        Basic Details
                    </h3>

                    <StrategyFormFields
                        form={form}
                        set={set}
                        setIsActive={setIsActive}
                        ownerAdminLabel="Current Logged-in Admin"
                        statusOptions={CREATE_STATUS_OPTIONS}
                        activeCheckboxLabel="Set active immediately"
                        activeCheckboxId="createActiveCheckbox"
                        nameRequired
                    />
                </div>

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