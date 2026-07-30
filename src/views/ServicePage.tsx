"use client"

import ServicesHero from '../components/services/ServicesHero'
import ServiceContainer from '../components/services/ServiceContainer'
import { SERVICES } from '../data/services'
import type { ServiceSummary, ServiceVisualType } from '../types/services'
import type { CMSServicePage, CMSServiceLandingPage } from '../types/cms'

const VISUAL_MAP: Record<string, ServiceVisualType> = {
  'custom-strategy-builder': 'terminal',
  'backtest': 'backtest',
  'research-report': 'research',
  'trade-with-us': 'execution',
  'compare-stocks': 'compare',
}

interface ServicesPageViewProps {
  cmsServices?: CMSServicePage[]
  cmsLanding?: CMSServiceLandingPage | null
}

function cmsToServiceSummary(svc: CMSServicePage): ServiceSummary {
  return {
    slug: svc.slug,
    title: svc.title,
    shortDescription: svc.shortDescription ?? '',
    highlights: svc.highlights ?? [],
    visual: VISUAL_MAP[svc.slug] ?? 'terminal',
    ctaLabel: svc.hero?.cta?.label ?? 'View Details',
  }
}

export default function ServicesPageView({ cmsServices, cmsLanding }: ServicesPageViewProps) {
  const services: ServiceSummary[] =
    cmsServices && cmsServices.length > 0
      ? cmsServices.map(cmsToServiceSummary)
      : SERVICES

  return (
    <div className="relative min-h-screen w-full pb-24">
      <ServicesHero
        heading={cmsLanding?.servicesHero?.heading}
        subtitle={cmsLanding?.servicesHero?.subtitle}
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