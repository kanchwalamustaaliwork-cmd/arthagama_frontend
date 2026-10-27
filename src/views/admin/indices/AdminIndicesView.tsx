'use client'

/**
 * src/views/admin/indices/AdminIndicesView.tsx
 *
 * Administrator index management table with CRUD operations, status toggling, and filtering.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Power, Search, X, Layers, AlertCircle, RefreshCw } from 'lucide-react'
import { useAdminIndices } from '@/src/hooks/indices/useAdminIndices'
import { ArthagamaIndex, IndexStatus } from '@/src/types/indices'
import { PREDEFINED_SECTORS } from '@/src/mocks/indices/indices.mock'
import IndexStatusBadge from '@/src/components/indices/IndexStatusBadge'
import DeleteIndexDialog from '@/src/components/indices/DeleteIndexDialog'
import { IndexTableSkeleton } from '@/src/components/indices/skeletons/IndexTableSkeleton'
import {
    formatIndexValue,
    formatIndexChange,
    formatIndexPercent,
    formatIndexDateTime,
} from '@/src/utils/indices/format-index-value'
import Button from '@/src/components/dashboard/ui/Button'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'

export default function AdminIndicesView() {
    const router = useRouter()
    const {
        indices,
        loading,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        sectorFilter,
        setSectorFilter,
        sortBy,
        setSortBy,
        deleteIndex,
        toggleStatus,
        refetch,
    } = useAdminIndices()

    const [deleteTarget, setDeleteTarget] = useState<ArthagamaIndex | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return
        setIsDeleting(true)
        try {
            await deleteIndex(deleteTarget.indexId)
            showToast(`Index "${deleteTarget.indexName}" has been successfully deleted.`)
            setDeleteTarget(null)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDeactivateInstead = async () => {
        if (!deleteTarget) return
        setIsDeleting(true)
        try {
            await toggleStatus(deleteTarget)
            showToast(`Index "${deleteTarget.indexName}" was set to Inactive.`)
            setDeleteTarget(null)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto' }}>
            {/* Toast Feedback Banner */}
            {toastMessage && (
                <div
                    style={{
                        padding: '12px 18px',
                        borderRadius: 'var(--db-radius-md)',
                        background: 'var(--db-teal)',
                        border: '1px solid var(--db-mint)',
                        color: 'var(--db-text)',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <span>{toastMessage}</span>
                    <button
                        onClick={() => setToastMessage(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--db-text-muted)', cursor: 'pointer' }}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Header with Title and Create Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.02em' }}>
                        Index Management
                    </h1>
                    <p style={{ fontSize: '13.5px', color: 'var(--db-text-muted)', marginTop: '4px' }}>
                        Configure benchmark baskets, adjust constituent instrument weightings, and publish indices.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => refetch()}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </Button>
                    <Link href="/admin/indices/new" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" size="md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Plus size={16} /> Create Index
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div
                className="db-card"
                style={{
                    padding: '16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '12px',
                    justifyContent: 'space-between',
                }}
            >
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
                    <Search
                        size={15}
                        color="var(--db-text-muted)"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Filter by name, symbol, or sector..."
                        style={{
                            width: '100%',
                            padding: '8px 12px 8px 34px',
                            background: 'var(--db-surface)',
                            border: '1px solid var(--db-border)',
                            borderRadius: 'var(--db-radius-md)',
                            color: 'var(--db-text)',
                            fontSize: '13px',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Dropdown Filters */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as IndexStatus | 'ALL')}
                        style={{
                            background: 'var(--db-surface)',
                            border: '1px solid var(--db-border)',
                            color: 'var(--db-text)',
                            padding: '8px 12px',
                            borderRadius: 'var(--db-radius-sm)',
                            fontSize: '12.5px',
                            outline: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ACTIVE">Active Only</option>
                        <option value="INACTIVE">Inactive Only</option>
                        <option value="DRAFT">Draft Only</option>
                    </select>

                    {/* Sector Filter */}
                    <select
                        value={sectorFilter}
                        onChange={e => setSectorFilter(e.target.value)}
                        style={{
                            background: 'var(--db-surface)',
                            border: '1px solid var(--db-border)',
                            color: 'var(--db-text)',
                            padding: '8px 12px',
                            borderRadius: 'var(--db-radius-sm)',
                            fontSize: '12.5px',
                            outline: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="ALL">All Sectors</option>
                        {PREDEFINED_SECTORS.map(sec => (
                            <option key={sec} value={sec}>
                                {sec}
                            </option>
                        ))}
                    </select>

                    {/* Return Sort */}
                    <select
                        value={sortBy || 'name'}
                        onChange={e => setSortBy(e.target.value as any)}
                        style={{
                            background: 'var(--db-surface)',
                            border: '1px solid var(--db-border)',
                            color: 'var(--db-text)',
                            padding: '8px 12px',
                            borderRadius: 'var(--db-radius-sm)',
                            fontSize: '12.5px',
                            outline: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="name">Sort: Name (A-Z)</option>
                        <option value="return1d">Sort: Best 1D Return</option>
                        <option value="return1w">Sort: Best 1W Return</option>
                        <option value="return1m">Sort: Best 1M Return</option>
                        <option value="return3m">Sort: Best 3M Return</option>
                        <option value="return6m">Sort: Best 6M Return</option>
                        <option value="return1y">Sort: Best 1Y Return</option>
                        <option value="returnYtd">Sort: Best YTD Return</option>
                        <option value="currentValue">Sort: Index Value</option>
                        <option value="constituents">Sort: Constituents</option>
                    </select>
                </div>
            </div>

            {/* Indices Table */}
            {loading ? (
                <IndexTableSkeleton rows={6} />
            ) : indices.length === 0 ? (
                <EmptyState
                    title="No Indices Found"
                    description={
                        search || statusFilter !== 'ALL' || sectorFilter !== 'ALL'
                            ? 'No indices match the selected filters.'
                            : 'No Arthagama indices exist yet in the session.'
                    }
                    actionLabel="Create First Index"
                    onAction={() => router.push('/admin/indices/new')}
                />
            ) : (
                <div className="db-card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--db-border)', background: 'rgba(184, 206, 194, 0.03)' }}>
                                    <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600 }}>Index Name</th>
                                    <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600 }}>Sector</th>
                                    <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'center' }}>Constituents</th>
                                    <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>Current Value</th>
                                    <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>1D Return</th>
                                    <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600 }}>Last Updated</th>
                                    <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {indices.map((idx, index) => {
                                    const perf = idx.performance
                                    const isPos = (perf?.percentChange ?? 0) >= 0

                                    return (
                                        <tr
                                            key={idx.indexId}
                                            style={{
                                                borderBottom: index < indices.length - 1 ? '1px solid var(--db-border)' : 'none',
                                                transition: 'background var(--db-transition)',
                                            }}
                                        >
                                            {/* Name & Symbol */}
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--db-text)' }}>
                                                        {idx.indexName}
                                                    </span>
                                                    <span style={{ fontSize: '11px', color: 'var(--db-mint)', fontFamily: 'monospace' }}>
                                                        {idx.indexSymbol || `ID: #${idx.indexId}`}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Sector */}
                                            <td style={{ padding: '14px 20px', color: 'var(--db-text-2)' }}>
                                                {idx.sector}
                                            </td>

                                            {/* Constituents */}
                                            <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        background: 'var(--db-elevated)',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        color: 'var(--db-text-2)',
                                                    }}
                                                >
                                                    <Layers size={12} /> {idx.constituentCount}
                                                </span>
                                            </td>

                                            {/* Value */}
                                            <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: 'var(--db-text)' }}>
                                                {formatIndexValue(perf?.currentValue)}
                                            </td>

                                            {/* 1D Return */}
                                            <td
                                                style={{
                                                    padding: '14px 20px',
                                                    textAlign: 'right',
                                                    fontWeight: 600,
                                                    color: isPos ? 'var(--db-profit)' : 'var(--db-loss)',
                                                }}
                                            >
                                                {formatIndexChange(perf?.absoluteChange)} ({formatIndexPercent(perf?.percentChange)})
                                            </td>

                                            {/* Status Badge */}
                                            <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                                <IndexStatusBadge status={idx.status} size="sm" />
                                            </td>

                                            {/* Last Updated */}
                                            <td style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontSize: '12px' }}>
                                                {formatIndexDateTime(idx.updatedAt)}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    {/* Toggle Status Button */}
                                                    <button
                                                        onClick={() => toggleStatus(idx)}
                                                        title={idx.status === 'ACTIVE' ? 'Deactivate Index' : 'Activate Index'}
                                                        style={{
                                                            background: 'var(--db-elevated)',
                                                            border: '1px solid var(--db-border)',
                                                            borderRadius: '6px',
                                                            padding: '6px',
                                                            color: idx.status === 'ACTIVE' ? 'var(--db-warning)' : 'var(--db-profit)',
                                                            cursor: 'pointer',
                                                        }}
                                                        aria-label="Toggle Status"
                                                    >
                                                        <Power size={14} />
                                                    </button>

                                                    {/* Edit Link */}
                                                    <Link
                                                        href={`/admin/indices/${idx.indexId}/edit`}
                                                        title="Edit Index"
                                                        style={{
                                                            background: 'var(--db-elevated)',
                                                            border: '1px solid var(--db-border)',
                                                            borderRadius: '6px',
                                                            padding: '6px',
                                                            color: 'var(--db-mint)',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                        aria-label="Edit Index"
                                                    >
                                                        <Edit2 size={14} />
                                                    </Link>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => setDeleteTarget(idx)}
                                                        title="Delete Index"
                                                        style={{
                                                            background: 'var(--db-elevated)',
                                                            border: '1px solid var(--db-border)',
                                                            borderRadius: '6px',
                                                            padding: '6px',
                                                            color: 'var(--db-loss)',
                                                            cursor: 'pointer',
                                                        }}
                                                        aria-label="Delete Index"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteIndexDialog
                open={deleteTarget !== null}
                index={deleteTarget}
                onConfirmDelete={handleConfirmDelete}
                onDeactivate={handleDeactivateInstead}
                onCancel={() => setDeleteTarget(null)}
                isDeleting={isDeleting}
            />
        </div>
    )
}
