import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfPeriodReport, MtfDayReport, ReportPeriod } from '@/src/types/mtf'

export const reportsApi = {
  getPeriodReport: (period: ReportPeriod, key: string) =>
    apiGet<MtfPeriodReport>(MTF_ENDPOINTS.report(period, key)).then(r => r.data),
  getDayReport: (isoDate: string) =>
    apiGet<MtfDayReport>(MTF_ENDPOINTS.dayReport(isoDate)).then(r => r.data),
}
