import { useState } from 'react'
import type { StrategyEditFormData } from '@/src/types/admin'

type FieldEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

/**
 * Applies the category/universeType cross-field defaults that both the
 * create and edit strategy forms need:
 *  - Futures/Options -> universe is always 'custom' (and cleared)
 *  - Equity          -> defaults to the 'default' universe (NIFTY 50)
 *  - switching universeType manually mirrors the same default/clear rules
 */
function applyFieldSideEffects(
    prev: StrategyEditFormData,
    key: keyof StrategyEditFormData,
    value: StrategyEditFormData[keyof StrategyEditFormData]
): StrategyEditFormData {
    const updated: StrategyEditFormData = { ...prev, [key]: value }

    if (key === 'category') {
        if (value === 'Futures' || value === 'Options') {
            updated.universeType = 'custom'
            updated.universeName = ''
        } else if (value === 'Equity') {
            updated.universeType = 'default'
            updated.universeName = 'NIFTY 50'
            updated.instruments = ''
        }
    } else if (key === 'universeType') {
        if (value === 'default') {
            updated.universeName = 'NIFTY 50'
            updated.instruments = ''
        } else {
            updated.universeName = ''
        }
    }

    return updated
}

/**
 * Validates + normalizes a strategy form payload before it's sent to the API.
 * Returns an error message on failure, or the sanitized payload on success.
 */
export function buildStrategyPayload(
    form: StrategyEditFormData
): { error: string; payload?: never } | { error?: never; payload: StrategyEditFormData } {
    if (!form.name.trim()) return { error: 'Strategy Name is required' }

    const payload = { ...form }
    if (payload.category === 'Futures' || payload.category === 'Options') {
        payload.universeType = 'custom'
    }

    if (payload.universeType === 'custom') {
        if (!payload.universeName.trim()) return { error: 'Universe Name is required for custom universes' }
        if (!payload.instruments.trim()) return { error: 'Instruments are required for custom universes' }
    } else {
        if (!payload.universeName) return { error: 'Default Universe selection is required' }
        payload.instruments = '' // clear instruments for default universe
    }

    if (isNaN(payload.initialCapital) || payload.initialCapital < 0) {
        return { error: 'Initial Capital must be a valid non-negative number' }
    }

    if (isNaN(payload.riskFreeRate) || payload.riskFreeRate < 0) {
        return { error: 'Risk-Free Rate must be a valid non-negative number' }
    }

    return { payload }
}

export function useStrategyForm(initial: StrategyEditFormData) {
    const [form, setForm] = useState<StrategyEditFormData>(initial)

    const set = (k: keyof StrategyEditFormData) => (e: FieldEvent) => {
        let val: unknown
        if (e.target.type === 'checkbox') {
            val = (e.target as HTMLInputElement).checked
        } else if (e.target.type === 'number') {
            const rawVal = e.target.value
            val = rawVal === '' ? 0 : parseFloat(rawVal)
        } else {
            val = e.target.value
        }
        setForm(prev => applyFieldSideEffects(prev, k, val as never))
    }

    const setIsActive = (checked: boolean) => setForm(prev => ({ ...prev, isActive: checked }))

    return { form, setForm, set, setIsActive }
}