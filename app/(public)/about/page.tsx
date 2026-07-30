import type { Metadata } from 'next'
import { getAboutPage, getTeamMembers } from '@/src/lib/cms/about'
import AboutPageView from '@/src/views/AboutPage'

export async function generateMetadata(): Promise<Metadata> {
  const cmsAbout = await getAboutPage()
  const seo = cmsAbout?.seo

  return {
    title: seo?.metaTitle ?? 'About Us — Arthagama',
    description: seo?.metaDescription ?? 'Learn about Arthagama, our vision, team, culture, and quantitative trading philosophy.',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: seo?.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? 'About Us — Arthagama',
      description: seo?.ogDescription ?? seo?.metaDescription ?? 'Quantitative trading research, infrastructure, and team.',
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] : [],
    },
    twitter: {
      card: seo?.twitterCard ?? 'summary_large_image',
      title: seo?.twitterTitle ?? seo?.ogTitle ?? seo?.metaTitle ?? 'About Us — Arthagama',
      description: seo?.twitterDescription ?? seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      images: seo?.twitterImage?.url ? [seo.twitterImage.url] : undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  }
}

export default async function AboutPage() {
  const [cmsAbout, cmsTeam] = await Promise.all([getAboutPage(), getTeamMembers()])
  return <AboutPageView cmsAbout={cmsAbout} cmsTeam={cmsTeam} />
}
