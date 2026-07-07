"use client"

import LegalPageLayout from '../components/legal/LegalPageLayout'
import { privacyPolicy } from '../data/legal'

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout
            eyebrow="Legal"
            title="Privacy Policy"
            lastUpdated="July 1, 2026"
            intro="How Arthagama collects, uses, and protects information across our website and trading services."
            sections={privacyPolicy}
        />
    )
}