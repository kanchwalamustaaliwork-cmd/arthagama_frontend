import type { Metadata } from 'next'
import { getContactPage } from '@/src/lib/cms/contact'
import ContactPageView from '@/src/views/ContactPage'
import type { CMSContactCard } from '@/src/types/cms'
import type { ContactInfoItem } from '@/src/data/contactInfo'

function cmsCardToContactInfo(card: CMSContactCard): ContactInfoItem {
  return {
    id: `${card.icon}-${card.label}`,
    label: card.label,
    value: card.value,
    href: card.href,
    icon: card.icon as ContactInfoItem['icon'],
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsContact = await getContactPage()
  const seo = cmsContact?.seo

  return {
    title: seo?.metaTitle ?? 'Contact Us — Arthagama',
    description: seo?.metaDescription ?? 'Get in touch with Arthagama quantitative trading and research team.',
    keywords: seo?.keywords ? seo.keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: seo?.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? 'Contact Us — Arthagama',
      description: seo?.ogDescription ?? seo?.metaDescription ?? 'Reach out to our quantitative research and engineering desks.',
      images: seo?.ogImage?.url ? [{ url: seo.ogImage.url, alt: seo.ogImage.alt }] : [],
    },
    twitter: {
      card: seo?.twitterCard ?? 'summary_large_image',
      title: seo?.twitterTitle ?? seo?.ogTitle ?? seo?.metaTitle ?? 'Contact Us — Arthagama',
      description: seo?.twitterDescription ?? seo?.ogDescription ?? seo?.metaDescription ?? undefined,
      images: seo?.twitterImage?.url ? [seo.twitterImage.url] : undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  }
}

export default async function ContactPage() {
  const cmsContact = await getContactPage()
  const contactCards = cmsContact?.contactCards?.map(cmsCardToContactInfo)

  return <ContactPageView cmsContactCards={contactCards} cmsContactPage={cmsContact} />
}
