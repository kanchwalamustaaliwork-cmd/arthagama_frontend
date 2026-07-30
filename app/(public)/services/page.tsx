import type { Metadata } from 'next'
import { getServices, getServicesLanding } from '@/src/lib/cms/services'
import ServicesPageView from '@/src/views/ServicePage'

export async function generateMetadata(): Promise<Metadata> {
  const cmsLanding = await getServicesLanding()
  const seo = cmsLanding?.seo

  return {
    title: seo?.metaTitle ?? 'Services — Arthagama',
    description: seo?.metaDescription ?? 'Quantitative strategy building, backtesting, research, and broker-integrated automated execution.',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: seo?.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? 'Services — Arthagama',
      description: seo?.ogDescription ?? seo?.metaDescription ?? 'Explore our quantitative strategy building and execution services.',
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] : [],
    },
    twitter: {
      card: seo?.twitterCard ?? 'summary_large_image',
      title: seo?.twitterTitle ?? seo?.ogTitle ?? seo?.metaTitle ?? 'Services — Arthagama',
      description: seo?.twitterDescription ?? seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      images: seo?.twitterImage?.url ? [seo.twitterImage.url] : undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  }
}

export default async function ServicesPage() {
  const [cmsServices, cmsLanding] = await Promise.all([getServices(), getServicesLanding()])
  return <ServicesPageView cmsServices={cmsServices} cmsLanding={cmsLanding} />
}
