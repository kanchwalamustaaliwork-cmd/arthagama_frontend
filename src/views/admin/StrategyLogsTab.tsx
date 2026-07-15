'use client'

import LogsTable from '@/src/components/admin/LogsTable'
import { useStrategyLogs } from '@/src/hooks/admin/useStrategyLogs'

interface Props { strategyId: string }

export default function StrategyLogsTab({ strategyId }: Props) {
    const {
        logs, total, hasMore, status,
        page, setPage, search, setSearch,
        eventType, setEventType, logStatus, setLogStatus,
    } = useStrategyLogs(strategyId)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)' }}>Execution Logs</h2>
                <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>{total} total events</span>
            </div>
            <LogsTable
                logs={logs}
                total={total}
                page={page}
                hasMore={hasMore}
                search={search}
                onSearchChange={setSearch}
                eventType={eventType}
                onEventTypeChange={setEventType}
                logStatus={logStatus}
                onLogStatusChange={setLogStatus}
                onPageChange={setPage}
            />
        </div>
    )
}
