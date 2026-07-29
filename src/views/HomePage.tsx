"use client"

import HeroSection from '../components/home/HeroSection'
import WhatWeDoSection from '../components/home/WhatWeDoSection'
import BasicStatsSection from '../components/home/BasicStatsSection'
import StrategiesSection from '../components/home/StrategiesSection'
import type { CMSHomePage } from '../types/cms'

interface HomePageViewProps {
  cmsData?: CMSHomePage | null
}

export default function HomePageView({ cmsData }: HomePageViewProps) {
  return (
    <>
      <main>
        <HeroSection cmsHero={cmsData?.hero} />
        <WhatWeDoSection cmsData={cmsData?.whatWeDo} />
        <BasicStatsSection />
        <StrategiesSection cmsData={cmsData?.strategiesSection} />
      </main>
    </>
  )
}
