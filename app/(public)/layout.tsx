import GlobalBackground from '@/src/components/backgrounds/GlobalBackground'
import Navbar from '@/src/components/Navbar'
import FooterSection from '@/src/components/FooterSection'
import { getNavigation } from '@/src/lib/cms/navigation'
import { getFooter } from '@/src/lib/cms/footer'
import { getSiteSettings } from '@/src/lib/cms/siteSettings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [cmsNav, cmsFooter, cmsSiteSettings] = await Promise.all([
    getNavigation(),
    getFooter(),
    getSiteSettings(),
  ])

  const videoUrl =
    cmsSiteSettings?.backgroundVideoUrl || cmsSiteSettings?.backgroundVideo?.url || null

  return (
    <>
      <GlobalBackground videoUrl={videoUrl} />
      <Navbar cmsNav={cmsNav} />
      {children}
      <FooterSection cmsFooter={cmsFooter} />
    </>
  )
}
