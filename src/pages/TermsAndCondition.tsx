import LegalPageLayout, { type LegalSection } from '../components/legal/LegalPageLayout'

const sections: LegalSection[] = [
    {
        id: 'acceptance',
        heading: 'Acceptance of Terms',
        paragraphs: [
            'These Terms and Conditions ("Terms") govern your access to and use of the Arthagama website and services. By accessing our site or engaging our services, you agree to be bound by these Terms. If you do not agree, please do not use our services.',
        ],
    },
    {
        id: 'eligibility',
        heading: 'Eligibility',
        paragraphs: [
            'Our services are intended for individuals and entities legally permitted to trade in the markets we operate in, and who meet applicable regulatory requirements. By using our services, you represent that you meet these criteria and have the authority to enter into these Terms.',
        ],
    },
    {
        id: 'nature-of-services',
        heading: 'Nature of Our Services',
        paragraphs: [
            'Arthagama researches, develops, and deploys systematic trading strategies using quantitative analysis and technology. Our services may include strategy deployment, broker API integration, and automated trade execution on your behalf, subject to a separate service agreement.',
            'We do not provide personalized investment advice. Nothing on this website constitutes a recommendation to buy or sell any financial instrument, and any strategy deployed remains subject to your explicit authorization.',
        ],
    },
    {
        id: 'risk-disclosure',
        heading: 'Risk Disclosure',
        paragraphs: [
            'Algorithmic and systematic trading carries substantial risk, including the potential loss of principal. Past performance of any strategy is not indicative of future results. Market conditions, technical failures, connectivity issues, or broker-side disruptions can all affect strategy performance.',
            'You acknowledge that you understand these risks and that you are solely responsible for evaluating whether any strategy is appropriate for your financial situation.',
        ],
    },
    {
        id: 'account-responsibilities',
        heading: 'Account & Broker Responsibilities',
        paragraphs: [
            'Where our services involve integration with your broker account, you are responsible for maintaining sufficient margin, valid API credentials, and compliance with your broker\'s own terms of service. Arthagama is not responsible for broker-side outages, API rate limits, or execution delays outside our infrastructure.',
        ],
    },
    {
        id: 'intellectual-property',
        heading: 'Intellectual Property',
        paragraphs: [
            'All content on this website, including strategy names, methodology descriptions, logos, and design, is the property of Arthagama and protected under applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without prior written consent.',
        ],
    },
    {
        id: 'limitation-of-liability',
        heading: 'Limitation of Liability',
        paragraphs: [
            'To the maximum extent permitted by law, Arthagama and its officers, employees, and affiliates shall not be liable for any indirect, incidental, or consequential damages, including trading losses, arising from your use of our services.',
            'Our total liability for any claim arising out of these Terms shall not exceed the fees paid by you to Arthagama in the twelve months preceding the claim.',
        ],
    },
    {
        id: 'termination',
        heading: 'Termination',
        paragraphs: [
            'We may suspend or terminate your access to our services at our discretion, including for violation of these Terms, suspected fraudulent activity, or regulatory requirement. You may terminate your engagement with us at any time in accordance with your service agreement.',
        ],
    },
    {
        id: 'governing-law',
        heading: 'Governing Law',
        paragraphs: [
            'These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.',
        ],
    },
    {
        id: 'changes-to-terms',
        heading: 'Changes to These Terms',
        paragraphs: [
            'We may revise these Terms periodically. The "Last updated" date above reflects the most recent revision. Continued use of our services after changes take effect constitutes your acceptance of the revised Terms.',
        ],
    },
    {
        id: 'contact',
        heading: 'Contact Us',
        paragraphs: [
            'For questions regarding these Terms, please contact us at hello@arthagama.com.',
        ],
    },
]

export default function TermsConditionsPage() {
    return (
        <LegalPageLayout
            eyebrow="Legal"
            title="Terms & Conditions"
            lastUpdated="July 1, 2026"
            intro="The terms governing your access to Arthagama's website and systematic trading services."
            sections={sections}
        />
    )
}