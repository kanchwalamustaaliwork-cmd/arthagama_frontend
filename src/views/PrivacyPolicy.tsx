"use client"

import LegalPageLayout from '../components/legal/LegalPageLayout'
import { privacyPolicy } from '../data/legal'
import type { CMSLegalPage } from '../types/cms'

interface PrivacyPolicyPageProps {
  cmsLegal?: CMSLegalPage | null
}

export default function PrivacyPolicyPage({ cmsLegal }: PrivacyPolicyPageProps) {
  const title = cmsLegal?.title ?? 'Privacy Policy'
  const lastUpdated = cmsLegal?.lastUpdated
    ? new Date(cmsLegal.lastUpdated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'July 1, 2026'

  const sections = cmsLegal?.sections && cmsLegal.sections.length > 0
    ? cmsLegal.sections
    : privacyPolicy

  return (
    <LegalPageLayout
      eyebrow="Legal"
      title={title}
      lastUpdated={lastUpdated}
      intro="How Arthagama collects, uses, and protects information across our website and trading services."
      sections={sections}
    />
  )
}