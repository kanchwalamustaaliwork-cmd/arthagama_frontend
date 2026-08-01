"use client"

import HeroSection from '../components/home/HeroSection'
import WhatWeDoSection from '../components/home/WhatWeDoSection'
import BasicStatsSection from '../components/home/BasicStatsSection'
import StrategiesSection from '../components/home/StrategiesSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import HomeFaqSection from '../components/home/HomeFaqSection'
import HomeCtaSection from '../components/home/HomeCtaSection'
import type { CMSHomePage, CMSStatistic, CMSTestimonial, CMSNavigation } from '../types/cms'

interface HomePageViewProps {
  cmsData?: CMSHomePage | null
  cmsStats?: CMSStatistic[]
  cmsTestimonials?: CMSTestimonial[]
  cmsNav?: CMSNavigation | null
}

export default function HomePageView({
  cmsData,
  cmsStats,
  cmsTestimonials,
  cmsNav,
}: HomePageViewProps) {
  const testimonials = cmsData?.homeTestimonials?.testimonials && cmsData.homeTestimonials.testimonials.length > 0
    ? cmsData.homeTestimonials.testimonials
    : cmsTestimonials
  console.log(cmsData)
  return (
    <main>
      <HeroSection cmsHero={cmsData?.hero} socialLinks={cmsNav?.heroSocialLinks} />
      <WhatWeDoSection cmsData={cmsData?.whatWeDo} />
      <BasicStatsSection cmsStats={cmsStats} />
      <StrategiesSection cmsData={cmsData?.strategiesSection} />
      {cmsData?.homeTestimonials?.visible !== false && (
        <TestimonialsSection testimonials={testimonials} heading={cmsData?.homeTestimonials?.heading} />
      )}
      <HomeFaqSection faqs={cmsData?.homeFaq?.faqs} heading={cmsData?.homeFaq?.heading} />
      <HomeCtaSection cmsCta={cmsData?.homeCta} />
    </main>
  )
}
