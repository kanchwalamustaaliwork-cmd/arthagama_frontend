"use client"

import Hero from '../components/ui/Hero'
import AboutIntro from '../components/about/AboutIntro'
import CompanyValuesSection from '../components/about/CompanyValuesSection'
import CompanyJourneySection from '../components/about/CompanyJourneySection'
import TeamSection from '../components/about/TeamSection'
import AboutCtaSection from '../components/about/AboutCtaSection'
import type { CMSAboutPage, CMSTeamMember } from '../types/cms'

interface AboutPageViewProps {
  cmsAbout?: CMSAboutPage | null
  cmsTeam?: CMSTeamMember[]
}

export default function AboutPageView({ cmsAbout, cmsTeam }: AboutPageViewProps) {
  return (
    <div className="relative min-h-screen w-full">
      <Hero
        title={cmsAbout?.hero?.title ?? 'Building the Future of'}
        titleHighlight={cmsAbout?.hero?.titleHighlight ?? 'Algorithmic Trading'}
        subtitle={cmsAbout?.hero?.subtitle ?? '"Where innovation meets precision, and every decision is backed by data."'}
        backgroundImage={cmsAbout?.hero?.backgroundImage}
      />
      <AboutIntro cmsAbout={cmsAbout?.missionVision} />
      <CompanyValuesSection values={cmsAbout?.companyValues} />
      <CompanyJourneySection journey={cmsAbout?.journey} />
      <TeamSection
        cmsTeam={cmsTeam}
        heading={cmsAbout?.teamSectionHeading}
        subtext={cmsAbout?.teamSectionSubtext}
      />
      <AboutCtaSection cta={cmsAbout?.cta} />
    </div>
  )
}