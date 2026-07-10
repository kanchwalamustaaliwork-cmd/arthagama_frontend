import type { Stock } from '../types/compareStocks'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildSeries(values: number[]) {
    return MONTHS.map((month, i) => ({ month, value: values[i] }))
}

export const STOCKS: Stock[] = [
    {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        sector: 'Energy & Retail',
        color: '#244147',
        performance: buildSeries([0, 3.2, 5.8, 4.1, 7.5, 9.2, 8.4, 11.6, 10.9, 13.2, 15.1, 14.3]),
        metrics: { cagr: 18.4, volatility: 22.1, sharpe: 1.12, maxDrawdown: -14.6, beta: 0.98 },
    },
    {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        sector: 'IT Services',
        color: '#4A7168',
        performance: buildSeries([0, 1.8, 2.4, 4.9, 3.7, 6.1, 7.8, 6.9, 9.4, 8.8, 11.2, 12.6]),
        metrics: { cagr: 15.7, volatility: 17.8, sharpe: 1.34, maxDrawdown: -10.2, beta: 0.71 },
    },
    {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank',
        sector: 'Financial Services',
        color: '#8CA89C',
        performance: buildSeries([0, -1.2, 0.8, 2.1, 1.4, 3.6, 2.9, 5.2, 4.8, 6.7, 6.1, 8.3]),
        metrics: { cagr: 12.9, volatility: 20.4, sharpe: 0.89, maxDrawdown: -18.9, beta: 1.05 },
    },
    {
        symbol: 'INFY',
        name: 'Infosys',
        sector: 'IT Services',
        color: '#B8CEC2',
        performance: buildSeries([0, 2.4, 1.9, 5.3, 4.6, 7.2, 6.5, 9.8, 8.4, 10.9, 13.4, 12.1]),
        metrics: { cagr: 16.8, volatility: 19.2, sharpe: 1.21, maxDrawdown: -12.4, beta: 0.83 },
    },
    {
        symbol: 'BAJFINANCE',
        name: 'Bajaj Finance',
        sector: 'Financial Services',
        color: '#1B3236',
        performance: buildSeries([0, 4.8, 3.1, 8.7, 6.2, 12.4, 9.8, 16.3, 14.1, 19.6, 17.8, 22.4]),
        metrics: { cagr: 24.6, volatility: 31.5, sharpe: 0.97, maxDrawdown: -26.8, beta: 1.42 },
    },
    {
        symbol: 'ITC',
        name: 'ITC Limited',
        sector: 'FMCG',
        color: '#6E9285',
        performance: buildSeries([0, 0.6, 1.4, 0.9, 2.2, 1.8, 3.4, 2.9, 4.6, 3.8, 5.4, 6.2]),
        metrics: { cagr: 9.8, volatility: 14.1, sharpe: 1.08, maxDrawdown: -8.6, beta: 0.54 },
    },
]


// Metrics
export const METRICS: { key: keyof Stock['metrics']; label: string; suffix: string; decimals: number }[] = [
    { key: 'cagr', label: 'CAGR', suffix: '%', decimals: 1 },
    { key: 'volatility', label: 'Volatility', suffix: '%', decimals: 1 },
    { key: 'sharpe', label: 'Sharpe Ratio', suffix: '', decimals: 2 },
    { key: 'maxDrawdown', label: 'Max Drawdown', suffix: '%', decimals: 1 },
    { key: 'beta', label: 'Beta', suffix: '', decimals: 2 },
]
