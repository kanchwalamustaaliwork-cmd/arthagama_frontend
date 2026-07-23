'use client'

import { useEffect, useState } from 'react'
import Button from '@/src/components/dashboard/ui/Button'
import ConfirmDialog from '@/src/components/admin/ConfirmDialog'
import StrategyFormFields from '@/src/components/admin/stratergy/forms/StrategyFormFields'
import { useStrategyForm, buildStrategyPayload } from '@/src/hooks/admin/useStrategyForm'
import type { AdminStrategy, StrategyEditFormData } from '@/src/types/admin'
import { useStrategyContext } from '@/src/context/StrategyContext'
import { Save, CheckCircle, Trash2, Power } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
    strategy?: AdminStrategy
    onSave?: (data: StrategyEditFormData) => Promise<boolean>
    saving?: boolean
    onToggleActive?: () => Promise<void>
    onDelete?: () => Promise<boolean>
}

const EDIT_STATUS_OPTIONS = [
    { value: 'running', label: 'Running' },
    { value: 'paused', label: 'Paused' },
    { value: 'draft', label: 'Draft' },
    { value: 'error', label: 'Error' },
    { value: 'archived', label: 'Archived' },
]

const getInitialUniverseType = (category: string, type?: string) => {
    if (category === 'Futures' || category === 'Options') return 'custom'
    return (type as 'default' | 'custom') || 'default'
}

const toFormData = (strategy: AdminStrategy): StrategyEditFormData => ({
    name: strategy.name,
    description: strategy.description,
    summary: strategy.summary || '',
    databaseName: strategy.databaseName || '',
    universeName: strategy.universeName || '',
    universeType: getInitialUniverseType(strategy.category || 'Options', strategy.universeType),
    instruments: strategy.instruments || '',
    category: strategy.category || 'Options',
    isActive: strategy.isActive,
    status: strategy.status,
    assignedUserId: strategy.assignedUserId,
})

export default function StrategySettingsTab({
    strategy: propStrategy,
    onSave: propOnSave,
    saving: propSaving,
    onToggleActive: propOnToggleActive,
    onDelete: propOnDelete,
}: Props = {}) {
    const ctx = useStrategyContext()
    const strategy = propStrategy || ctx.strategy
    const onSave = propOnSave || ctx.handleSave
    const saving = propSaving !== undefined ? propSaving : ctx.saving
    const onToggleActive = propOnToggleActive || ctx.handleToggleActive
    const onDelete = propOnDelete || ctx.handleDelete

    const router = useRouter()
    const { form, setForm, set, setIsActive } = useStrategyForm(strategy ? toFormData(strategy) : {
        name: '', description: '', summary: '', databaseName: '', universeName: '', universeType: 'default', instruments: '', category: 'Options', isActive: false, status: 'draft', assignedUserId: null
    })
    const [saved, setSaved] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (strategy) {
            setForm(toFormData(strategy))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [strategy])

    if (!strategy) return null

    const handleSave = async () => {
        const result = buildStrategyPayload(form)
        if (result.error || !result.payload) return alert(result.error)

        const ok = await onSave(result.payload)
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '760px' }}>

            {/* Quick Actions Panel */}
            <section style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--db-elevated)', borderRadius: 'var(--db-radius-lg)', border: '1px solid var(--db-border)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '2px' }}>Quick Controls</h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--db-text-muted)' }}>Manage state or remove strategy from platform</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {Boolean(onToggleActive) && (
                        <Button
                            variant={strategy.isActive ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={onToggleActive}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Power size={13} /> {strategy.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                    )}
                    {Boolean(onDelete) && (
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

                <StrategyFormFields
                    form={form}
                    set={set}
                    setIsActive={setIsActive}
                    ownerAdminLabel={strategy.ownerAdminName || 'Unassigned'}
                    statusOptions={EDIT_STATUS_OPTIONS}
                    activeCheckboxLabel="Active state enabled"
                    activeCheckboxId="isActiveCheckbox"
                />
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