"use client"

import LegalPageLayout, { type LegalSection } from '../components/legal/LegalPageLayout'

const sections: LegalSection[] = [
    {
        id: 'overview',
        heading: 'Overview',
        paragraphs: [
            'Arthagama ("we", "us", "our") is an algorithmic trading firm based in Mumbai. This Privacy Policy explains what information we collect when you visit arthagama.com or use our services, how we use it, and the choices available to you.',
            'By accessing our website or engaging with our services, you agree to the practices described in this policy. If you do not agree, please discontinue use of the site.',
        ],
    },
    {
        id: 'information-we-collect',
        heading: 'Information We Collect',
        paragraphs: [
            'We collect information you provide directly, such as your name, email address, and phone number when you contact us, request a demo, or create an account.',
            'We also collect certain information automatically when you visit our site, including IP address, browser type, device information, pages visited, and time spent on the site, through cookies and similar technologies.',
            'If you become a client, we may collect additional information required for onboarding, including KYC documentation, trading account details, and broker API credentials necessary to provide our services.',
        ],
    },
    {
        id: 'how-we-use-information',
        heading: 'How We Use Information',
        paragraphs: [
            'We use collected information to operate and improve our website and services, respond to inquiries, process account registrations, and provide customer support.',
            'Trading and account-related data is used solely to execute the services you have engaged us for — including strategy deployment, order routing, and performance reporting — and is never used for purposes beyond that engagement without your consent.',
            'We may use aggregated, de-identified data for internal research and to improve our systematic trading models and infrastructure.',
        ],
    },
    {
        id: 'data-sharing',
        heading: 'Data Sharing & Disclosure',
        paragraphs: [
            'We do not sell your personal information. We may share information with third-party service providers who perform functions on our behalf, such as hosting, analytics, and broker API integrations, under contractual obligations to protect your data.',
            'We may disclose information if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of Arthagama, our clients, or others.',
        ],
    },
    {
        id: 'data-security',
        heading: 'Data Security',
        paragraphs: [
            'We employ industry-standard technical and organizational measures — including encryption in transit, access controls, and infrastructure monitoring — to protect your information against unauthorized access, alteration, or disclosure.',
            'No method of transmission or storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security.',
        ],
    },
    {
        id: 'data-retention',
        heading: 'Data Retention',
        paragraphs: [
            'We retain personal information for as long as necessary to fulfil the purposes described in this policy, comply with legal and regulatory obligations (including SEBI record-keeping requirements applicable to trading-related data), resolve disputes, and enforce our agreements.',
        ],
    },
    {
        id: 'your-rights',
        heading: 'Your Rights',
        paragraphs: [
            'Depending on your jurisdiction, you may have the right to access, correct, or request deletion of your personal information, and to object to or restrict certain processing.',
            'To exercise any of these rights, please contact us at hello@arthagama.com. We will respond to verified requests within a reasonable timeframe.',
        ],
    },
    {
        id: 'cookies',
        heading: 'Cookies & Tracking',
        paragraphs: [
            'We use cookies and similar technologies to remember preferences, understand site usage, and improve user experience. You can control cookie preferences through your browser settings; disabling cookies may affect certain site functionality.',
        ],
    },
    {
        id: 'changes',
        heading: 'Changes to This Policy',
        paragraphs: [
            'We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of our services after changes take effect constitutes acceptance of the revised policy.',
        ],
    },
    {
        id: 'contact',
        heading: 'Contact Us',
        paragraphs: [
            'If you have questions about this Privacy Policy or how we handle your data, reach out to us at hello@arthagama.com.',
        ],
    },
]

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout
            eyebrow="Legal"
            title="Privacy Policy"
            lastUpdated="July 1, 2026"
            intro="How Arthagama collects, uses, and protects information across our website and trading services."
            sections={sections}
        />
    )
}