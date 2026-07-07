export const SNAPSHOTS_BACKTEST = [
    { pnl: '+₹4,82,300', win: '64%', sharpe: '1.84', path: 'M0,80 L20,72 L40,75 L60,60 L80,64 L100,45 L120,50 L140,30 L160,35 L180,15 L200,20' },
    { pnl: '+₹6,10,900', win: '61%', sharpe: '1.92', path: 'M0,80 L20,78 L40,68 L60,70 L80,55 L100,58 L120,40 L140,44 L160,25 L180,28 L200,10' },
    { pnl: '+₹3,95,100', win: '58%', sharpe: '1.71', path: 'M0,80 L20,82 L40,74 L60,76 L80,66 L100,68 L120,52 L140,55 L160,38 L180,42 L200,22' },
]

export const COLORS = ['#9FD9B8', '#B8CEC2', '#E3C89A', '#A9C7E3']

export const SNAPSHOTS_COMPARE: Snapshot[] = [
    {
        stocks: [
            { symbol: 'RELIANCE', chg: '+2.4%', vol: '18.2%', path: 'M0,60 L25,55 L50,58 L75,42 L100,38 L125,30 L150,25 L175,18 L200,12' },
            { symbol: 'TCS', chg: '+0.8%', vol: '12.6%', path: 'M0,60 L25,58 L50,54 L75,52 L100,48 L125,46 L150,44 L175,40 L200,38' },
        ],
        corr: [[1, 0.42], [0.42, 1]],
    },
    {
        stocks: [
            { symbol: 'HDFCBANK', chg: '-1.1%', vol: '15.4%', path: 'M0,20 L25,28 L50,25 L75,35 L100,32 L125,42 L150,40 L175,48 L200,52' },
            { symbol: 'ICICIBANK', chg: '+1.6%', vol: '16.9%', path: 'M0,50 L25,46 L50,48 L75,38 L100,36 L125,28 L150,26 L175,18 L200,15' },
            { symbol: 'AXISBANK', chg: '+0.5%', vol: '17.8%', path: 'M0,45 L25,42 L50,44 L75,36 L100,38 L125,30 L150,32 L175,24 L200,26' },
        ],
        corr: [[1, 0.71, 0.64], [0.71, 1, 0.68], [0.64, 0.68, 1]],
    },
    {
        stocks: [
            { symbol: 'INFY', chg: '+3.1%', vol: '20.1%', path: 'M0,55 L25,50 L50,44 L75,40 L100,30 L125,28 L150,20 L175,15 L200,10' },
            { symbol: 'WIPRO', chg: '-0.4%', vol: '14.3%', path: 'M0,45 L25,48 L50,44 L75,50 L100,46 L125,52 L150,48 L175,54 L200,50' },
            { symbol: 'TCS', chg: '+0.8%', vol: '12.6%', path: 'M0,50 L25,48 L50,46 L75,44 L100,42 L125,40 L150,38 L175,36 L200,34' },
            { symbol: 'HCLTECH', chg: '+1.9%', vol: '16.0%', path: 'M0,52 L25,46 L50,42 L75,36 L100,32 L125,26 L150,22 L175,17 L200,14' },
        ],
        corr: [[1, 0.38, 0.55, 0.61], [0.38, 1, 0.44, 0.4], [0.55, 0.44, 1, 0.58], [0.61, 0.4, 0.58, 1]],
    },
]

export const GRID_COLS: Record<number, string> = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }

export const ORDERS = [
    { side: 'BUY', symbol: 'NIFTY24500CE', qty: 50 },
    { side: 'SELL', symbol: 'RELIANCE', qty: 120 },
    { side: 'BUY', symbol: 'BANKNIFTY', qty: 25 },
    { side: 'SELL', symbol: 'INFY', qty: 80 },
]

export const HEADLINES = [
    'Factor Rotation in Q3: Momentum vs. Value',
    'Regime Shift Detected in Small-Cap Volatility',
    'Rate-Sensitivity Across Sector Baskets',
]

export const BARS = [62, 40, 78, 35, 55, 28, 70]

export const LOG_LINES = [
    '> initializing strategy engine...',
    '> loading config: momentum_v3.yaml',
    '> risk profile: moderate | capital: ₹25,00,000',
    '> fetching universe: NIFTY500',
    '> generating signals... [ok]',
    '> backtest window: 2019-01-01 → 2025-12-31',
    '> sharpe ratio: 1.84',
    '> max drawdown: -8.2%',
    '> strategy validated ✓',
    '> deploying to paper environment...',
]