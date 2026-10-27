'use client'

/**
 * src/components/indices/IndexForm.tsx
 *
 * Reusable form component for Creating and Editing an Arthagama Index.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Check, X, AlertCircle } from 'lucide-react'
import { CreateIndexRequest, IndexStatus, ArthagamaIndex, Instrument } from '@/src/types/indices'
import { PREDEFINED_SECTORS } from '@/src/mocks/indices/indices.mock'
import { validateIndexForm, IndexValidationError } from '@/src/utils/indices/validate-index'
import ConstituentSelector from './ConstituentSelector'
import Button from '@/src/components/dashboard/ui/Button'

interface IndexFormProps {
    initialData?: Partial<CreateIndexRequest> & {
        constituentsWithData?: Array<{ instrumentId: number; weight?: number | null; instrument?: Instrument }>
    }
    existingIndices?: ArthagamaIndex[]
    currentIndexId?: number
    onSubmit: (payload: CreateIndexRequest) => Promise<void>
    isSubmitting?: boolean
    mode?: 'create' | 'edit'
}

export default function IndexForm({
    initialData,
    existingIndices = [],
    currentIndexId,
    onSubmit,
    isSubmitting = false,
    mode = 'create',
}: IndexFormProps) {
    const router = useRouter()

    const [indexName, setIndexName] = useState(initialData?.indexName || '')
    const [indexSymbol, setIndexSymbol] = useState(initialData?.indexSymbol || '')
    const [sector, setSector] = useState(initialData?.sector || PREDEFINED_SECTORS[0])
    const [description, setDescription] = useState(initialData?.description || '')
    const [baseDate, setBaseDate] = useState(
        initialData?.baseDate || new Date().toISOString().split('T')[0]
    )
    const [baseValue, setBaseValue] = useState<number>(initialData?.baseValue ?? 1000)
    const [status, setStatus] = useState<IndexStatus>(initialData?.status || 'ACTIVE')

    const [constituents, setConstituents] = useState(
        initialData?.constituentsWithData || initialData?.constituents || []
    )
    const [errors, setErrors] = useState<IndexValidationError[]>([])

    const getFieldError = (field: string) => errors.find(e => e.field === field)?.message

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload: CreateIndexRequest = {
            indexName: indexName.trim(),
            indexSymbol: indexSymbol.trim() ? indexSymbol.trim().toUpperCase() : null,
            sector,
            description: description.trim() || null,
            baseDate,
            baseValue: Number(baseValue),
            status,
            constituents: constituents.map(c => ({
                instrumentId: c.instrumentId,
                weight: c.weight,
            })),
        }

        const validationErrors = validateIndexForm(payload, existingIndices, currentIndexId)
        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors([])
        await onSubmit(payload)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="db-card"
            style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
            {/* Global Error Notice if any */}
            {errors.length > 0 && (
                <div
                    style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--db-radius-md)',
                        background: 'var(--db-loss-bg)',
                        border: '1px solid rgba(227, 93, 106, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'var(--db-loss)',
                        fontSize: '13px',
                    }}
                >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>Please correct the errors in the form before proceeding.</span>
                </div>
            )}

            {/* Section 1: Basic Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3
                    style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--db-text)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        borderBottom: '1px solid var(--db-border)',
                        paddingBottom: '8px',
                    }}
                >
                    Index Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {/* Index Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)' }}>
                            Index Name <span style={{ color: 'var(--db-loss)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={indexName}
                            onChange={e => setIndexName(e.target.value)}
                            placeholder="e.g. Arthagama Tech Innovators Index"
                            style={{
                                padding: '10px 14px',
                                background: 'var(--db-surface)',
                                border: `1px solid ${getFieldError('indexName') ? 'var(--db-loss)' : 'var(--db-border)'}`,
                                borderRadius: 'var(--db-radius-md)',
                                color: 'var(--db-text)',
                                fontSize: '13px',
                                outline: 'none',
                            }}
                        />
                        {getFieldError('indexName') && (
                            <span style={{ fontSize: '11.5px', color: 'var(--db-loss)' }}>
                                {getFieldError('indexName')}
                            </span>
                        )}
                    </div>

                    {/* Sector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)' }}>
                            Sector / Theme <span style={{ color: 'var(--db-loss)' }}>*</span>
                        </label>
                        <select
                            value={sector}
                            onChange={e => setSector(e.target.value)}
                            style={{
                                padding: '10px 14px',
                                background: 'var(--db-surface)',
                                border: '1px solid var(--db-border)',
                                borderRadius: 'var(--db-radius-md)',
                                color: 'var(--db-text)',
                                fontSize: '13px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {PREDEFINED_SECTORS.map(sec => (
                                <option key={sec} value={sec}>
                                    {sec}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Symbol */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)' }}>
                            Ticker Symbol (Optional)
                        </label>
                        <input
                            type="text"
                            value={indexSymbol}
                            onChange={e => setIndexSymbol(e.target.value.toUpperCase())}
                            placeholder="e.g. ARTGTECH"
                            style={{
                                padding: '10px 14px',
                                background: 'var(--db-surface)',
                                border: `1px solid ${getFieldError('indexSymbol') ? 'var(--db-loss)' : 'var(--db-border)'}`,
                                borderRadius: 'var(--db-radius-md)',
                                color: 'var(--db-text)',
                                fontSize: '13px',
                                outline: 'none',
                            }}
                        />
                        {getFieldError('indexSymbol') && (
                            <span style={{ fontSize: '11.5px', color: 'var(--db-loss)' }}>
                                {getFieldError('indexSymbol')}
                            </span>
                        )}
                    </div>

                    {/* Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)' }}>
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value as IndexStatus)}
                            style={{
                                padding: '10px 14px',
                                background: 'var(--db-surface)',
                                border: '1px solid var(--db-border)',
                                borderRadius: 'var(--db-radius-md)',
                                color: 'var(--db-text)',
                                fontSize: '13px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="ACTIVE">Active (Published to Users)</option>
                            <option value="INACTIVE">Inactive (Archived)</option>
                            <option value="DRAFT">Draft (Under Review)</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)' }}>
                        Description & Methodology Summary
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Provide details on index composition methodology and selection criteria..."
                        style={{
                            padding: '10px 14px',
                            background: 'var(--db-surface)',
                            border: '1px solid var(--db-border)',
                            borderRadius: 'var(--db-radius-md)',
                            color: 'var(--db-text)',
                            fontSize: '13px',
                            outline: 'none',
                            resize: 'vertical',
                        }}
                    />
                </div>
            </div>

            {/* Section 2: Inception Parameters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3
                    style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--db-text)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        borderBottom: '1px solid var(--db-border)',
                        paddingBottom: '8px',
                    }}
                >
                    Inception Parameters
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)' }}>
                            Base Value <span style={{ color: 'var(--db-loss)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            step="any"
                            value={baseValue}
                            onChange={e => setBaseValue(Number(e.target.value))}
                            placeholder="1000"
                            style={{
                                padding: '10px 14px',
                                background: 'var(--db-surface)',
                                border: `1px solid ${getFieldError('baseValue') ? 'var(--db-loss)' : 'var(--db-border)'}`,
                                borderRadius: 'var(--db-radius-md)',
                                color: 'var(--db-text)',
                                fontSize: '13px',
                                outline: 'none',
                            }}
                        />
                        {getFieldError('baseValue') && (
                            <span style={{ fontSize: '11.5px', color: 'var(--db-loss)' }}>
                                {getFieldError('baseValue')}
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)' }}>
                            Base Date <span style={{ color: 'var(--db-loss)' }}>*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={baseDate}
                            onChange={e => setBaseDate(e.target.value)}
                            style={{
                                padding: '10px 14px',
                                background: 'var(--db-surface)',
                                border: `1px solid ${getFieldError('baseDate') ? 'var(--db-loss)' : 'var(--db-border)'}`,
                                borderRadius: 'var(--db-radius-md)',
                                color: 'var(--db-text)',
                                fontSize: '13px',
                                outline: 'none',
                            }}
                        />
                        {getFieldError('baseDate') && (
                            <span style={{ fontSize: '11.5px', color: 'var(--db-loss)' }}>
                                {getFieldError('baseDate')}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 3: Constituents */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3
                    style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--db-text)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        borderBottom: '1px solid var(--db-border)',
                        paddingBottom: '8px',
                    }}
                >
                    Basket Composition
                </h3>

                <ConstituentSelector
                    constituents={constituents}
                    onChange={setConstituents}
                    error={getFieldError('constituents') || getFieldError('weights')}
                />
            </div>

            {/* Form Action Buttons */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    paddingTop: '18px',
                    borderTop: '1px solid var(--db-border)',
                }}
            >
                <Button
                    variant="ghost"
                    size="md"
                    onClick={() => router.push('/admin/indices')}
                    disabled={isSubmitting}
                >
                    <X size={14} style={{ marginRight: '4px' }} /> Cancel
                </Button>

                <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        'Saving...'
                    ) : mode === 'create' ? (
                        <>
                            <Plus size={14} style={{ marginRight: '4px' }} /> Create Index
                        </>
                    ) : (
                        <>
                            <Check size={14} style={{ marginRight: '4px' }} /> Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
