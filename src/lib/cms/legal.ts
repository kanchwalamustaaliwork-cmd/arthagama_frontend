import { fetchCMS } from './client'
import type { CMSLegalPage } from '@/src/types/cms'

export async function getPrivacyPolicy(): Promise<CMSLegalPage | null> {
  return fetchCMS<CMSLegalPage>('/pages/privacy-policy', {
    tags: ['privacy-policy', 'pages'],
    revalidate: 86400, // 24 hours — legal pages change rarely
  })
}

export async function getTerms(): Promise<CMSLegalPage | null> {
  return fetchCMS<CMSLegalPage>('/pages/terms-conditions', {
    tags: ['terms-conditions', 'pages'],
    revalidate: 86400,
  })
}
