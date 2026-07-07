type Stock = { symbol: string; chg: string; path: string; vol: string }
type Snapshot = { stocks: Stock[]; corr: number[][] }