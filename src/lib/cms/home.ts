import { fetchCMS } from './client'
import type { CMSHomePage } from '@/src/types/cms'

export async function getHomePage(): Promise<CMSHomePage | null> {
  return fetchCMS<CMSHomePage>('/pages/home', {
    tags: ['home', 'pages'],
    revalidate: 3600,
  })
}
