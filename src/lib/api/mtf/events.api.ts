import axios from 'axios'
import { MTF_ENDPOINTS } from './endpoints'
import type { MtfEventsPage, MtfEventType } from '@/src/types/mtf'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? '' })

export const eventsApi = {
  getEvents: (p?: { type?: MtfEventType; since?: string; page?: number; size?: number }) =>
    api.get<MtfEventsPage>(MTF_ENDPOINTS.events, { params: p }).then(r => r.data),
}
