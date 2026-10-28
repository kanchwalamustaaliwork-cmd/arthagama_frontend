import axios from 'axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfPeriodReport, MtfDayReport, ReportPeriod } from '@/src/types/mtf'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? '' })

export const reportsApi = {
  getPeriodReport: (period: ReportPeriod, key: string) =>
    api.get<MtfPeriodReport>(MTF_ENDPOINTS.report(period, key)).then(r => r.data),
  getDayReport: (isoDate: string) =>
    api.get<MtfDayReport>(MTF_ENDPOINTS.dayReport(isoDate)).then(r => r.data),
}
