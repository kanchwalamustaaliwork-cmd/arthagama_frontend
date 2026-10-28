import { useState, useEffect } from 'react'
import { eventsApi } from '@/src/lib/api/mtf/events.api'
import { freefloatApi } from '@/src/lib/api/mtf/freefloat.api'
import { reportsApi } from '@/src/lib/api/mtf/reports.api'
import type { MtfEventsPage, MtfEventType, MtfDematHolding, MtfMarketCapHistory, MtfPeriodReport, MtfDayReport, ReportPeriod } from '@/src/types/mtf'

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

export const useMtfEvents = (p?: { type?: MtfEventType; since?: string; page?: number; size?: number }) =>
  useFetch<MtfEventsPage>(() => eventsApi.getEvents(p), [p?.type, p?.since, p?.page, p?.size])

export const useFreefloatSeries = () =>
  useFetch<{ items: MtfDematHolding[]; as_of: string; source: string }>(freefloatApi.getSeries)

export const useMarketCapHistory = (p?: { from?: string; to?: string }) =>
  useFetch<{ items: MtfMarketCapHistory[]; as_of: string; source: string }>(() => freefloatApi.getMarketCap(p), [p?.from, p?.to])

export const useMtfReport = (period: ReportPeriod, key: string) =>
  useFetch<MtfPeriodReport>(() => reportsApi.getPeriodReport(period, key), [period, key])

export const useDayReport = (isoDate: string) =>
  useFetch<MtfDayReport>(() => reportsApi.getDayReport(isoDate), [isoDate])

