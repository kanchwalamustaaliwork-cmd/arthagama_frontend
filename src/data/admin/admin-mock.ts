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

// ─── Strategies ───────────────────────────────────────────────────────────────

export let MOCK_ADMIN_STRATEGIES: AdminStrategy[] = [
    {
        id: 'as001', name: 'Nifty Momentum Breakout', description: 'Momentum-based strategy targeting Nifty 50 breakout patterns using EMA crossovers and RSI confirmation.',
        summary: 'EMA crossovers + RSI breakouts',
        status: 'running', isActive: true, databaseName: 'timescale_nifty_prod', universeName: 'Nifty 50 Index',
        category: 'Options',
        ownerAdminId: 'u001', ownerAdminName: 'Aditya Sen', ownerAdminEmail: 'aditya.sen@arthagama.com',
        createdByAdminId: 'u001', createdByAdminName: 'Aditya Sen', createdByAdminEmail: 'aditya.sen@arthagama.com',
        lastModifiedByAdminId: 'u001', lastModifiedByAdminName: 'Aditya Sen', lastModifiedByAdminEmail: 'aditya.sen@arthagama.com',
        assignedUserId: 'c005',
        createdAt: '2025-01-15T09:00:00Z', updatedAt: '2026-07-14T18:30:00Z',
        metrics: {
            id: 'm001', strategyId: 'as001',
            totalReturn: 14.2, totalPnL: 163400, todayPnL: 12400,
            activeHoldings: 12, winRate: 64.3, sharpeRatio: 1.84,
            averageHoldingTime: 12.5, lastTradeTimestamp: '2026-07-14T15:25:00Z',
            createdAt: '2025-01-15T09:00:00Z', updatedAt: '2026-07-14T18:30:00Z'
        }
    },
    {
        id: 'as002', name: 'Mid-Cap Mean Reversion', description: 'Statistical mean reversion strategy on Nifty Midcap 150 index components using Bollinger Bands.',
        summary: 'Bollinger Band reversion scanner',
        status: 'running', isActive: true, databaseName: 'timescale_midcap_prod', universeName: 'Midcap 150 Top',
        category: 'Futures',
        ownerAdminId: 'u001', ownerAdminName: 'Aditya Sen', ownerAdminEmail: 'aditya.sen@arthagama.com',
        createdByAdminId: 'u001', createdByAdminName: 'Aditya Sen', createdByAdminEmail: 'aditya.sen@arthagama.com',
        lastModifiedByAdminId: 'u001', lastModifiedByAdminName: 'Aditya Sen', lastModifiedByAdminEmail: 'aditya.sen@arthagama.com',
        assignedUserId: 'c003',
        createdAt: '2025-03-22T11:15:00Z', updatedAt: '2026-07-14T20:00:00Z',
        metrics: {
            id: 'm002', strategyId: 'as002',
            totalReturn: 8.9, totalPnL: 53100, todayPnL: -3200,
            activeHoldings: 8, winRate: 58.2, sharpeRatio: 1.52,
            averageHoldingTime: 8.2, lastTradeTimestamp: '2026-07-14T14:45:00Z',
            createdAt: '2025-03-22T11:15:00Z', updatedAt: '2026-07-14T20:00:00Z'
        }
    },
    {
        id: 'as003', name: 'IT Sector Pairs Trade', description: 'Long-short pairs trading between Indian IT majors based on relative strength divergence.',
        summary: 'Statistical arbitrage on IT giants',
        status: 'paused', isActive: false, databaseName: 'timescale_it_prod', universeName: 'IT Bluechips',
        category: 'Equity',
        ownerAdminId: 'u001', ownerAdminName: 'Aditya Sen', ownerAdminEmail: 'aditya.sen@arthagama.com',
        createdByAdminId: 'u001', createdByAdminName: 'Aditya Sen', createdByAdminEmail: 'aditya.sen@arthagama.com',
        lastModifiedByAdminId: 'u001', lastModifiedByAdminName: 'Aditya Sen', lastModifiedByAdminEmail: 'aditya.sen@arthagama.com',
        assignedUserId: 'c002',
        createdAt: '2024-12-10T14:00:00Z', updatedAt: '2026-07-10T09:00:00Z',
        metrics: {
            id: 'm003', strategyId: 'as003',
            totalReturn: 11.5, totalPnL: 114400, todayPnL: 0,
            activeHoldings: 0, winRate: 72.4, sharpeRatio: 2.12,
            averageHoldingTime: 18.0, lastTradeTimestamp: '2026-07-10T08:50:00Z',
            createdAt: '2024-12-10T14:00:00Z', updatedAt: '2026-07-10T09:00:00Z'
        }
    },
    {
        id: 'as004', name: 'Banking Sector Long-Short', description: 'Quantitative long-short strategy on PSU and private banking stocks using NPA and credit growth signals.',
        summary: 'Macro banking quantitative model',
        status: 'draft', isActive: false, databaseName: 'timescale_banking_dev', universeName: 'Nifty Bank Universe',
        category: 'Options',
        ownerAdminId: 'u001', ownerAdminName: 'Aditya Sen', ownerAdminEmail: 'aditya.sen@arthagama.com',
        createdByAdminId: 'u001', createdByAdminName: 'Aditya Sen', createdByAdminEmail: 'aditya.sen@arthagama.com',
        lastModifiedByAdminId: 'u001', lastModifiedByAdminName: 'Aditya Sen', lastModifiedByAdminEmail: 'aditya.sen@arthagama.com',
        assignedUserId: 'c001',
        createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-07-01T16:00:00Z',
        metrics: {
            id: 'm004', strategyId: 'as004',
            totalReturn: 0.0, totalPnL: 0, todayPnL: 0,
            activeHoldings: 0, winRate: 0.0, sharpeRatio: 0.0,
            averageHoldingTime: 0.0, lastTradeTimestamp: null,
            createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-07-01T16:00:00Z'
        }
    },
    {
        id: 'as005', name: 'Energy Sector Momentum', description: 'Trend-following strategy in the Energy sector with trailing stops and ATR-based position sizing.',
        summary: 'ATR-based energy sector trend following',
        status: 'running', isActive: true, databaseName: 'timescale_energy_prod', universeName: 'Energy Index Giants',
        category: 'Futures',
        ownerAdminId: 'u001', ownerAdminName: 'Aditya Sen', ownerAdminEmail: 'aditya.sen@arthagama.com',
        createdByAdminId: 'u001', createdByAdminName: 'Aditya Sen', createdByAdminEmail: 'aditya.sen@arthagama.com',
        lastModifiedByAdminId: 'u001', lastModifiedByAdminName: 'Aditya Sen', lastModifiedByAdminEmail: 'aditya.sen@arthagama.com',
        assignedUserId: 'c010',
        createdAt: '2025-02-08T08:30:00Z', updatedAt: '2026-07-15T07:00:00Z',
        metrics: {
            id: 'm005', strategyId: 'as005',
            totalReturn: 22.8, totalPnL: 214000, todayPnL: 8500,
            activeHoldings: 6, winRate: 60.5, sharpeRatio: 2.45,
            averageHoldingTime: 14.2, lastTradeTimestamp: '2026-07-15T06:40:00Z',
            createdAt: '2025-02-08T08:30:00Z', updatedAt: '2026-07-15T07:00:00Z'
        }
    },
    {
        id: 'as006', name: 'Pharma Breakout Scanner', description: 'Identifies breakout setups in the Pharma sector using volume surge and price pattern analysis.',
        summary: 'Pharma breakouts volume filters',
        status: 'archived', isActive: false, databaseName: 'timescale_pharma_archive', universeName: 'Nifty Pharma Universe',
        category: 'Equity',
        ownerAdminId: 'u001', ownerAdminName: 'Aditya Sen', ownerAdminEmail: 'aditya.sen@arthagama.com',
        createdByAdminId: 'u001', createdByAdminName: 'Aditya Sen', createdByAdminEmail: 'aditya.sen@arthagama.com',
        lastModifiedByAdminId: 'u001', lastModifiedByAdminName: 'Aditya Sen', lastModifiedByAdminEmail: 'aditya.sen@arthagama.com',
        assignedUserId: 'c007',
        createdAt: '2024-09-15T12:00:00Z', updatedAt: '2025-12-01T00:00:00Z',
        metrics: {
            id: 'm006', strategyId: 'as006',
            totalReturn: 4.8, totalPnL: 14000, todayPnL: 0,
            activeHoldings: 0, winRate: 50.0, sharpeRatio: 1.05,
            averageHoldingTime: 6.8, lastTradeTimestamp: '2025-11-30T15:10:00Z',
            createdAt: '2024-09-15T12:00:00Z', updatedAt: '2025-12-01T00:00:00Z'
        }
    },
]


// ─── Holdings (for strategy as001) ───────────────────────────────────────────

export const MOCK_STRATEGY_HOLDINGS: any[] = [
    { id: 'h001', stockSymbol: 'RELIANCE', stockName: 'Reliance Industries', quantity: 50, avgBuyPrice: 2720.50, currentStatus: 'open', buyDate: '2026-06-12T09:15:00Z', holdingDurationDays: 33, strategyId: 'as001' },
    { id: 'h002', stockSymbol: 'HDFCBANK', stockName: 'HDFC Bank', quantity: 80, avgBuyPrice: 1580.00, currentStatus: 'open', buyDate: '2026-06-18T10:30:00Z', holdingDurationDays: 27, strategyId: 'as001' },
    { id: 'h003', stockSymbol: 'INFY', stockName: 'Infosys', quantity: 120, avgBuyPrice: 1390.20, currentStatus: 'open', buyDate: '2026-07-01T09:45:00Z', holdingDurationDays: 14, strategyId: 'as001' },
    { id: 'h004', stockSymbol: 'LT', stockName: 'Larsen & Toubro', quantity: 30, avgBuyPrice: 3100.00, currentStatus: 'open', buyDate: '2026-07-05T11:00:00Z', holdingDurationDays: 10, strategyId: 'as001' },
    { id: 'h005', stockSymbol: 'TCS', stockName: 'Tata Consultancy', quantity: 40, avgBuyPrice: 3480.00, currentStatus: 'closed', buyDate: '2026-05-20T09:00:00Z', sellDate: '2026-06-10T15:20:00Z', holdingDurationDays: 21, strategyId: 'as001' },
    { id: 'h006', stockSymbol: 'BAJFINANCE', stockName: 'Bajaj Finance', quantity: 20, avgBuyPrice: 6700.00, currentStatus: 'closed', buyDate: '2026-04-15T09:30:00Z', sellDate: '2026-05-28T14:00:00Z', holdingDurationDays: 43, strategyId: 'as001' },
    { id: 'h007', stockSymbol: 'ICICIBANK', stockName: 'ICICI Bank', quantity: 100, avgBuyPrice: 1095.00, currentStatus: 'open', buyDate: '2026-07-08T09:20:00Z', holdingDurationDays: 7, strategyId: 'as001' },
    { id: 'h008', stockSymbol: 'MARUTI', stockName: 'Maruti Suzuki', quantity: 15, avgBuyPrice: 10200.00, currentStatus: 'open', buyDate: '2026-07-10T10:00:00Z', holdingDurationDays: 5, strategyId: 'as001' },
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

// ─── Strategy Analysis ────────────────────────────────────────────────────────

export const MOCK_STRATEGY_ANALYSIS: StrategyAnalysis = {
    strategyId: 'as001',
    totalStocksBought: 87,
    totalStocksSold: 75,
    activeHoldings: 12,
    closedHoldings: 63,
    totalProfit: 245800,
    totalLoss: 82400,
    winRate: 64.3,
    avgHoldingPeriodDays: 18,
    bestPerformingStock: 'RELIANCE',
    worstPerformingStock: 'WIPRO',
    mostTradedStock: 'HDFCBANK',
    maxDrawdown: 8.2,
    sharpeRatio: 1.84,
}

// ─── Admin Navigation ─────────────────────────────────────────────────────────

export const ADMIN_NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Strategies', href: '/admin/strategies', icon: Layers },
]

// ─── Admin Page Titles ────────────────────────────────────────────────────────

export const ADMIN_PAGE_TITLES: Record<string, string> = {
    '/admin': 'Admin Dashboard',
    '/admin/customers': 'Customers',
    '/admin/strategies': 'Strategies',
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



