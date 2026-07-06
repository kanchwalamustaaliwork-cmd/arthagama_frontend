"use client"

import AboutHero from '../components/about/AboutHero'
import AboutIntro from '../components/about/AboutIntro'
import TeamSection from '../components/about/TeamSection'

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full">
      <AboutHero />
      <AboutIntro />
      <TeamSection />
    </div>
  )
}