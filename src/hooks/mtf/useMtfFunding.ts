import { useState, useEffect } from 'react'
import { fundingApi } from '@/src/lib/api/mtf/funding.api'
import type { MtfBrokerCp, MtfBrokerCpSeries, MtfCpHolder, MtfAmcAllocation, MaturityWallBucket, CostVsRepoPoint } from '@/src/types/mtf'

function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true; setLoading(true)
    fn().then(d => { if (alive) { setData(d); setLoading(false) } }).catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { data, loading }
}

export const useCpOutstanding = () => useFetch<{ items: MtfBrokerCp[]; as_of: string; source: string; disclaimer: string }>(fundingApi.getCpOutstanding)
export const useCpOutstandingSeries = (p?: { broker_id?: string }) => useFetch<{ items: MtfBrokerCpSeries[]; as_of: string; source: string }>(() => fundingApi.getCpOutstandingSeries(p), [p?.broker_id])
export const useMaturityWall = () => useFetch<{ buckets: MaturityWallBucket[]; as_of: string; source: string; disclaimer: string }>(fundingApi.getMaturityWall)
export const useCostVsRepo = (p?: { broker_id?: string }) => useFetch<{ items: CostVsRepoPoint[]; as_of: string; source: string; disclaimer: string }>(() => fundingApi.getCostVsRepo(p), [p?.broker_id])
export const useCpHolders = (p?: { cadence?: 'M' | 'F'; broker_id?: string }) => useFetch<{ items: MtfCpHolder[]; as_of: string; source: string; disclaimer: string }>(() => fundingApi.getHolders(p), [p?.cadence, p?.broker_id])
export const useAmcAllocation = (p?: { cadence?: 'M' | 'F' }) => useFetch<{ items: MtfAmcAllocation[]; as_of: string; source: string; disclaimer: string }>(() => fundingApi.getAmcAllocation(p), [p?.cadence])
