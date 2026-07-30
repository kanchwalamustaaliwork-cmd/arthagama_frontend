import type { Metadata } from 'next'
import { getPrivacyPolicy } from '@/src/lib/cms/legal'
import PrivacyPolicyView from '@/src/views/PrivacyPolicy'

export async function generateMetadata(): Promise<Metadata> {
  const cmsLegal = await getPrivacyPolicy()
  const seo = cmsLegal?.seo

  return {
    title: seo?.metaTitle ?? 'Privacy Policy — Arthagama',
    description: seo?.metaDescription ?? 'Arthagama Privacy Policy detailing how we collect, use, and protect your information.',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: seo?.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? 'Privacy Policy — Arthagama',
      description: seo?.ogDescription ?? seo?.metaDescription ?? 'Arthagama Privacy Policy.',
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] : [],
    },
    twitter: {
      card: seo?.twitterCard ?? 'summary_large_image',
      title: seo?.twitterTitle ?? seo?.ogTitle ?? seo?.metaTitle ?? 'Privacy Policy — Arthagama',
      description: seo?.twitterDescription ?? seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      images: seo?.twitterImage?.url ? [seo.twitterImage.url] : undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  }
}

export default async function PrivacyPolicyPage() {
  const cmsLegal = await getPrivacyPolicy()
  return <PrivacyPolicyView cmsLegal={cmsLegal} />
}
