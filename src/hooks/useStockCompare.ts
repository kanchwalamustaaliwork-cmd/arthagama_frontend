import { useMemo, useState } from 'react'
import { STOCKS } from '../data/stocks'
import type { Stock } from '../types/compareStocks'
import { useDebounce } from './useDebounce'

const MAX_SELECTED = 4

export function useStockCompare() {
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['RELIANCE', 'TCS'])
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 300)
    const activeQuery = query === '' ? '' : debouncedQuery

    const selected: Stock[] = useMemo(
        () => selectedSymbols.map((s) => STOCKS.find((stock) => stock.symbol === s)!).filter(Boolean),
        [selectedSymbols]
    )

    const availableResults = useMemo(() => {
        const q = activeQuery.trim().toLowerCase()
        return STOCKS.filter(
            (s) =>
                !selectedSymbols.includes(s.symbol) &&
                (q.length === 0 || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
        )
    }, [activeQuery, selectedSymbols])

    const canAddMore = selectedSymbols.length < MAX_SELECTED

    const addStock = (symbol: string) => {
        if (!canAddMore || selectedSymbols.includes(symbol)) return
        setSelectedSymbols((prev) => [...prev, symbol])
        setQuery('')
    }

    const removeStock = (symbol: string) => {
        setSelectedSymbols((prev) => prev.filter((s) => s !== symbol))
    }

    return { selected, availableResults, query, setQuery, addStock, removeStock, canAddMore, maxSelected: MAX_SELECTED }
}