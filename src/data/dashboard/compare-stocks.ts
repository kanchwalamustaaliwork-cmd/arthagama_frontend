
export const COMPARE_TABS = [
    { label: 'Fundamentals', value: 'fundamentals' },
    { label: 'Technical', value: 'technical' },
    { label: 'Financials', value: 'financials' },
    { label: 'Valuation', value: 'valuation' },
    { label: 'Overall', value: 'overall' },
]

export const STOCK_DB: Record<string, { name: string; sector: string; price: string }> = {
    'RELIANCE': { name: 'Reliance Industries', sector: 'Energy', price: '₹2,847' },
    'TCS': { name: 'Tata Consultancy', sector: 'IT', price: '₹3,540' },
    'HDFCBANK': { name: 'HDFC Bank', sector: 'Banking', price: '₹1,654' },
    'INFY': { name: 'Infosys', sector: 'IT', price: '₹1,423' },
    'ICICIBANK': { name: 'ICICI Bank', sector: 'Banking', price: '₹1,124' },
    'LT': { name: 'Larsen & Toubro', sector: 'Infra', price: '₹3,210' },
    'MARUTI': { name: 'Maruti Suzuki', sector: 'Auto', price: '₹10,420' },
    'WIPRO': { name: 'Wipro', sector: 'IT', price: '₹485' },
}

export const METRIC_DATA: Record<string, Record<string, Record<string, string | number>>> = {
    fundamentals: {
        'Revenue (Cr)': { RELIANCE: '922000', TCS: '240893', HDFCBANK: '163683', INFY: '153670' },
        'Net Profit (Cr)': { RELIANCE: '79020', TCS: '46099', HDFCBANK: '60812', INFY: '26248' },
        'EBITDA Margin': { RELIANCE: '18.2%', TCS: '26.4%', HDFCBANK: '37.1%', INFY: '23.8%' },
        'Revenue Growth YoY': { RELIANCE: '12.4%', TCS: '8.1%', HDFCBANK: '14.8%', INFY: '9.2%' },
        'Profit Growth YoY': { RELIANCE: '15.2%', TCS: '11.3%', HDFCBANK: '20.1%', INFY: '7.8%' },
    },
    technical: {
        'RSI (14)': { RELIANCE: 62, TCS: 48, HDFCBANK: 58, INFY: 44 },
        'MACD Signal': { RELIANCE: 'Bullish', TCS: 'Neutral', HDFCBANK: 'Bullish', INFY: 'Bearish' },
        '50-day MA': { RELIANCE: '₹2,720', TCS: '₹3,480', HDFCBANK: '₹1,590', INFY: '₹1,410' },
        '200-day MA': { RELIANCE: '₹2,540', TCS: '₹3,210', HDFCBANK: '₹1,480', INFY: '₹1,350' },
        'Volume (20D avg)': { RELIANCE: '8.4M', TCS: '4.2M', HDFCBANK: '12.1M', INFY: '6.8M' },
        '52W High': { RELIANCE: '₹3,024', TCS: '₹3,720', HDFCBANK: '₹1,794', INFY: '₹1,600' },
        '52W Low': { RELIANCE: '₹2,180', TCS: '₹3,020', HDFCBANK: '₹1,390', INFY: '₹1,280' },
    },
    financials: {
        'Total Assets (Cr)': { RELIANCE: '1642000', TCS: '148420', HDFCBANK: '3040000', INFY: '109200' },
        'Total Debt (Cr)': { RELIANCE: '312000', TCS: '2840', HDFCBANK: '—', INFY: '1200' },
        'Debt / Equity': { RELIANCE: '0.42', TCS: '0.04', HDFCBANK: '—', INFY: '0.02' },
        'Current Ratio': { RELIANCE: '1.18', TCS: '2.84', HDFCBANK: '—', INFY: '3.12' },
        'ROE': { RELIANCE: '9.8%', TCS: '47.2%', HDFCBANK: '16.4%', INFY: '32.1%' },
        'ROCE': { RELIANCE: '11.2%', TCS: '52.4%', HDFCBANK: '5.8%', INFY: '38.4%' },
    },
    valuation: {
        'P/E Ratio': { RELIANCE: 28.4, TCS: 28.8, HDFCBANK: 19.2, INFY: 24.1 },
        'P/B Ratio': { RELIANCE: 2.8, TCS: 13.4, HDFCBANK: 3.1, INFY: 7.8 },
        'EV/EBITDA': { RELIANCE: 18.2, TCS: 21.4, HDFCBANK: 15.8, INFY: 17.2 },
        'Dividend Yield': { RELIANCE: '0.3%', TCS: '1.2%', HDFCBANK: '1.0%', INFY: '2.1%' },
        'Market Cap (Cr)': { RELIANCE: '1935000', TCS: '1292000', HDFCBANK: '1246000', INFY: '591000' },
    },
    overall: {
        'Fundamentals Score': { RELIANCE: '72/100', TCS: '84/100', HDFCBANK: '79/100', INFY: '76/100' },
        'Technical Score': { RELIANCE: '68/100', TCS: '52/100', HDFCBANK: '71/100', INFY: '44/100' },
        'Valuation Score': { RELIANCE: '58/100', TCS: '62/100', HDFCBANK: '74/100', INFY: '66/100' },
        'Overall Score': { RELIANCE: '66/100', TCS: '66/100', HDFCBANK: '75/100', INFY: '62/100' },
        'Recommendation': { RELIANCE: 'Buy', TCS: 'Hold', HDFCBANK: 'Buy', INFY: 'Hold' },
    },
}