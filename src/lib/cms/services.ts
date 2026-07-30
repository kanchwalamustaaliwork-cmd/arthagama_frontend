import { fetchCMS } from './client'
import type { CMSServicePage, CMSServiceLandingPage } from '@/src/types/cms'

export async function getServicesLanding(): Promise<CMSServiceLandingPage | null> {
  return fetchCMS<CMSServiceLandingPage>('/pages/services', {
    tags: ['services-landing', 'pages'],
    revalidate: 3600,
  })
}

export async function getServices(): Promise<CMSServicePage[]> {
  const data = await fetchCMS<CMSServicePage[]>('/services', {
    tags: ['services'],
    revalidate: 3600,
  })
  return data ?? []
}

export async function getService(slug: string): Promise<CMSServicePage | null> {
  return fetchCMS<CMSServicePage>(`/services/${slug}`, {
    tags: ['services', `service-${slug}`],
    revalidate: 3600,
  })
}
