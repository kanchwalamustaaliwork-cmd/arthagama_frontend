import type { Strategy } from '../types/stratergy'
export const STRATEGIES: Strategy[] = [
    {
        name: 'Momentum Strategy',
        description: 'Captures medium-term market trends using quantitative signals.',
    },
    {
        name: 'Mean Reversion',
        description: 'Identifies temporary price deviations and trades toward equilibrium.',
    },
    {
        name: 'Breakout Strategy',
        description: 'Executes trades when price breaks significant support or resistance levels.',
    },
    {
        name: 'Statistical Arbitrage',
        description: 'Uses quantitative models to identify pricing inefficiencies.',
    },
    {
        name: 'Options Volatility Strategy',
        description: 'Trades based on changes in implied and historical volatility.',
    },
    {
        name: 'Trend Following',
        description: 'Systematically follows long-term market trends using rule-based execution.',
    },
]