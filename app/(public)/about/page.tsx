import { getAboutPage, getTeamMembers } from '@/src/lib/cms/about'
import AboutPageView from '@/src/views/AboutPage'

export default async function AboutPage() {
  const [cmsAbout, cmsTeam] = await Promise.all([getAboutPage(), getTeamMembers()])
  return <AboutPageView cmsAbout={cmsAbout} cmsTeam={cmsTeam} />
}
