"use client"

import HeroSection from '../components/home/HeroSection'
import WhatWeDoSection from '../components/home/WhatWeDoSection'
import BasicStatsSection from '../components/home/BasicStatsSection'
import StrategiesSection from '../components/home/StrategiesSection'

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <WhatWeDoSection />
        <BasicStatsSection />
        <StrategiesSection />
      </main>
    </>
  )
}
