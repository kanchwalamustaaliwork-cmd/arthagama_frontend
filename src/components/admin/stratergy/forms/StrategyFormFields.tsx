import type { StrategyEditFormData, AdminStrategyStatus } from '@/src/types/admin'
import { fieldStyle, inputStyle, disabledInputStyle, selectStyle, labelStyle, gridTwoColStyle } from './strategyFormStyles'

type FieldEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export interface StatusOption {
    value: AdminStrategyStatus | string
    label: string
}

interface StrategyFormFieldsProps {
    form: StrategyEditFormData
    set: (k: keyof StrategyEditFormData) => (e: FieldEvent) => void
    setIsActive: (checked: boolean) => void
    /** What to show in the (always read-only) Owner Admin field */
    ownerAdminLabel: string
    /** Status dropdown options differ between create (limited) and edit (full lifecycle) */
    statusOptions: StatusOption[]
    /** Checkbox label differs slightly between create ("Set active immediately") and edit ("Active state enabled") */
    activeCheckboxLabel: string
    activeCheckboxId: string
    /** Show the required-field asterisk (create form only) */
    nameRequired?: boolean
}

export default function StrategyFormFields({
    form,
    set,
    setIsActive,
    ownerAdminLabel,
    statusOptions,
    activeCheckboxLabel,
    activeCheckboxId,
    nameRequired = false,
}: StrategyFormFieldsProps) {
    const showDefaultUniverseName = form.universeType === 'default' && form.category === 'Equity'

    return (
        <>
            <div>
                <label style={labelStyle}>Strategy Name {nameRequired && '*'}</label>
                <input
                    value={form.name}
                    onChange={set('name')}
                    placeholder="e.g. Nifty Mean Reversion Bands"
                    style={inputStyle}
                    required
                />
            </div>

            <div>
                <label style={labelStyle}>Summary</label>
                <input
                    value={form.summary}
                    onChange={set('summary')}
                    placeholder="e.g. Short-term mean reversion on index components"
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={labelStyle}>Description</label>
                <textarea
                    value={form.description}
                    onChange={set('description')}
                    rows={3}
                    placeholder="Explain the high-level logic, timeframe, and goals of this strategy..."
                    style={fieldStyle}
                />
            </div>

            <div style={gridTwoColStyle()}>
                <div>
                    <label style={labelStyle}>Category</label>
                    <select value={form.category} onChange={set('category')} style={selectStyle}>
                        <option value="Options">Options</option>
                        <option value="Futures">Futures</option>
                        <option value="Equity">Equity</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Owner Admin</label>
                    <input value={ownerAdminLabel} style={disabledInputStyle} disabled />
                </div>
            </div>

            <div style={gridTwoColStyle()}>
                <div>
                    <label style={labelStyle}>Database Name</label>
                    <input
                        value={form.databaseName}
                        onChange={set('databaseName')}
                        placeholder="e.g. timescale_nifty_prod"
                        style={inputStyle}
                    />
                </div>
                {form.category === 'Equity' ? (
                    <div>
                        <label style={labelStyle}>Universe Type</label>
                        <select value={form.universeType} onChange={set('universeType')} style={selectStyle}>
                            <option value="default">Default Universe</option>
                            <option value="custom">Custom Universe</option>
                        </select>
                    </div>
                ) : (
                    <div>
                        <label style={labelStyle}>Universe Type</label>
                        <input value="Custom Universe" style={disabledInputStyle} disabled />
                    </div>
                )}
            </div>

            {showDefaultUniverseName ? (
                <div style={gridTwoColStyle()}>
                    <div>
                        <label style={labelStyle}>Default Universe Name</label>
                        <input value={form.universeName} onChange={set('universeName')} placeholder="e.g. NIFTY 50" style={inputStyle} />
                    </div>
                    <div />
                </div>
            ) : (
                <div style={gridTwoColStyle()}>
                    <div>
                        <label style={labelStyle}>Universe Name</label>
                        <input value={form.universeName} onChange={set('universeName')} placeholder="e.g. Momentum Stocks" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Instruments (Comma-separated)</label>
                        <input
                            value={form.instruments}
                            onChange={set('instruments')}
                            placeholder="e.g. RELIANCE, TCS, INFY, HDFCBANK"
                            style={inputStyle}
                        />
                    </div>
                </div>
            )}

            <div style={gridTwoColStyle()}>
                <div>
                    <label style={labelStyle}>Status</label>
                    <select value={form.status} onChange={set('status')} style={selectStyle}>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                    <input
                        type="checkbox"
                        id={activeCheckboxId}
                        checked={form.isActive}
                        onChange={e => setIsActive(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--db-mint)', cursor: 'pointer' }}
                    />
                    <label htmlFor={activeCheckboxId} style={{ fontSize: '13px', color: 'var(--db-text-2)', cursor: 'pointer', userSelect: 'none' }}>
                        {activeCheckboxLabel}
                    </label>
                </div>
            </div>
        </>
    )
}