import { useState, useEffect } from 'react'
import { stocksApi } from '@/src/lib/api/mtf/stocks.api'
import type { MtfStocksPage, MtfStockDetail, MtfStockFilters, StockHistoryResponse } from '@/src/types/mtf'

function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    setLoading(true)
    fn().then(d => { if (alive) { setData(d); setLoading(false) } })
       .catch(e => { if (alive) { setError(String(e)); setLoading(false) } })
    return () => { alive = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { data, loading, error }
}

export const useMtfStocks = (f?: MtfStockFilters) =>
  useFetch<MtfStocksPage>(() => stocksApi.getStocks(f), [JSON.stringify(f)])

export const useMtfStock = (isin: string) =>
  useFetch<MtfStockDetail>(() => {
    if (!isin || isin.toLowerCase() === 'undefined') return Promise.resolve(null as any)
    return stocksApi.getStock(isin)
  }, [isin])

export const useMtfStockHistory = (isin: string, p?: { from?: string; to?: string }) =>
  useFetch<StockHistoryResponse>(() => {
    if (!isin || isin.toLowerCase() === 'undefined') return Promise.resolve(null as any)
    return stocksApi.getStockHistory(isin, p)
  }, [isin, p?.from, p?.to])
