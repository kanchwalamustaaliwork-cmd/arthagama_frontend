import { fetchCMS } from './client'
import type { CMSServiceLandingPage } from '@/src/types/cms'
import type { ServiceSummary } from '@/src/types/services'

export async function getServicesLanding(): Promise<CMSServiceLandingPage | null> {
  return fetchCMS<CMSServiceLandingPage>('/pages/services', {
    tags: ['services-landing', 'pages'],
    revalidate: 3600,
  })
}

export async function getServices(): Promise<ServiceSummary[]> {
  const data = await fetchCMS<ServiceSummary[]>('/services', {
    tags: ['services'],
    revalidate: 3600,
  })
  return data ?? []
}

