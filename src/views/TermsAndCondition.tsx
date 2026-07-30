"use client"

import LegalPageLayout from '../components/legal/LegalPageLayout'
import { termsAndConditions } from '../data/legal'
import type { CMSLegalPage } from '../types/cms'

interface TermsAndConditionPageProps {
  cmsLegal?: CMSLegalPage | null
}

export default function TermsAndConditionPage({ cmsLegal }: TermsAndConditionPageProps) {
  const title = cmsLegal?.title ?? 'Terms & Conditions'
  const lastUpdated = cmsLegal?.lastUpdated
    ? new Date(cmsLegal.lastUpdated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'July 1, 2026'

  const sections = cmsLegal?.sections && cmsLegal.sections.length > 0
    ? cmsLegal.sections
    : termsAndConditions

  return (
    <LegalPageLayout
      eyebrow="Legal"
      title={title}
      lastUpdated={lastUpdated}
      intro="The terms governing your access to Arthagama's website and systematic trading services."
      sections={sections}
    />
  )
}