import { fetchCMS } from './client'
import type { CMSNavigation } from '@/src/types/cms'

export async function getNavigation(): Promise<CMSNavigation | null> {
  return fetchCMS<CMSNavigation>('/navigation', {
    tags: ['navigation'],
    revalidate: 3600,
  })
}
