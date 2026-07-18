'use client'

import { useRouter } from 'next/navigation'
import { Users, Layers, TrendingUp, TrendingDown, Activity, Briefcase, FileText, Zap } from 'lucide-react'
import StatCard from '@/src/components/dashboard/StatCard'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import ActivityItem from '@/src/components/dashboard/ActivityItem'
import AdminStrategyCard from '@/src/components/admin/AdminStrategyCard'
import PageHeader from '@/src/components/admin/PageHeader'
import { useAdminStats } from '@/src/hooks/admin/useAdminStats'
import { useAdminStrategies } from '@/src/hooks/admin/useAdminStrategies'
import { MOCK_CUSTOMERS } from '@/src/data/admin/admin-mock'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import LiveNews from '@/src/components/shared/LiveNews'

export default function AdminDashboardPage() {
    const router = useRouter()
    const { stats, status: statsStatus } = useAdminStats()
    const { strategies, handleStatusChange } = useAdminStrategies()

    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px' }}>

            {/* ── Banner ── */}
            <div style={{ borderRadius: 'var(--db-radius-xl)', padding: '28px 32px', background: 'linear-gradient(135deg, #1A0A2E 0%, #0F1719 100%)', border: '1px solid rgba(168,85,247,0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)' }} />
                <p style={{ fontSize: '11px', color: 'rgba(168,85,247,0.7)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px' }}>{today}</p>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.02em', marginBottom: '6px' }}>Admin Control Center</h1>
                <p style={{ fontSize: '13px', color: 'var(--db-text-2)' }}>Full platform visibility and management access. Operate with caution.</p>
            </div>

            {/* ── Platform Stats ── */}
            <section>
                <SectionHeader title="Platform Overview" subtitle="Platform metrics" />
                {statsStatus === 'loading' ? (
                    <LoadingState variant="skeleton-card" count={8} />
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                        <StatCard label="Total Customers" value={stats?.totalCustomers.toLocaleString('en-IN') ?? '—'} icon={Users} accent="#5FAFD7" trend="up" trendLabel="+12 this week" />
                        <StatCard label="Active Customers" value={stats?.activeCustomers.toLocaleString('en-IN') ?? '—'} icon={Activity} accent="#38D996" />
                        <StatCard label="Inactive Customers" value={stats?.inactiveCustomers.toLocaleString('en-IN') ?? '—'} accent="#708482" />
                        <StatCard label="Total Strategies" value={stats?.totalStrategies.toLocaleString('en-IN') ?? '—'} icon={Layers} accent="#B8CEC2" />
                        <StatCard label="Running Strategies" value={stats?.runningStrategies.toLocaleString('en-IN') ?? '—'} icon={TrendingUp} accent="#38D996" />
                        <StatCard label="Stopped Strategies" value={stats?.stoppedStrategies.toLocaleString('en-IN') ?? '—'} icon={TrendingDown} accent="#E35D6A" />
                        <StatCard label="Total Holdings" value={stats?.totalHoldings.toLocaleString('en-IN') ?? '—'} icon={Briefcase} accent="#F3B84D" />
                        <StatCard label="Total Reports" value={stats?.totalReports.toLocaleString('en-IN') ?? '—'} icon={FileText} accent="#a855f7" />
                    </div>
                )}
            </section>

            {/* ── Running Strategies ── */}
            <section>
                <SectionHeader title="Running Strategies" subtitle="Strategies currently active on the platform" actionLabel="View All" actionHref="/admin/strategies" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {strategies.filter(s => s.status === 'running').slice(0, 3).map(s => (
                        <AdminStrategyCard key={s.id} strategy={s} onStatusChange={handleStatusChange} />
                    ))}
                </div>
            </section>

            {/* ── 2-column: Recent Customers + Activity ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>

                {/* Recent Customers */}
                <div className="db-card" style={{ padding: '20px' }}>
                    <SectionHeader title="Recent Customers" actionLabel="View All" actionHref="/admin/customers" />
                    {MOCK_CUSTOMERS.slice(0, 5).map(c => (
                        <div
                            key={c.id}
                            onClick={() => router.push(`/admin/customers/${c.id}`)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--db-border)', cursor: 'pointer' }}
                        >
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#244147 0%,#2E5560 100%)', border: '1.5px solid rgba(184,206,194,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#B8CEC2', flexShrink: 0 }}>
                                {c.avatarInitials}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.firstName} {c.lastName}</div>
                                <div style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>{c.email}</div>
                            </div>
                            <span className={`db-badge db-badge-${c.status === 'active' ? 'success' : c.status === 'inactive' ? 'neutral' : 'error'}`} style={{ flexShrink: 0 }}>
                                {c.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Live Financial News ── */}
            <section>
                <SectionHeader title="System Live Financial News" subtitle="Real-time market updates and scraping metrics" />
                <LiveNews />
            </section>
        </div>
    )
}
