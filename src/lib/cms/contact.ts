import { fetchCMS } from './client'
import type { CMSContactPage } from '@/src/types/cms'

export async function getContactPage(): Promise<CMSContactPage | null> {
  return fetchCMS<CMSContactPage>('/pages/contact', {
    tags: ['contact', 'pages'],
    revalidate: 3600,
  })
}
