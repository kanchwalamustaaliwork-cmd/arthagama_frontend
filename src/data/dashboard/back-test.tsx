export const DATE_RANGES = [
    { label: '3 Months', value: '3m' },
    { label: '6 Months', value: '6m' },
    { label: '1 Year', value: '1y' },
    { label: '3 Years', value: '3y' },
    { label: 'Custom', value: 'custom' },
]

export const TRADE_COLUMNS = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'type', header: 'Type', render: (v: unknown) => <span style={{ color: v === 'BUY' ? 'var(--db-profit)' : 'var(--db-loss)', fontWeight: 600 }}>{String(v)}</span> },
    { key: 'entry', header: 'Entry', align: 'right' as const, sortable: true },
    { key: 'exit', header: 'Exit', align: 'right' as const },
    { key: 'qty', header: 'Qty', align: 'right' as const },
    {
        key: 'pnl', header: 'P&L', align: 'right' as const, sortable: true,
        render: (v: unknown) => <span style={{ color: Number(v) >= 0 ? 'var(--db-profit)' : 'var(--db-loss)', fontWeight: 600 }}>
            {Number(v) >= 0 ? '+' : ''}₹{Math.abs(Number(v)).toLocaleString('en-IN')}
        </span>
    },
]

export const MOCK_TRADES = [
    { date: '10 Jul', type: 'BUY', entry: '₹2,810', exit: '₹2,847', qty: 50, pnl: 1850 },
    { date: '08 Jul', type: 'SELL', entry: '₹487', exit: '₹485', qty: 200, pnl: -400 },
    { date: '05 Jul', type: 'BUY', entry: '₹1,620', exit: '₹1,654', qty: 80, pnl: 2720 },
    { date: '02 Jul', type: 'BUY', entry: '₹3,180', exit: '₹3,210', qty: 30, pnl: 900 },
    { date: '29 Jun', type: 'SELL', entry: '₹142', exit: '₹138', qty: 500, pnl: 2000 },
]

export const BACKTEST_METRICS = [
    { label: 'Total Return', value: '+28.4%', trend: 'up' as const, trendLabel: 'vs benchmark +12.1%', accent: '#38D996' },
    { label: 'Win Rate', value: '63%', trend: 'up' as const, trendLabel: '87 trades', accent: '#5FAFD7' },
    { label: 'Max Drawdown', value: '-8.2%', trend: 'down' as const, trendLabel: 'Acceptable', accent: '#F3B84D' },
    { label: 'Sharpe Ratio', value: '1.84', trend: 'up' as const, trendLabel: 'Good', accent: '#38D996' },
    { label: 'Profit Factor', value: '2.14', trend: 'up' as const, trendLabel: 'Strong edge', accent: '#B8CEC2' },
    { label: 'Total Trades', value: '87', trend: 'neutral' as const, accent: '#708482' },
]

export const MONTHLY_RETURNS = [
    { month: 'Jan', val: 3.2 }, { month: 'Feb', val: -1.4 }, { month: 'Mar', val: 5.8 },
    { month: 'Apr', val: 2.1 }, { month: 'May', val: -0.8 }, { month: 'Jun', val: 4.4 },
    { month: 'Jul', val: 1.9 },
]
