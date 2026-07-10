import GlobalBackground from '@/src/components/backgrounds/GlobalBackground'
import Navbar from '@/src/components/Navbar'
import FooterSection from '@/src/components/FooterSection'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalBackground />
      <Navbar />
      {children}
      <FooterSection />
    </>
  )
}
