import type { Metadata } from 'next'
import { getHomePage, getStatistics, getTestimonials, getPartners } from '@/src/lib/cms/home'
import { getNavigation } from '@/src/lib/cms/navigation'
import HomePageView from '@/src/views/HomePage'

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getHomePage()
  const seo = cmsData?.seo

  return {
    title: seo?.metaTitle ?? 'Arthagama — Quantitative & Algorithmic Trading Firm',
    description: seo?.metaDescription ?? 'Arthagama is an algorithmic trading firm based in Mumbai deploying systematic, data-driven trading strategies across financial markets.',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: seo?.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? 'Arthagama — Quantitative & Algorithmic Trading Firm',
      description: seo?.ogDescription ?? seo?.metaDescription ?? 'Systematic, data-driven trading strategies across financial markets.',
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] : [],
    },
    twitter: {
      card: seo?.twitterCard ?? 'summary_large_image',
      title: seo?.twitterTitle ?? seo?.ogTitle ?? seo?.metaTitle ?? 'Arthagama',
      description: seo?.twitterDescription ?? seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      images: seo?.twitterImage?.url ? [seo.twitterImage.url] : undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  }
}

export default async function HomePage() {
  const [cmsData, cmsStats, cmsTestimonials, cmsPartners, cmsNav] = await Promise.all([
    getHomePage(),
    getStatistics(),
    getTestimonials(),
    getPartners(),
    getNavigation(),
  ])

  return (
    <HomePageView
      cmsData={cmsData}
      cmsStats={cmsStats}
      cmsTestimonials={cmsTestimonials}
      cmsPartners={cmsPartners}
      cmsNav={cmsNav}
    />
  )
}
