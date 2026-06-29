import HeroSection from '../components/HeroSection'
import WorksSection from '../components/WorksSection'
import JournalSection from '../components/JournalSection'
import ExplorationsSection from '../components/ExplorationsSection'
import StatsSection from '../components/StatsSection'
import FooterSection from '../components/FooterSection'

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <WorksSection />
        <JournalSection />
        <ExplorationsSection />
        <StatsSection />
      </main>
      <FooterSection />
    </>
  )
}
