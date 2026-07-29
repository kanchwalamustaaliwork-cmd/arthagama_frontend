"use client"

import AboutHero from '../components/about/AboutHero'
import AboutIntro from '../components/about/AboutIntro'
import TeamSection from '../components/about/TeamSection'
import type { CMSAboutPage, CMSTeamMember } from '../types/cms'

interface AboutPageViewProps {
  cmsAbout?: CMSAboutPage | null
  cmsTeam?: CMSTeamMember[]
}

export default function AboutPageView({ cmsAbout, cmsTeam }: AboutPageViewProps) {
  return (
    <div className="relative min-h-screen w-full">
      <AboutHero cmsHero={cmsAbout?.hero} />
      <AboutIntro cmsAbout={cmsAbout?.missionVision} />
      <TeamSection cmsTeam={cmsTeam} />
    </div>
  )
}