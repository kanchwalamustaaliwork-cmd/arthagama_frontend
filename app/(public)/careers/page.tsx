import type { Metadata } from 'next'
import { getJobs, getCareersPage } from '@/src/lib/cms/careers'
import CareersPageView from '@/src/views/CareersPage'

export async function generateMetadata(): Promise<Metadata> {
  const cmsCareers = await getCareersPage()
  const seo = cmsCareers?.seo

  return {
    title: seo?.metaTitle ?? 'Careers — Arthagama',
    description: seo?.metaDescription ?? 'Join Arthagama. Build software and quantitative trading infrastructure that moves markets.',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: seo?.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? 'Careers — Arthagama',
      description: seo?.ogDescription ?? seo?.metaDescription ?? 'Build high-performance systems and quantitative trading models.',
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] : [],
    },
    twitter: {
      card: seo?.twitterCard ?? 'summary_large_image',
      title: seo?.twitterTitle ?? seo?.ogTitle ?? seo?.metaTitle ?? 'Careers — Arthagama',
      description: seo?.twitterDescription ?? seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      images: seo?.twitterImage?.url ? [seo.twitterImage.url] : undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  }
}

export default async function CareersPage() {
  const [initialJobs, cmsCareers] = await Promise.all([getJobs(), getCareersPage()])
  return <CareersPageView initialJobs={initialJobs} cmsCareers={cmsCareers} />
}
