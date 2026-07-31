"use client"

import Hero from '../components/ui/Hero'
import ServiceContainer from '../components/services/ServiceContainer'
import { SERVICES } from '../data/services'
import type { ServiceSummary } from '../types/services'
import type { CMSServiceLandingPage } from '../types/cms'

interface ServicesPageViewProps {
  cmsServices?: ServiceSummary[]
  cmsLanding?: CMSServiceLandingPage | null
}

export default function ServicesPageView({ cmsServices, cmsLanding }: ServicesPageViewProps) {
  const services: ServiceSummary[] =
    cmsServices && cmsServices.length > 0
      ? cmsServices
      : SERVICES

  return (
    <div className="relative min-h-screen w-full pb-24">
      <Hero
        title={cmsLanding?.servicesHero?.heading ?? 'Services built for every stage of your trading journey'}
        titleHighlight={cmsLanding?.servicesHero?.titleHighlight ?? 'every stage'}
        subtitle={
          cmsLanding?.servicesHero?.subtitle ??
          '"From building a strategy to trading it live — explore how ARTHAGAMA can work with you."'
        }
        backgroundImage={cmsLanding?.servicesHero?.backgroundImage}
      />
      <section className="cv-section relative px-5 py-10 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-20 sm:gap-24 md:gap-28">
          {services.map((service, i) => (
            <ServiceContainer key={service.slug} service={service} reverse={i % 2 === 1} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}