import type { Metadata } from 'next'
import { getTerms } from '@/src/lib/cms/legal'
import TermsAndConditionView from '@/src/views/TermsAndCondition'

export async function generateMetadata(): Promise<Metadata> {
  const cmsLegal = await getTerms()
  const seo = cmsLegal?.seo

  return {
    title: seo?.metaTitle ?? 'Terms & Conditions — Arthagama',
    description: seo?.metaDescription ?? 'Arthagama Terms & Conditions governing access to our website and services.',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: seo?.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? 'Terms & Conditions — Arthagama',
      description: seo?.ogDescription ?? seo?.metaDescription ?? 'Arthagama Terms & Conditions.',
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] : [],
    },
    twitter: {
      card: seo?.twitterCard ?? 'summary_large_image',
      title: seo?.twitterTitle ?? seo?.ogTitle ?? seo?.metaTitle ?? 'Terms & Conditions — Arthagama',
      description: seo?.twitterDescription ?? seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      images: seo?.twitterImage?.url ? [seo.twitterImage.url] : undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  }
}

export default async function TermsAndConditionPage() {
  const cmsLegal = await getTerms()
  return <TermsAndConditionView cmsLegal={cmsLegal} />
}
