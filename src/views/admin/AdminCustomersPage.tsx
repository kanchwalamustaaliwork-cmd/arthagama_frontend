'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, UserCheck, UserX, Shield, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '@/src/components/admin/PageHeader'
import ConfirmDialog from '@/src/components/admin/ConfirmDialog'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import Badge from '@/src/components/dashboard/ui/Badge'
import Button from '@/src/components/dashboard/ui/Button'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { useCustomers } from '@/src/hooks/admin/useCustomers'
import type { AdminCustomer, CustomerStatus } from '@/src/types/admin'

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' },
]

const STATUS_VARIANT: Record<CustomerStatus, 'success' | 'neutral' | 'error'> = {
    active: 'success',
    inactive: 'neutral',
    suspended: 'error',
}

export default function AdminCustomersPage() {
    const router = useRouter()
    const {
        customers, total, status, page, setPage, pageSize, hasMore,
        search, setSearch, filterStatus, setFilterStatus,
        handleUpdateStatus, handleDelete,
    } = useCustomers()

    const [confirm, setConfirm] = useState<{ type: 'delete' | 'deactivate' | 'activate'; customer: AdminCustomer } | null>(null)

    const handleConfirm = async () => {
        if (!confirm) return
        if (confirm.type === 'delete') await handleDelete(confirm.customer.id)
        else if (confirm.type === 'deactivate') await handleUpdateStatus(confirm.customer.id, 'inactive')
        else await handleUpdateStatus(confirm.customer.id, 'active')
        setConfirm(null)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1300px' }}>

            <PageHeader
                title="Customers"
                subtitle={`${total.toLocaleString('en-IN')} total customers registered`}
                icon={Users}
                badge={`${total}`}
            />

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" width="280px" />
                <FilterBar options={FILTERS} active={filterStatus} onChange={v => setFilterStatus(v as CustomerStatus | 'all')} />
            </div>

            {/* Table */}
            <div className="db-card" style={{ overflow: 'hidden' }}>
                {status === 'loading' ? (
                    <LoadingState variant="skeleton-table" />
                ) : customers.length === 0 ? (
                    <EmptyState icon={Users} title="No customers found" description="Try adjusting your search or filter." />
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="db-table">
                            <thead>
                                <tr>
                                    {['Customer', 'Email', 'Status', 'Registered', 'Strategies', 'Holdings', 'Last Active', 'Actions'].map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map(c => (
                                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/customers/${c.id}`)}>
                                        {/* Customer */}
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#244147 0%,#2E5560 100%)', border: '1.5px solid rgba(184,206,194,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#B8CEC2', flexShrink: 0 }}>
                                                    {c.avatarInitials}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500, color: 'var(--db-text)', fontSize: '13px' }}>{c.firstName} {c.lastName}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>{c.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</td>
                                        <td><Badge variant={STATUS_VARIANT[c.status]} dot>{c.status}</Badge></td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(c.registeredAt).toLocaleDateString('en-IN')}</td>
                                        <td>{c.totalStrategies} <span style={{ color: 'var(--db-profit)', fontSize: '11px' }}>({c.activeStrategies} active)</span></td>
                                        <td>{c.totalHoldings}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{c.lastActiveAt}</td>
                                        {/* Actions */}
                                        <td onClick={e => e.stopPropagation()}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {c.status === 'active' ? (
                                                    <button title="Deactivate" onClick={() => setConfirm({ type: 'deactivate', customer: c })} className="db-btn db-btn-ghost db-btn-sm" style={{ padding: '5px', borderRadius: '8px', color: 'var(--db-warning)' }}>
                                                        <UserX size={13} />
                                                    </button>
                                                ) : (
                                                    <button title="Activate" onClick={() => setConfirm({ type: 'activate', customer: c })} className="db-btn db-btn-ghost db-btn-sm" style={{ padding: '5px', borderRadius: '8px', color: 'var(--db-profit)' }}>
                                                        <UserCheck size={13} />
                                                    </button>
                                                )}
                                                <button title="Delete" onClick={() => setConfirm({ type: 'delete', customer: c })} className="db-btn db-btn-ghost db-btn-sm" style={{ padding: '5px', borderRadius: '8px', color: 'var(--db-loss)' }}>
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {total > pageSize && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--db-border)' }}>
                        <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <Button variant="ghost" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={14} /></Button>
                            <Button variant="ghost" size="sm" onClick={() => setPage(p => p + 1)} disabled={!hasMore}><ChevronRight size={14} /></Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={!!confirm}
                title={confirm?.type === 'delete' ? 'Remove Customer' : confirm?.type === 'deactivate' ? 'Deactivate Account' : 'Activate Account'}
                message={
                    confirm?.type === 'delete'
                        ? `Are you sure you want to permanently remove ${confirm.customer.firstName} ${confirm.customer.lastName}? This action cannot be undone.`
                        : confirm?.type === 'deactivate'
                        ? `Deactivate ${confirm?.customer.firstName}'s account? They will lose access to the platform.`
                        : `Activate ${confirm?.customer.firstName}'s account? They will regain full platform access.`
                }
                confirmLabel={confirm?.type === 'delete' ? 'Remove' : confirm?.type === 'deactivate' ? 'Deactivate' : 'Activate'}
                variant={confirm?.type === 'delete' ? 'danger' : 'warning'}
                onConfirm={handleConfirm}
                onCancel={() => setConfirm(null)}
            />
        </div>
    )
}
