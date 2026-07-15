'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, Layers, Briefcase, Clock, AlertCircle } from 'lucide-react'
import PageHeader from '@/src/components/admin/PageHeader'
import Badge from '@/src/components/dashboard/ui/Badge'
import Button from '@/src/components/dashboard/ui/Button'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { useCustomer } from '@/src/hooks/admin/useCustomer'
import type { CustomerStatus } from '@/src/types/admin'
import { MOCK_STRATEGY_LOGS } from '@/src/data/admin/admin-mock'

const STATUS_VARIANT: Record<CustomerStatus, 'success' | 'neutral' | 'error'> = {
    active: 'success', inactive: 'neutral', suspended: 'error',
}

interface Props { customerId: string }

export default function AdminCustomerDetailPage({ customerId }: Props) {
    const router = useRouter()
    const { customer, status } = useCustomer(customerId)

    if (status === 'loading') return <LoadingState variant="skeleton-card" count={6} />

    if (status === 'not_found' || !customer) {
        return <EmptyState icon={AlertCircle} title="Customer not found" actionLabel="Back to Customers" onAction={() => router.push('/admin/customers')} />
    }

    const recentLogs = MOCK_STRATEGY_LOGS.slice(0, 4)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px' }}>

            {/* Back button */}
            <button onClick={() => router.back()} className="db-btn db-btn-ghost db-btn-sm" style={{ alignSelf: 'flex-start' }}>
                <ArrowLeft size={14} /> Back
            </button>

            <PageHeader
                title={`${customer.firstName} ${customer.lastName}`}
                subtitle={`Customer since ${new Date(customer.registeredAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
            >
                <Badge variant={STATUS_VARIANT[customer.status]} dot>{customer.status}</Badge>
                <Button variant="ghost" size="sm">Edit</Button>
            </PageHeader>

            {/* ── Info Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>

                {/* Personal Info */}
                <div className="db-card" style={{ padding: '20px', gridColumn: 'span 1' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Personal Information</h2>
                    {[
                        { icon: Mail, label: 'Email', value: customer.email },
                        { icon: Phone, label: 'Phone', value: customer.phoneNumber },
                        { icon: Calendar, label: 'Registered', value: new Date(customer.registeredAt).toLocaleDateString('en-IN') },
                        { icon: Clock, label: 'Last Active', value: customer.lastActiveAt },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={14} color="var(--db-text-muted)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
                                <div style={{ fontSize: '13px', color: 'var(--db-text)', marginTop: '2px' }}>{value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="db-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Layers size={14} color="var(--db-text-muted)" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)' }}>Strategies</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ background: 'var(--db-elevated)', borderRadius: '10px', padding: '10px 12px' }}>
                                <div style={{ fontSize: '10px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Total</div>
                                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--db-text)' }}>{customer.totalStrategies}</div>
                            </div>
                            <div style={{ background: 'var(--db-elevated)', borderRadius: '10px', padding: '10px 12px' }}>
                                <div style={{ fontSize: '10px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Active</div>
                                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--db-profit)' }}>{customer.activeStrategies}</div>
                            </div>
                        </div>
                    </div>
                    <div className="db-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Briefcase size={18} color="var(--db-text-muted)" />
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Total Holdings</div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--db-text)' }}>{customer.totalHoldings}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent Logs ── */}
            <div className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--db-border)' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)' }}>Recent Activity Logs</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="db-table">
                        <thead><tr>{['Timestamp', 'Event', 'Description', 'Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
                        <tbody>
                            {recentLogs.map(log => (
                                <tr key={log.id}>
                                    <td style={{ fontSize: '11.5px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString('en-IN')}</td>
                                    <td><span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'var(--db-elevated)', color: 'var(--db-text-2)', fontFamily: 'monospace' }}>{log.eventType}</span></td>
                                    <td style={{ maxWidth: '300px' }}>{log.description}</td>
                                    <td><span className={`db-badge db-badge-${log.status === 'success' ? 'success' : log.status === 'failed' ? 'error' : 'warning'}`}>{log.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Placeholder sections */}
            {['Subscription & Plan', 'Payment History', 'Broker Connections'].map(section => (
                <div key={section} className="db-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)' }}>{section}</h3>
                        <p style={{ fontSize: '12px', color: 'var(--db-text-muted)', marginTop: '2px' }}>Integration coming soon</p>
                    </div>
                    <span className="db-badge db-badge-neutral">Placeholder</span>
                </div>
            ))}
        </div>
    )
}
