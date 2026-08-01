import { fetchCMS } from './client'
import type { CMSServiceLandingPage } from '@/src/types/cms'

export async function getServices(): Promise<CMSServiceLandingPage | null> {
  return fetchCMS<CMSServiceLandingPage>('/pages/services', {
    tags: ['services', 'pages'],
    revalidate: 3600,
  })
}

export async function getServicesLanding(): Promise<CMSServiceLandingPage | null> {
  return getServices()
}


