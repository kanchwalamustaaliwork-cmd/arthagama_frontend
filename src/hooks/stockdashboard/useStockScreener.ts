/**
 * src/hooks/stockdashboard/useStockScreener.ts
 *
 * Hook for stock screener filter builders, presets, execution, sorting, and pagination.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    ScreenerFilterFieldDefinition,
    ScreenerPreset,
    ScreenerStockResult,
    ScreenerFilterRule,
} from '@/src/types/stockdashboard'
import {
    getScreenerFilters,
    getScreenerPresets,
    runScreener,
} from '@/src/lib/api/stockdashboard/screener.api'

export function useStockScreener() {
    const [fields, setFields] = useState<ScreenerFilterFieldDefinition[]>([])
    const [presets, setPresets] = useState<ScreenerPreset[]>([])
    const [selectedPresetId, setSelectedPresetId] = useState<string>('')
    const [rules, setRules] = useState<ScreenerFilterRule[]>([
        { id: 'initial_1', field: 'roe', operator: 'gte', value: 15 },
        { id: 'initial_2', field: 'debtToEquity', operator: 'lte', value: 1.0 },
    ])
    const [exchange, setExchange] = useState<string>('ALL')
    const [sector, setSector] = useState<string>('ALL')
    const [sortBy, setSortBy] = useState<keyof ScreenerStockResult>('marketCapCr')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const [results, setResults] = useState<ScreenerStockResult[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 8

    // Initialize fields & presets
    useEffect(() => {
        Promise.all([getScreenerFilters(), getScreenerPresets()]).then(([f, p]) => {
            setFields(f)
            setPresets(p)
        })
    }, [])

    const executeScreen = useCallback(async () => {
        setLoading(true)
        try {
            const res = await runScreener({
                rules,
                exchange: exchange === 'ALL' ? undefined : exchange,
                sector: sector === 'ALL' ? undefined : sector,
                sortBy,
                sortDirection,
            })
            setResults(res)
            setCurrentPage(1)
        } catch {
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [rules, exchange, sector, sortBy, sortDirection])

    useEffect(() => {
        executeScreen()
    }, [executeScreen])

    const applyPreset = (presetId: string) => {
        setSelectedPresetId(presetId)
        const preset = presets.find(p => p.id === presetId)
        if (preset) {
            setRules([...preset.rules])
        }
    }

    const addRule = () => {
        const field = fields[0] || { id: 'peRatio', defaultOperator: 'lte' }
        const newRule: ScreenerFilterRule = {
            id: `rule_${Date.now()}`,
            field: field.id,
            operator: field.defaultOperator as any,
            value: 25,
        }
        setRules(prev => [...prev, newRule])
        setSelectedPresetId('')
    }

    const updateRule = (id: string, updates: Partial<ScreenerFilterRule>) => {
        setRules(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)))
        setSelectedPresetId('')
    }

    const removeRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id))
        setSelectedPresetId('')
    }

    const resetRules = () => {
        setRules([])
        setSelectedPresetId('')
        setExchange('ALL')
        setSector('ALL')
    }

    // Pagination
    const totalPages = Math.ceil(results.length / pageSize) || 1
    const paginatedResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    return {
        fields,
        presets,
        selectedPresetId,
        rules,
        exchange,
        setExchange,
        sector,
        setSector,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        results: paginatedResults,
        totalCount: results.length,
        loading,
        currentPage,
        setCurrentPage,
        totalPages,
        applyPreset,
        addRule,
        updateRule,
        removeRule,
        resetRules,
        executeScreen,
    }
}
