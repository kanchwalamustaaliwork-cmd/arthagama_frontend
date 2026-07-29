import { fetchCMS } from './client'
import type { CMSAboutPage, CMSTeamMember } from '@/src/types/cms'

export async function getAboutPage(): Promise<CMSAboutPage | null> {
  return fetchCMS<CMSAboutPage>('/pages/about', {
    tags: ['about', 'pages'],
    revalidate: 3600,
  })
}

export async function getTeamMembers(): Promise<CMSTeamMember[]> {
  const data = await fetchCMS<CMSTeamMember[]>('/team', {
    tags: ['team'],
    revalidate: 3600,
  })
  return data ?? []
}
