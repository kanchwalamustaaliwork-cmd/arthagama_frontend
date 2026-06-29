import HeroSection from '../components/home/HeroSection'
import WhatWeDoSection from '../components/home/WhatWeDoSection'
import BasicStatsSection from '../components/home/BasicStatsSection'
import StrategiesSection from '../components/home/StrategiesSection'
import BrokerIntegrationsSection from '../components/home/BrokerIntegrationsSection'
import FooterSection from '../components/FooterSection'

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <WhatWeDoSection />
        <BasicStatsSection />
        <StrategiesSection />
        <BrokerIntegrationsSection />
      </main>
      <FooterSection />
    </>
  )
}
