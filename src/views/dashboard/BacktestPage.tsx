'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Plus, ExternalLink, FlaskConical } from 'lucide-react'
import Button from '@/src/components/dashboard/ui/Button'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import StatCard from '@/src/components/dashboard/StatCard'
import PerformanceChart from '@/src/components/dashboard/PerformanceChart'
import Table from '@/src/components/dashboard/ui/Table'
import { MOCK_STRATEGIES } from '@/src/data/dashboard/dashboard-mock'
import { MOCK_TRADES, BACKTEST_METRICS, MONTHLY_RETURNS, TRADE_COLUMNS, DATE_RANGES } from '@/src/data/dashboard/back-test'
import { useDebounce } from '@/src/hooks/useDebounce'

export default function BacktestPage() {
    const router = useRouter()
    const [selectedStrategy, setSelectedStrategy] = useState<string>('')
    const [stockQuery, setStockQuery] = useState('')
    const debouncedStockQuery = useDebounce(stockQuery, 300)
    const activeStockQuery = stockQuery === '' ? '' : debouncedStockQuery

    const [dateRange, setDateRange] = useState('1y')
    const [capital, setCapital] = useState('500000')
    const [riskPct, setRiskPct] = useState('2')
    const [hasResults, setHasResults] = useState(false)
    const [running, setRunning] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newStratName, setNewStratName] = useState('')

    const handleRun = async () => {
        if (!selectedStrategy) return
        setRunning(true)
        await new Promise(r => setTimeout(r, 1400))
        setRunning(false)
        setHasResults(true)
    }

    const handleCreateStrategy = () => {
        if (!newStratName.trim()) return
        setSelectedStrategy(newStratName)
        setShowCreateForm(false)
        setNewStratName('')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1300px' }}>

            <div>
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--db-text)' }}>Backtest</h1>
                <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', marginTop: '4px' }}>
                    Validate your strategy against historical market data before risking live capital.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', alignItems: 'flex-start' }}>

                {/* ── Left Panel: Config ── */}
                <div className="db-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px', position: 'sticky', top: 'calc(var(--db-topbar-h) + 24px)' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text)', borderBottom: '1px solid var(--db-border)', paddingBottom: '12px' }}>
                        Configuration
                    </div>

                    {/* Strategy selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Strategy
                        </label>
                        <select
                            value={selectedStrategy}
                            onChange={e => setSelectedStrategy(e.target.value)}
                            className="db-input"
                        >
                            <option value="">Select a strategy…</option>
                            {MOCK_STRATEGIES.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                            {selectedStrategy && !MOCK_STRATEGIES.find(s => s.id === selectedStrategy) && (
                                <option value={selectedStrategy}>{selectedStrategy} (New)</option>
                            )}
                        </select>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="db-btn db-btn-ghost db-btn-sm"
                                style={{ fontSize: '11.5px', color: 'var(--db-mint)', gap: '4px' }}
                            >
                                <Plus size={11} /> Create New Strategy
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/my-strategies')}
                                className="db-btn db-btn-ghost db-btn-sm"
                                style={{ fontSize: '11.5px', gap: '4px' }}
                            >
                                <ExternalLink size={11} /> My Strategies
                            </button>
                        </div>
                    </div>

                    {/* Inline create strategy mini-form */}
                    {showCreateForm && (
                        <div
                            style={{
                                background: 'var(--db-bg)',
                                border: '1px solid var(--db-border)',
                                borderRadius: 'var(--db-radius-md)',
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}
                        >
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--db-text)' }}>Quick Create Strategy</div>
                            <input
                                value={newStratName}
                                onChange={e => setNewStratName(e.target.value)}
                                placeholder="Strategy name…"
                                className="db-input"
                                style={{ height: '34px' }}
                            />
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <Button variant="primary" size="sm" onClick={handleCreateStrategy}>Create & Select</Button>
                                <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                            </div>
                        </div>
                    )}

                    {/* Stock selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Stock / Index
                        </label>
                        <SearchBar value={stockQuery} onChange={setStockQuery} placeholder="Search NIFTY50, RELIANCE…" />
                    </div>

                    {/* Date range */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Date Range
                        </label>
                        <FilterBar options={DATE_RANGES} active={dateRange} onChange={setDateRange} />
                    </div>

                    {/* Capital */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Initial Capital (₹)
                        </label>
                        <input type="number" value={capital} onChange={e => setCapital(e.target.value)} className="db-input" />
                    </div>

                    {/* Risk */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Risk per Trade (%)
                        </label>
                        <input type="number" min="0.5" max="10" step="0.5" value={riskPct} onChange={e => setRiskPct(e.target.value)} className="db-input" />
                    </div>

                    <Button variant="primary" size="lg" loading={running} onClick={handleRun} style={{ width: '100%', justifyContent: 'center' } as React.CSSProperties}>
                        <Play size={14} /> {running ? 'Running Backtest…' : 'Run Backtest'}
                    </Button>
                </div>

                {/* ── Right Panel: Results ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {!hasResults ? (
                        <div
                            className="db-card"
                            style={{
                                padding: '60px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '14px',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FlaskConical size={22} color="var(--db-text-muted)" />
                            </div>
                            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)' }}>Configure & Run a Backtest</p>
                            <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', maxWidth: '340px', lineHeight: 1.6 }}>
                                Select a strategy and date range on the left, then click Run Backtest to see results here.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Metrics */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                                {BACKTEST_METRICS.map(m => <StatCard key={m.label} {...m} />)}
                            </div>

                            {/* Equity Curve */}
                            <div>
                                <SectionHeader title="Equity Curve" />
                                <PerformanceChart height={200} />
                            </div>

                            {/* Monthly Returns Heatmap */}
                            <div className="db-card" style={{ padding: '18px 20px' }}>
                                <SectionHeader title="Monthly Returns" />
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {MONTHLY_RETURNS.map(m => (
                                        <div
                                            key={m.month}
                                            style={{
                                                flex: '1 1 60px',
                                                borderRadius: '8px',
                                                padding: '10px 8px',
                                                textAlign: 'center',
                                                background: m.val >= 0 ? 'var(--db-profit-bg)' : 'var(--db-loss-bg)',
                                                border: `1px solid ${m.val >= 0 ? 'rgba(56,217,150,0.2)' : 'rgba(227,93,106,0.2)'}`,
                                            }}
                                        >
                                            <div style={{ fontSize: '10px', color: 'var(--db-text-muted)', marginBottom: '4px' }}>{m.month}</div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: m.val >= 0 ? 'var(--db-profit)' : 'var(--db-loss)' }}>
                                                {m.val >= 0 ? '+' : ''}{m.val}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trade History */}
                            <div className="db-card" style={{ padding: '18px 20px' }}>
                                <SectionHeader title="Trade History" />
                                <Table
                                    columns={TRADE_COLUMNS}
                                    rows={MOCK_TRADES.map(t => ({ ...t, pnl: t.pnl }))}
                                    emptyMessage="No trades recorded"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
              @media (max-width: 900px) {
                .backtest-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
        </div>
    )
}
