import GlobalBackground from '@/src/components/backgrounds/GlobalBackground'
import Navbar from '@/src/components/Navbar'
import FooterSection from '@/src/components/FooterSection'
import { getNavigation } from '@/src/lib/cms/navigation'
import { getFooter } from '@/src/lib/cms/footer'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [cmsNav, cmsFooter] = await Promise.all([
    getNavigation(),
    getFooter(),
  ])

  return (
    <>
      <GlobalBackground />
      <Navbar cmsNav={cmsNav} />
      {children}
      <FooterSection cmsFooter={cmsFooter} />
    </>
  )
}
