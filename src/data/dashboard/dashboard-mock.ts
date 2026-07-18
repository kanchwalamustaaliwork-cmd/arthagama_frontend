// ── Dashboard Mock Data ──────────────────────────────────────────────────────
// All sections use this file. Replace with real API calls later.

import type { Strategy } from '../../components/dashboard/StrategyCard'

import type { StockMatch } from '../../components/dashboard/StockMatchCard'
import type { Report } from '../../components/dashboard/ReportCard'
import type { MarketMover } from '../../components/dashboard/MarketMoverRow'
import type { Sector } from '../../components/dashboard/HeatmapCell'
import type { WatchlistItem } from '../../components/dashboard/WatchlistRow'
import type { Notification } from '../../components/dashboard/NotificationCard'
import type { Activity } from '@/src/types/dashboard'
import type { CalendarEvent } from '../../components/dashboard/EconomicCalendarItem'

// ─── Strategies ──────────────────────────────────────────────────────────────

export const MOCK_STRATEGIES: Strategy[] = [
    {
        id: 's1', name: 'Nifty Momentum Breakout', status: 'active',
        pnl: 124500, pnlPct: 12.4, winRate: 63, totalTrades: 87, drawdown: 8.2,
        lastUpdated: '2 hours ago', instruments: ['NIFTY50', 'NIFTY BANK'],
    },
    {
        id: 's2', name: 'Mid-Cap Mean Reversion', status: 'active',
        pnl: -18300, pnlPct: -1.8, winRate: 48, totalTrades: 42, drawdown: 14.1,
        lastUpdated: '1 day ago', instruments: ['MIDCAP150'],
    },
    {
        id: 's3', name: 'IT Sector Pairs Trade', status: 'paused',
        pnl: 67800, pnlPct: 6.8, winRate: 58, totalTrades: 29, drawdown: 5.4,
        lastUpdated: '3 days ago', instruments: ['TCS', 'INFY', 'WIPRO'],
    },
    {
        id: 's4', name: 'Banking Sector Long-Short', status: 'draft',
        pnl: 0, pnlPct: 0, winRate: 0, totalTrades: 0, drawdown: 0,
        lastUpdated: '1 week ago', instruments: ['HDFCBANK', 'ICICIBANK'],
    },
]


// ─── Stock Matches ────────────────────────────────────────────────────────────

export const MOCK_STOCK_MATCHES: StockMatch[] = [
    { id: 'sm1', ticker: 'RELIANCE', name: 'Reliance Industries', matchPct: 94, signal: 'buy', strategyName: 'Nifty Momentum Breakout', confidence: 88, price: '₹2,847', change: 2.14 },
    { id: 'sm2', ticker: 'HDFCBANK', name: 'HDFC Bank', matchPct: 87, signal: 'buy', strategyName: 'Nifty Momentum Breakout', confidence: 82, price: '₹1,654', change: 1.32 },
    { id: 'sm3', ticker: 'INFY', name: 'Infosys', matchPct: 76, signal: 'hold', strategyName: 'IT Sector Pairs Trade', confidence: 71, price: '₹1,423', change: -0.48 },
    { id: 'sm4', ticker: 'TATASTEEL', name: 'Tata Steel', matchPct: 68, signal: 'sell', strategyName: 'Mid-Cap Mean Reversion', confidence: 65, price: '₹142', change: -1.87 },
]

// ─── Research Reports ─────────────────────────────────────────────────────────

export const MOCK_REPORTS: Report[] = [
    {
        id: 'r1', title: 'India Rate Sensitivity: Impact of Prolonged Pause', category: 'Macro',
        analyst: 'Priya Sharma', date: '10 Jul 2026', readTime: '12 min read',
        summary: 'We analyze how each Nifty sector has historically responded to extended RBI pause cycles and what the current macro environment suggests for the next 6 months.', featured: true,
    },
    {
        id: 'r2', title: 'Momentum Factor Performance — H1 2026 Review', category: 'Quant',
        analyst: 'Arjun Mehta', date: '8 Jul 2026', readTime: '18 min read',
        summary: 'A systematic review of momentum factor returns across large, mid and small caps in H1 2026. Includes Sharpe ratios, drawdown profiles and sector decomposition.', featured: true,
    },
    {
        id: 'r3', title: 'Banking Sector Deep Dive: NPA Trends Q1 FY27', category: 'Sector',
        analyst: 'Rahul Nair', date: '5 Jul 2026', readTime: '15 min read',
        summary: 'Q1 FY27 results analysis for the top 10 Indian banks. NPA ratios trending down, credit growth healthy, but margins under pressure from deposit competition.',
    },
    {
        id: 'r4', title: 'IT Sector Outlook: FY27 Demand Commentary', category: 'Sector',
        analyst: 'Sneha Patel', date: '2 Jul 2026', readTime: '10 min read',
        summary: 'After a weak FY26, Indian IT majors are signaling stabilizing demand. We evaluate order books, headcount trends, and deal wins across TCS, Infosys, and Wipro.',
    },
    {
        id: 'r5', title: 'Algorithmic Trading Strategies in Volatile Markets', category: 'Strategy',
        analyst: 'Vikram Singh', date: '29 Jun 2026', readTime: '20 min read',
        summary: 'This report evaluates 8 systematic trading strategies over the past 24 months with special focus on behavior during high-VIX episodes.',
    },
    {
        id: 'r6', title: 'Monthly Market Pulse — June 2026', category: 'Market',
        analyst: 'Research Desk', date: '1 Jul 2026', readTime: '8 min read',
        summary: 'June recap: Nifty50 gained 2.8%, FII flows turned positive, and mid-caps outperformed by 180bps. Key themes for July and upcoming catalysts.',
    },
]

// ─── Market Movers ────────────────────────────────────────────────────────────

export const MOCK_GAINERS: MarketMover[] = [
    { ticker: 'RELIANCE', name: 'Reliance Industries', price: '₹2,847', change: 4.21, volume: '8.2M', sector: 'Energy' },
    { ticker: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,654', change: 3.18, volume: '12.4M', sector: 'Banking' },
    { ticker: 'LT', name: 'Larsen & Toubro', price: '₹3,210', change: 2.87, volume: '2.1M', sector: 'Infra' },
    { ticker: 'MARUTI', name: 'Maruti Suzuki', price: '₹10,420', change: 2.54, volume: '0.8M', sector: 'Auto' },
    { ticker: 'TITAN', name: 'Titan Company', price: '₹3,680', change: 2.11, volume: '1.4M', sector: 'Consumer' },
]

export const MOCK_LOSERS: MarketMover[] = [
    { ticker: 'TATASTEEL', name: 'Tata Steel', price: '₹142', change: -3.87, volume: '18.2M', sector: 'Metals' },
    { ticker: 'BAJFINANCE', name: 'Bajaj Finance', price: '₹6,840', change: -2.94, volume: '3.1M', sector: 'NBFC' },
    { ticker: 'WIPRO', name: 'Wipro', price: '₹485', change: -2.14, volume: '6.8M', sector: 'IT' },
    { ticker: 'SUNPHARMA', name: 'Sun Pharma', price: '₹1,820', change: -1.82, volume: '2.4M', sector: 'Pharma' },
    { ticker: 'NTPC', name: 'NTPC', price: '₹320', change: -1.44, volume: '9.1M', sector: 'Power' },
]

export const MOCK_ACTIVE: MarketMover[] = [
    { ticker: 'NIFTY BEE', name: 'Nifty BeES ETF', price: '₹240', change: 0.82, volume: '42.1M', sector: 'ETF' },
    { ticker: 'RELIANCE', name: 'Reliance Industries', price: '₹2,847', change: 4.21, volume: '32.4M', sector: 'Energy' },
    { ticker: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,654', change: 3.18, volume: '28.2M', sector: 'Banking' },
    { ticker: 'SBIN', name: 'State Bank of India', price: '₹742', change: 1.12, volume: '24.8M', sector: 'Banking' },
    { ticker: 'ITC', name: 'ITC', price: '₹448', change: -0.34, volume: '21.2M', sector: 'FMCG' },
]

// ─── Heatmap Sectors ─────────────────────────────────────────────────────────

export const MOCK_SECTORS: Sector[] = [
    { name: 'Banking', change: 1.84, marketCap: '₹32.4T' },
    { name: 'IT', change: -1.21, marketCap: '₹18.2T' },
    { name: 'Pharma', change: 0.45, marketCap: '₹8.7T' },
    { name: 'Energy', change: 3.12, marketCap: '₹28.1T' },
    { name: 'FMCG', change: -0.28, marketCap: '₹12.4T' },
    { name: 'Auto', change: 2.14, marketCap: '₹9.8T' },
    { name: 'Metals', change: -2.87, marketCap: '₹6.2T' },
    { name: 'Realty', change: 0.93, marketCap: '₹3.1T' },
]

// ─── Watchlist ────────────────────────────────────────────────────────────────

export const MOCK_WATCHLIST: WatchlistItem[] = [
    { ticker: 'RELIANCE', name: 'Reliance Industries', price: '₹2,847', change: 4.21, signal: 'buy', hasAlert: true },
    { ticker: 'TCS', name: 'Tata Consultancy', price: '₹3,540', change: -0.64, signal: 'hold', hasAlert: false },
    { ticker: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,654', change: 3.18, signal: 'buy', hasAlert: true },
    { ticker: 'INFY', name: 'Infosys', price: '₹1,423', change: -0.48, signal: 'hold', hasAlert: false },
    { ticker: 'ICICIBANK', name: 'ICICI Bank', price: '₹1,124', change: 1.84, signal: 'buy', hasAlert: false },
    { ticker: 'BAJFINANCE', name: 'Bajaj Finance', price: '₹6,840', change: -2.94, signal: 'sell', hasAlert: true },
]

// ─── Notifications ────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'alert', title: 'Stop-loss triggered — WIPRO', description: 'Trailing stop at ₹485.20 executed. P&L: +₹4,320', timestamp: '5 min ago', read: false },
    { id: 'n2', type: 'strategy', title: 'Nifty Momentum strategy signal', description: 'BUY signal generated for RELIANCE at ₹2,810', timestamp: '18 min ago', read: false },
    { id: 'n3', type: 'research', title: 'New report published', description: 'India Rate Sensitivity: Impact of Prolonged Pause', timestamp: '1 hr ago', read: false },
    { id: 'n4', type: 'portfolio', title: 'Portfolio milestone reached', description: 'Your portfolio crossed ₹10L for the first time!', timestamp: '3 hrs ago', read: true },
    { id: 'n5', type: 'system', title: 'Session will expire in 1 hour', description: 'Your session token refreshes automatically in background.', timestamp: '4 hrs ago', read: true },
]

// ─── Economic Calendar ────────────────────────────────────────────────────────

export const MOCK_CALENDAR: CalendarEvent[] = [
    { id: 'c1', name: 'RBI MPC Policy Decision', date: '11 Jul', time: '10:00 AM IST', category: 'RBI', impact: 'high', description: 'Bi-monthly monetary policy announcement' },
    { id: 'c2', name: 'TCS Q1 FY27 Results', date: '12 Jul', time: '4:00 PM IST', category: 'Earnings', impact: 'high' },
    { id: 'c3', name: 'Reliance Industries Q1', date: '14 Jul', time: 'After market', category: 'Earnings', impact: 'high' },
    { id: 'c4', name: 'CPI Inflation Data', date: '14 Jul', time: '5:30 PM IST', category: 'Economic', impact: 'medium' },
    { id: 'c5', name: 'Bajaj Finance Dividend', date: '15 Jul', time: 'Ex-date', category: 'Dividend', impact: 'low', description: '₹40 per share' },
    { id: 'c6', name: 'India Trade Balance', date: '16 Jul', time: '2:00 PM IST', category: 'Economic', impact: 'medium' },
]

// ─── DashBoard Nav SideBar ────────────────────────────────────────────────────────
import {
    LayoutDashboard,
    Home,
    Layers,
    FlaskConical,
    BarChart2,
    BookOpen,
} from 'lucide-react'

export const NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Home', href: '/dashboard/home', icon: Home },
    { label: 'My Strategies', href: '/dashboard/my-strategies', icon: Layers },
    { label: 'Backtest', href: '/dashboard/backtest', icon: FlaskConical },
    { label: 'Compare Stocks', href: '/dashboard/compare-stocks', icon: BarChart2 },
    { label: 'Research Reports', href: '/dashboard/research-reports', icon: BookOpen },
]

// ─── DashBoard TopBar ────────────────────────────────────────────────────────
export const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/home': 'Home',
    '/dashboard/my-strategies': 'My Strategies',
    '/dashboard/backtest': 'Backtest',
    '/dashboard/compare-stocks': 'Compare Stocks',
    '/dashboard/research-reports': 'Research Reports',
}