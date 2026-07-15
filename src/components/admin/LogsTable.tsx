'use client'

import type { AdminLog, LogStatus } from '@/src/types/admin'
import Badge from '@/src/components/dashboard/ui/Badge'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import Button from '@/src/components/dashboard/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const STATUS_VARIANT: Record<LogStatus, 'success' | 'error' | 'warning' | 'neutral'> = {
    success: 'success',
    failed:  'error',
    pending: 'neutral',
    warning: 'warning',
}

const EVENT_TYPE_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Orders', value: 'order_executed' },
    { label: 'Signals', value: 'signal_generated' },
    { label: 'Errors', value: 'error' },
    { label: 'System', value: 'strategy_started' },
]

const STATUS_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Success', value: 'success' },
    { label: 'Failed', value: 'failed' },
    { label: 'Warning', value: 'warning' },
]

interface LogsTableProps {
    logs: AdminLog[]
    total: number
    page: number
    pageSize?: number
    hasMore: boolean
    search: string
    onSearchChange: (v: string) => void
    eventType: string
    onEventTypeChange: (v: string) => void
    logStatus: string
    onLogStatusChange: (v: string) => void
    onPageChange: (p: number) => void
}

export default function LogsTable({
    logs, total, page, pageSize = 10, hasMore, search, onSearchChange, eventType, onEventTypeChange, logStatus, onLogStatusChange, onPageChange
}: LogsTableProps) {
    const fmtTime = (iso: string) => {
        const d = new Date(iso)
        return `${d.toLocaleDateString('en-IN')} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <SearchBar value={search} onChange={onSearchChange} placeholder="Search logs…" width="260px" />
                <FilterBar options={EVENT_TYPE_FILTERS} active={eventType} onChange={onEventTypeChange} />
                <FilterBar options={STATUS_FILTERS} active={logStatus} onChange={onLogStatusChange} />
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table className="db-table">
                    <thead>
                        <tr>
                            {['Timestamp', 'Event', 'Description', 'Status', 'Action'].map(h => <th key={h}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--db-text-muted)' }}>
                                    {search ? 'No logs match your search' : 'No logs found'}
                                </td>
                            </tr>
                        ) : logs.map(log => (
                            <tr key={log.id}>
                                <td style={{ whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '11.5px' }}>{fmtTime(log.timestamp)}</td>
                                <td>
                                    <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'var(--db-elevated)', color: 'var(--db-text-2)', fontFamily: 'monospace' }}>
                                        {log.eventType}
                                    </span>
                                </td>
                                <td style={{ maxWidth: '340px' }}>
                                    <span style={{ fontSize: '12.5px', color: 'var(--db-text-2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                                        {log.description}
                                    </span>
                                </td>
                                <td>
                                    <Badge variant={STATUS_VARIANT[log.status]} dot>
                                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                    </Badge>
                                </td>
                                <td style={{ fontWeight: 500, fontSize: '12px', color: 'var(--db-mint)', fontFamily: 'monospace' }}>
                                    {log.strategyAction ?? '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {total > pageSize && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} logs
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <Button variant="ghost" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                            <ChevronLeft size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onPageChange(page + 1)} disabled={!hasMore}>
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
