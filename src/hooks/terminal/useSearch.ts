'use client'

import { useState, useEffect } from 'react'
import {
    SearchQueryResponse,
    SearchResultItem,
    ContractItem,
    SymbolCardResult,
    ContractPickerResult,
    DirectResolutionResult,
    SearchListResult,
} from '@/src/types/terminal'
import { searchSdk } from '@/src/lib/terminal-sdk'

export type SearchResultShape =
    | { kind: 'search_list'; data: SearchListResult }
    | { kind: 'symbol_card'; data: SymbolCardResult }
    | { kind: 'contract_picker'; data: ContractPickerResult }
    | { kind: 'direct_resolution'; data: DirectResolutionResult }
    | { kind: 'empty' }
    | { kind: 'loading' }

export function useSearch(
    query: string,
    options?: {
        delay?: number
        instrumentType?: string
        exchange?: string
    },
) {
    const delay = options?.delay ?? 150

    // Legacy flat results list — kept for backward compat with InstrumentSearch
    const [results, setResults] = useState<SearchResultItem[]>([])
    // Structured result shape for new rendering logic
    const [resultShape, setResultShape] = useState<SearchResultShape>({ kind: 'empty' })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const q = query.trim()
        if (!q) {
            setResults([])
            setResultShape({ kind: 'empty' })
            setLoading(false)
            return
        }

        let isCurrent = true
        setLoading(true)
        setResultShape({ kind: 'loading' })

        const timer = setTimeout(() => {
            searchSdk
                .search(q, {
                    instrument_type: options?.instrumentType,
                    exchange: options?.exchange,
                })
                .then((data: SearchQueryResponse) => {
                    if (!isCurrent) return
                    setLoading(false)

                    if (data.result_type === 'search_list') {
                        setResultShape({ kind: 'search_list', data })
                        setResults([])
                    } else if (data.result_type === 'symbol_card') {
                        setResultShape({ kind: 'symbol_card', data })
                        setResults([])
                    } else if (data.result_type === 'contract_picker') {
                        setResultShape({ kind: 'contract_picker', data })
                        setResults(data.contracts.map(contractToLegacyItem))
                    } else if (data.result_type === 'direct_resolution') {
                        setResultShape({ kind: 'direct_resolution', data })
                        setResults([contractToLegacyItem(data.contract)])
                    } else {
                        setResultShape({ kind: 'empty' })
                        setResults([])
                    }
                })
                .catch(() => {
                    if (isCurrent) {
                        setResults([])
                        setResultShape({ kind: 'empty' })
                        setLoading(false)
                    }
                })
        }, delay)

        return () => {
            isCurrent = false
            clearTimeout(timer)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, delay, options?.instrumentType, options?.exchange])

    return { results, resultShape, loading }
}

function contractToLegacyItem(c: ContractItem): SearchResultItem {
    return {
        symbol: c.symbol,
        name: c.trading_symbol,
        exchange: c.display_exchange,
        instrument_type: c.instrument_type.toLowerCase() as any,
        strike: c.strike ?? undefined,
        option_type: c.option_type ?? undefined,
        expiry: c.expiry ?? undefined,
        token: c.token,
        segment: c.segment,
    }
}
