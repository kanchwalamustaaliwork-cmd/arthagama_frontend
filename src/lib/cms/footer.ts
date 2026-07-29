import { fetchCMS } from './client'
import type { CMSFooter } from '@/src/types/cms'

export async function getFooter(): Promise<CMSFooter | null> {
  return fetchCMS<CMSFooter>('/footer', {
    tags: ['footer'],
    revalidate: 3600,
  })
}
