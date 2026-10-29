import { useState, useEffect } from 'react'
import { brokersApi } from '@/src/lib/api/mtf/brokers.api'
import type { BrokerRankingResponse, BrokerHistoryResponse } from '@/src/types/mtf'

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

export const useMtfBrokers = () => useFetch<BrokerRankingResponse>(brokersApi.getBrokers)

export const useBrokerHistory = (slug: string = 'all', p?: { from?: string; to?: string }) =>
  useFetch<BrokerHistoryResponse>(
    () => brokersApi.getBrokerHistory(slug, p), [slug, p?.from, p?.to])
