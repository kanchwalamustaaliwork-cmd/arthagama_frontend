import { fetchCMS } from './client'
import type { CMSSiteSettings } from '@/src/types/cms'

export async function getSiteSettings(): Promise<CMSSiteSettings | null> {
  return fetchCMS<CMSSiteSettings>('/site-settings', {
    tags: ['site-settings'],
    revalidate: 3600,
  })
}
