import { useState, useEffect } from 'react'
import { overviewApi } from '@/src/lib/api/mtf/overview.api'
import type { MtfSummary, MtfDailyTotal, MtfDailyFlow, MtfDailyBreadth, MtfBookComposition, MtfTradedValue, MtfOverviewResponse } from '@/src/types/mtf'

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

export const useMtfSummary = () => useFetch<MtfSummary>(overviewApi.getSummary)
export const useMtfTotals = (p?: { from?: string; to?: string; exchange?: string }) =>
  useFetch<MtfOverviewResponse<MtfDailyTotal>>(() => overviewApi.getTotals(p), [p?.from, p?.to, p?.exchange])
export const useMtfFlow = (p?: { from?: string; to?: string }) =>
  useFetch<MtfOverviewResponse<MtfDailyFlow>>(() => overviewApi.getFlow(p), [p?.from, p?.to])
export const useMtfBreadth = (p?: { from?: string; to?: string }) =>
  useFetch<MtfOverviewResponse<MtfDailyBreadth>>(() => overviewApi.getBreadth(p), [p?.from, p?.to])
export const useMtfComposition = (p?: { from?: string; to?: string }) =>
  useFetch<MtfOverviewResponse<MtfBookComposition>>(() => overviewApi.getComposition(p), [p?.from, p?.to])
export const useMtfTradedValue = (p?: { from?: string; to?: string }) =>
  useFetch<MtfOverviewResponse<MtfTradedValue>>(() => overviewApi.getTradedValue(p), [p?.from, p?.to])
