/**
 * src/components/stockdashboard/screener/FilterBuilder.tsx
 *
 * Interactive rule row builder for Stock Screener filters.
 */

'use client'

import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ScreenerFilterRule, ScreenerFilterFieldDefinition, ScreenerOperator } from '@/src/types/stockdashboard'

interface FilterBuilderProps {
    rules: ScreenerFilterRule[]
    fields: ScreenerFilterFieldDefinition[]
    onAddRule: () => void
    onUpdateRule: (id: string, updates: Partial<ScreenerFilterRule>) => void
    onRemoveRule: (id: string) => void
}

const OPERATORS: { id: ScreenerOperator; label: string }[] = [
    { id: 'gte', label: '≥ Greater than or Equal' },
    { id: 'gt', label: '> Greater than' },
    { id: 'lte', label: '≤ Less than or Equal' },
    { id: 'lt', label: '< Less than' },
    { id: 'eq', label: '= Equal to' },
    { id: 'between', label: 'Between (Range)' },
]

export function FilterBuilder({
    rules,
    fields,
    onAddRule,
    onUpdateRule,
    onRemoveRule,
}: FilterBuilderProps) {
    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '20px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                    Screener Filter Rules ({rules.length})
                </h3>
                <button
                    onClick={onAddRule}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'var(--db-teal, #244147)',
                        color: 'var(--db-mint, #B8CEC2)',
                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.2))',
                        cursor: 'pointer',
                    }}
                >
                    <Plus size={14} /> Add Filter Rule
                </button>
            </div>

            {rules.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--db-text-muted, #708482)', fontSize: '13px' }}>
                    No filter rules applied. All universe stocks will be returned. Click &ldquo;Add Filter Rule&rdquo; or select a preset above.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {rules.map(rule => {
                        const fieldDef = fields.find(f => f.id === rule.field) || fields[0]
                        const isBetween = rule.operator === 'between'

                        return (
                            <div
                                key={rule.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    background: 'var(--db-elevated, #20353A)',
                                    borderRadius: '10px',
                                    padding: '10px 14px',
                                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                                }}
                            >
                                {/* Metric Field Select */}
                                <select
                                    value={rule.field}
                                    onChange={e => onUpdateRule(rule.id, { field: e.target.value })}
                                    style={{
                                        background: 'var(--db-surface, #18282C)',
                                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                        borderRadius: '6px',
                                        padding: '6px 10px',
                                        color: 'var(--db-text, #F7FAF9)',
                                        fontSize: '12.5px',
                                        outline: 'none',
                                    }}
                                >
                                    {fields.map(f => (
                                        <option key={f.id} value={f.id} style={{ background: '#18282C', color: '#F7FAF9' }}>
                                            {f.label} ({f.unit || 'Score'})
                                        </option>
                                    ))}
                                </select>

                                {/* Operator Select */}
                                <select
                                    value={rule.operator}
                                    onChange={e => onUpdateRule(rule.id, { operator: e.target.value as any })}
                                    style={{
                                        background: 'var(--db-surface, #18282C)',
                                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                        borderRadius: '6px',
                                        padding: '6px 10px',
                                        color: 'var(--db-mint, #B8CEC2)',
                                        fontSize: '12.5px',
                                        fontWeight: 600,
                                        outline: 'none',
                                    }}
                                >
                                    {OPERATORS.map(op => (
                                        <option key={op.id} value={op.id} style={{ background: '#18282C', color: '#F7FAF9' }}>
                                            {op.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Value Input */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <input
                                        type="number"
                                        value={rule.value}
                                        onChange={e => onUpdateRule(rule.id, { value: Number(e.target.value) })}
                                        style={{
                                            width: '100px',
                                            background: 'var(--db-surface, #18282C)',
                                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                            borderRadius: '6px',
                                            padding: '6px 10px',
                                            color: 'var(--db-text, #F7FAF9)',
                                            fontSize: '12.5px',
                                            fontFamily: 'Consolas, monospace',
                                            outline: 'none',
                                        }}
                                    />
                                    {fieldDef?.unit && (
                                        <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                                            {fieldDef.unit}
                                        </span>
                                    )}
                                </div>

                                {/* Secondary Value Input for 'between' */}
                                {isBetween && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>and</span>
                                        <input
                                            type="number"
                                            value={rule.secondaryValue ?? 100}
                                            onChange={e => onUpdateRule(rule.id, { secondaryValue: Number(e.target.value) })}
                                            style={{
                                                width: '100px',
                                                background: 'var(--db-surface, #18282C)',
                                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                                                borderRadius: '6px',
                                                padding: '6px 10px',
                                                color: 'var(--db-text, #F7FAF9)',
                                                fontSize: '12.5px',
                                                fontFamily: 'Consolas, monospace',
                                                outline: 'none',
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Delete Rule Button */}
                                <button
                                    onClick={() => onRemoveRule(rule.id)}
                                    style={{
                                        marginLeft: 'auto',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--db-loss, #E35D6A)',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    title="Remove rule"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
