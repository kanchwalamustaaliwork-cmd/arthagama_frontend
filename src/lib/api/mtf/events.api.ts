import { apiGet } from '@/src/api/axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfEventsPage, MtfEventType } from '@/src/types/mtf'

export const eventsApi = {
  getEvents: (p?: { type?: MtfEventType; since?: string; page?: number; size?: number }) =>
    apiGet<MtfEventsPage>(MTF_ENDPOINTS.events, { params: p }).then(r => r.data),
}
