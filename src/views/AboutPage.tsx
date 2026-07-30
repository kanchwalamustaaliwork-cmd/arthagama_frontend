"use client"

import AboutHero from '../components/about/AboutHero'
import AboutIntro from '../components/about/AboutIntro'
import CompanyValuesSection from '../components/about/CompanyValuesSection'
import CompanyJourneySection from '../components/about/CompanyJourneySection'
import CompanyNumbersSection from '../components/about/CompanyNumbersSection'
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
      <AboutHero cmsHero={cmsAbout?.hero} />
      <AboutIntro cmsAbout={cmsAbout?.missionVision} />
      <CompanyValuesSection values={cmsAbout?.companyValues} />
      <CompanyJourneySection journey={cmsAbout?.journey} />
      <CompanyNumbersSection numbers={cmsAbout?.companyNumbers} />
      <TeamSection
        cmsTeam={cmsTeam}
        heading={cmsAbout?.teamSectionHeading}
        subtext={cmsAbout?.teamSectionSubtext}
      />
      <AboutCtaSection cta={cmsAbout?.cta} />
    </div>
  )
}