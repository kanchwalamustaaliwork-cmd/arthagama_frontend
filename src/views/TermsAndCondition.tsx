"use client"

import LegalPageLayout from '../components/legal/LegalPageLayout'
import { termsAndConditions } from '../data/legal'

export default function TermsConditionsPage() {
    return (
        <LegalPageLayout
            eyebrow="Legal"
            title="Terms & Conditions"
            lastUpdated="July 1, 2026"
            intro="The terms governing your access to Arthagama's website and systematic trading services."
            sections={termsAndConditions}
        />
    )
}