import type { ServiceSummary } from '../types/services'

export const SERVICES: ServiceSummary[] = [
    {
        slug: 'custom-strategy-builder',
        title: 'Custom Strategy Builder',
        shortDescription:
            'Design a systematic trading strategy tailored to your risk appetite, capital, and market view — built and validated by our quant team.',
        highlights: [
            'Tailored to your risk profile',
            'Built by our quant research team',
            'Fully backtested before deployment',
        ],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        ctaLabel: 'View Details',
    },
    {
        slug: 'backtest',
        title: 'Backtest',
        shortDescription:
            'Run your strategy against years of historical market data to understand its behavior before risking live capital.',
        highlights: ['Multi-year historical data', 'Slippage & cost-aware modeling', 'Detailed performance breakdown'],
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop',
        ctaLabel: 'View Details',
    },
    {
        slug: 'research-report',
        title: 'Research Report',
        shortDescription:
            'In-depth, data-driven research on market regimes, factor performance, and strategy viability — delivered on a regular cadence.',
        highlights: ['Published monthly', 'Written by our research desk', 'Actionable, not just academic'],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
        ctaLabel: 'View Details',
    },
    {
        slug: 'trade-with-us',
        title: 'Trade With Us',
        shortDescription:
            'Let our systematic strategies trade on your behalf through a fully automated, broker-integrated execution pipeline.',
        highlights: ['Fully automated execution', 'Transparent live reporting', 'Broker-integrated, sub-5ms routing'],
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop',
        ctaLabel: 'View Details',
    },
]