// data/services.ts
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
        visual: 'terminal',
        ctaLabel: 'View Details',
    },
    {
        slug: 'backtest',
        title: 'Backtest',
        shortDescription:
            'Run your strategy against years of historical market data to understand its behavior before risking live capital.',
        highlights: ['Multi-year historical data', 'Slippage & cost-aware modeling', 'Detailed performance breakdown'],
        visual: 'backtest',
        ctaLabel: 'View Details',
    },
    // {
    //     slug: 'research-report',
    //     title: 'Research Report',
    //     shortDescription:
    //         'In-depth, data-driven research on market regimes, factor performance, and strategy viability — delivered on a regular cadence.',
    //     highlights: ['Published monthly', 'Written by our research desk', 'Actionable, not just academic'],
    //     visual: 'research',
    //     ctaLabel: 'View Details',
    // },
    // {
    //     slug: 'trade-with-us',
    //     title: 'Trade With Us',
    //     shortDescription:
    //         'Let our systematic strategies trade on your behalf through a fully automated, broker-integrated execution pipeline.',
    //     highlights: ['Fully automated execution', 'Transparent live reporting', 'Broker-integrated, sub-5ms routing'],
    //     visual: 'execution',
    //     ctaLabel: 'View Details',
    // },
    {
        slug: 'compare-stocks',
        title: 'Compare Stocks',
        shortDescription:
            'Put any two stocks side by side across returns, volatility, and correlation to see how they actually behave relative to each other.',
        highlights: [
            'Head-to-head performance metrics',
            'Volatility & correlation analysis',
            'Real-time relative strength view',
        ],
        visual: 'compare',
        ctaLabel: 'View Details',
    },
]