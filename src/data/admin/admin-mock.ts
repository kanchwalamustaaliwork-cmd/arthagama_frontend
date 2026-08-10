/**
 * src/data/admin/admin-mock.ts
 *
 * Realistic static mock data for the Admin Panel.
 * Every structure mirrors the expected backend API response shape.
 * Replace with real API calls in src/services/admin/adminApi.ts.
 *
 * Navigation & page titles are also defined here (same pattern as dashboard-mock.ts).
 */

import type {
    AdminCustomer,
    AdminStrategy,
    AdminHolding,
    AdminLog,
    StrategyAnalysis,
    AdminPlatformStats,
    AdminTrade,
} from '@/src/types/admin'
import {
    LayoutDashboard,
    Users,
    Layers,
    BarChart2,
    Settings,
    Briefcase,
} from 'lucide-react'

// ─── Platform Stats ───────────────────────────────────────────────────────────

export const ADMIN_PLATFORM_STATS: AdminPlatformStats = {
    totalCustomers: 1284,
    activeCustomers: 947,
    inactiveCustomers: 337,
    totalStrategies: 348,
    runningStrategies: 212,
    stoppedStrategies: 136,
    totalHoldings: 5820,
    totalReports: 94,
}

// ─── Customers ────────────────────────────────────────────────────────────────

export const MOCK_CUSTOMERS: AdminCustomer[] = [
    {
        id: 'c001', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun.mehta@email.com',
        phoneNumber: '+91 98765 43210', status: 'active', registeredAt: '2025-03-14T09:22:00Z',
        lastActiveAt: '2 hours ago', totalStrategies: 5, activeStrategies: 3, totalHoldings: 18,
        avatarInitials: 'AM',
    },
    {
        id: 'c002', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@email.com',
        phoneNumber: '+91 87654 32109', status: 'active', registeredAt: '2025-04-02T14:10:00Z',
        lastActiveAt: '1 day ago', totalStrategies: 8, activeStrategies: 6, totalHoldings: 42,
        avatarInitials: 'PS',
    },
    {
        id: 'c003', firstName: 'Rahul', lastName: 'Nair', email: 'rahul.nair@email.com',
        phoneNumber: '+91 76543 21098', status: 'active', registeredAt: '2025-01-22T11:45:00Z',
        lastActiveAt: '3 hours ago', totalStrategies: 12, activeStrategies: 7, totalHoldings: 65,
        avatarInitials: 'RN',
    },
    {
        id: 'c004', firstName: 'Sneha', lastName: 'Patel', email: 'sneha.patel@email.com',
        phoneNumber: '+91 65432 10987', status: 'inactive', registeredAt: '2025-05-10T16:30:00Z',
        lastActiveAt: '2 weeks ago', totalStrategies: 3, activeStrategies: 0, totalHoldings: 8,
        avatarInitials: 'SP',
    },
    {
        id: 'c005', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@email.com',
        phoneNumber: '+91 54321 09876', status: 'active', registeredAt: '2024-12-05T08:15:00Z',
        lastActiveAt: '5 minutes ago', totalStrategies: 20, activeStrategies: 14, totalHoldings: 128,
        avatarInitials: 'VS',
    },
    {
        id: 'c006', firstName: 'Divya', lastName: 'Krishnan', email: 'divya.k@email.com',
        phoneNumber: '+91 43210 98765', status: 'suspended', registeredAt: '2025-02-18T13:00:00Z',
        lastActiveAt: '1 month ago', totalStrategies: 2, activeStrategies: 0, totalHoldings: 0,
        avatarInitials: 'DK',
    },
    {
        id: 'c007', firstName: 'Rohan', lastName: 'Gupta', email: 'rohan.gupta@email.com',
        phoneNumber: '+91 32109 87654', status: 'active', registeredAt: '2025-06-01T10:20:00Z',
        lastActiveAt: '30 minutes ago', totalStrategies: 7, activeStrategies: 5, totalHoldings: 33,
        avatarInitials: 'RG',
    },
    {
        id: 'c008', firstName: 'Aisha', lastName: 'Khan', email: 'aisha.khan@email.com',
        phoneNumber: '+91 21098 76543', status: 'active', registeredAt: '2025-07-09T07:45:00Z',
        lastActiveAt: 'Just now', totalStrategies: 4, activeStrategies: 2, totalHoldings: 11,
        avatarInitials: 'AK',
    },
    {
        id: 'c009', firstName: 'Karan', lastName: 'Malhotra', email: 'karan.m@email.com',
        phoneNumber: '+91 10987 65432', status: 'inactive', registeredAt: '2025-03-28T12:00:00Z',
        lastActiveAt: '3 days ago', totalStrategies: 1, activeStrategies: 0, totalHoldings: 4,
        avatarInitials: 'KM',
    },
    {
        id: 'c010', firstName: 'Meera', lastName: 'Iyer', email: 'meera.iyer@email.com',
        phoneNumber: '+91 90876 54321', status: 'active', registeredAt: '2024-11-15T15:30:00Z',
        lastActiveAt: '1 hour ago', totalStrategies: 15, activeStrategies: 10, totalHoldings: 88,
        avatarInitials: 'MI',
    },
]


// ─── Logs ─────────────────────────────────────────────────────────────────────

export const MOCK_STRATEGY_LOGS: AdminLog[] = [
    { id: 'l001', timestamp: '2026-07-15T09:15:34Z', eventType: 'order_executed', description: 'BUY 50 RELIANCE @ ₹2,847.00 executed successfully', status: 'success', strategyAction: 'ENTRY', strategyId: 'as001' },
    { id: 'l002', timestamp: '2026-07-15T09:10:12Z', eventType: 'signal_generated', description: 'BUY signal generated for RELIANCE — EMA crossover + RSI(58) above threshold', status: 'success', strategyAction: 'SIGNAL', strategyId: 'as001' },
    { id: 'l003', timestamp: '2026-07-14T15:45:00Z', eventType: 'order_executed', description: 'SELL 40 TCS @ ₹3,540.00 — Target hit (+8.2%)', status: 'success', strategyAction: 'EXIT', strategyId: 'as001' },
    { id: 'l004', timestamp: '2026-07-14T10:30:22Z', eventType: 'order_placed', description: 'SELL order placed for BAJFINANCE — Stop-loss triggered at ₹6,540', status: 'success', strategyAction: 'STOP_LOSS', strategyId: 'as001' },
    { id: 'l005', timestamp: '2026-07-13T14:20:00Z', eventType: 'error', description: 'Order rejected: WIPRO — Insufficient position size for current allocation', status: 'failed', strategyAction: 'ENTRY', strategyId: 'as001' },
    { id: 'l006', timestamp: '2026-07-13T09:05:00Z', eventType: 'strategy_started', description: 'Strategy resumed after 2-day pause — all parameters validated', status: 'success', strategyAction: 'RESUME', strategyId: 'as001' },
    { id: 'l007', timestamp: '2026-07-11T16:30:00Z', eventType: 'strategy_stopped', description: 'Strategy paused by user — market volatility threshold exceeded', status: 'warning', strategyAction: 'PAUSE', strategyId: 'as001' },
    { id: 'l008', timestamp: '2026-07-11T09:45:00Z', eventType: 'order_executed', description: 'BUY 80 HDFCBANK @ ₹1,580.00 executed successfully', status: 'success', strategyAction: 'ENTRY', strategyId: 'as001' },
    { id: 'l009', timestamp: '2026-07-10T11:00:00Z', eventType: 'info', description: 'Portfolio rebalancing check completed — no adjustments required', status: 'success', strategyAction: 'REBALANCE', strategyId: 'as001' },
    { id: 'l010', timestamp: '2026-07-09T09:30:00Z', eventType: 'order_cancelled', description: 'Buy order for SUNPHARMA cancelled — price limit not met within session', status: 'warning', strategyAction: 'CANCEL', strategyId: 'as001' },
    { id: 'l011', timestamp: '2026-07-08T09:20:00Z', eventType: 'order_executed', description: 'BUY 100 ICICIBANK @ ₹1,095.00 executed successfully', status: 'success', strategyAction: 'ENTRY', strategyId: 'as001' },
    { id: 'l012', timestamp: '2026-07-07T14:15:00Z', eventType: 'signal_generated', description: 'SELL signal for TCS — RSI divergence detected on 4H chart', status: 'success', strategyAction: 'SIGNAL', strategyId: 'as001' },
]



// ─── Admin Navigation ─────────────────────────────────────────────────────────

export const ADMIN_NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Strategies', href: '/admin/strategies', icon: Layers },
    { label: 'Market Terminal', href: '/admin/terminal', icon: BarChart2 },
]

// ─── Admin Page Titles ────────────────────────────────────────────────────────

export const ADMIN_PAGE_TITLES: Record<string, string> = {
    '/admin': 'Admin Dashboard',
    '/admin/customers': 'Customers',
    '/admin/strategies': 'Strategies',
    '/admin/terminal': 'Market Data Terminal',
}

// ─── Trades (mock) ────────────────────────────────────────────────────────────
export const MOCK_STRATEGY_TRADES: AdminTrade[] = [
    { id: 't001', strategyId: 'as001', stockSymbol: 'RELIANCE', stockName: 'Reliance Industries', action: 'BUY', quantity: 50, price: 2720.50, totalValue: 136025, timestamp: '2026-06-12T09:15:00Z', status: 'completed' },
    { id: 't002', strategyId: 'as001', stockSymbol: 'HDFCBANK', stockName: 'HDFC Bank', action: 'BUY', quantity: 80, price: 1580.00, totalValue: 126400, timestamp: '2026-06-18T10:30:00Z', status: 'completed' },
    { id: 't003', strategyId: 'as001', stockSymbol: 'TCS', stockName: 'Tata Consultancy', action: 'BUY', quantity: 40, price: 3480.00, totalValue: 139200, timestamp: '2026-05-20T09:00:00Z', status: 'completed' },
    { id: 't004', strategyId: 'as001', stockSymbol: 'TCS', stockName: 'Tata Consultancy', action: 'SELL', quantity: 40, price: 3540.00, totalValue: 141600, timestamp: '2026-06-10T15:20:00Z', pnl: 2400, status: 'completed' },
    { id: 't005', strategyId: 'as001', stockSymbol: 'BAJFINANCE', stockName: 'Bajaj Finance', action: 'BUY', quantity: 20, price: 6700.00, totalValue: 134000, timestamp: '2026-04-15T09:30:00Z', status: 'completed' },
    { id: 't006', strategyId: 'as001', stockSymbol: 'BAJFINANCE', stockName: 'Bajaj Finance', action: 'SELL', quantity: 20, price: 6540.00, totalValue: 130800, timestamp: '2026-05-28T14:00:00Z', pnl: -3200, status: 'completed' },
    { id: 't007', strategyId: 'as001', stockSymbol: 'INFY', stockName: 'Infosys', action: 'BUY', quantity: 120, price: 1390.20, totalValue: 166824, timestamp: '2026-07-01T09:45:00Z', status: 'completed' },
    { id: 't008', strategyId: 'as001', stockSymbol: 'WIPRO', stockName: 'Wipro', action: 'BUY', quantity: 100, price: 420.00, totalValue: 42000, timestamp: '2026-07-13T14:20:00Z', status: 'rejected' },
    { id: 't009', strategyId: 'as001', stockSymbol: 'SUNPHARMA', stockName: 'Sun Pharma', action: 'BUY', quantity: 60, price: 1120.00, totalValue: 67200, timestamp: '2026-07-09T09:30:00Z', status: 'cancelled' },
    { id: 't010', strategyId: 'as002', stockSymbol: 'TATASTEEL', stockName: 'Tata Steel', action: 'BUY', quantity: 200, price: 142.50, totalValue: 28500, timestamp: '2026-07-14T09:45:00Z', status: 'completed' },
    { id: 't011', strategyId: 'as002', stockSymbol: 'JINDALSTEL', stockName: 'Jindal Steel', action: 'BUY', quantity: 80, price: 680.00, totalValue: 54400, timestamp: '2026-07-12T10:15:00Z', status: 'completed' },
    { id: 't012', strategyId: 'as002', stockSymbol: 'JINDALSTEL', stockName: 'Jindal Steel', action: 'SELL', quantity: 80, price: 710.00, totalValue: 56800, timestamp: '2026-07-14T11:30:00Z', pnl: 2400, status: 'completed' },
    { id: 't013', strategyId: 'as003', stockSymbol: 'INFY', stockName: 'Infosys', action: 'BUY', quantity: 100, price: 1400.00, totalValue: 140000, timestamp: '2026-07-05T09:15:00Z', status: 'completed' },
    { id: 't014', strategyId: 'as003', stockSymbol: 'TCS', stockName: 'Tata Consultancy', action: 'SELL', quantity: 30, price: 3500.00, totalValue: 105000, timestamp: '2026-07-08T14:45:00Z', status: 'completed' },
]



