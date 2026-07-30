import type { Metadata } from 'next'
import ProtectedRoute from '@/src/routes/ProtectedRoute'
import CustomStrategyBuilderPage from '@/src/views/services/CustomStrategyBuilderPage'
import { getService } from '@/src/lib/cms/services'

export async function generateMetadata(): Promise<Metadata> {
  const cmsService = await getService('custom-strategy-builder')
  const seo = cmsService?.seo

  return {
    title: seo?.metaTitle ?? `${cmsService?.title ?? 'Custom Strategy Builder'} — Arthagama`,
    description: seo?.metaDescription ?? cmsService?.shortDescription ?? 'Design, backtest, and deploy custom quantitative trading strategies tailored to your capital and risk appetite.',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: seo?.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? `${cmsService?.title ?? 'Custom Strategy Builder'} — Arthagama`,
      description: seo?.ogDescription ?? seo?.metaDescription ?? cmsService?.shortDescription ?? undefined,
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] : [],
    },
    twitter: {
      card: seo?.twitterCard ?? 'summary_large_image',
      title: seo?.twitterTitle ?? seo?.ogTitle ?? seo?.metaTitle ?? 'Custom Strategy Builder — Arthagama',
      description: seo?.twitterDescription ?? seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      images: seo?.twitterImage?.url ? [seo.twitterImage.url] : undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  }
}

export default async function Page() {
  const cmsService = await getService('custom-strategy-builder')
  return (
    <ProtectedRoute>
      <CustomStrategyBuilderPage cmsService={cmsService} />
    </ProtectedRoute>
  )
}
