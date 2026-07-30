import { fetchCMS } from './client'
import type { CMSHomePage, CMSStatistic, CMSTestimonial, CMSPartner } from '@/src/types/cms'

export async function getHomePage(): Promise<CMSHomePage | null> {
  return fetchCMS<CMSHomePage>('/pages/home', {
    tags: ['home', 'pages'],
    revalidate: 3600,
  })
}

export async function getStatistics(): Promise<CMSStatistic[]> {
  const data = await fetchCMS<CMSStatistic[]>('/statistics', {
    tags: ['statistics'],
    revalidate: 3600,
  })
  return data ?? []
}

export async function getTestimonials(): Promise<CMSTestimonial[]> {
  const data = await fetchCMS<CMSTestimonial[]>('/testimonials', {
    tags: ['testimonials'],
    revalidate: 3600,
  })
  return data ?? []
}

export async function getPartners(): Promise<CMSPartner[]> {
  const data = await fetchCMS<CMSPartner[]>('/partners', {
    tags: ['partners'],
    revalidate: 3600,
  })
  return data ?? []
}
