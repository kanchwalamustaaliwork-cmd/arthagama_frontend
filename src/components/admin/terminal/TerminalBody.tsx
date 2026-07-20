'use client'

import type { TerminalLogItem } from '@/src/types/admin'
import TerminalLine from './TerminalLine'
import StatusIndicator from './StatusIndicator'
import TerminalErrorState from './TerminalErrorState'

interface TerminalBodyProps {
    logs: TerminalLogItem[]
    status: 'loading' | 'ready' | 'error'
    hasPrevious: boolean
    hasNext: boolean
    onRetry: () => void
    containerRef: React.RefObject<HTMLDivElement | null>
    onScroll: () => void
}

export default function TerminalBody({
    logs,
    status,
    hasPrevious,
    hasNext,
    onRetry,
    containerRef,
    onScroll,
}: TerminalBodyProps) {
    return (
        <div className="terminal-body" ref={containerRef} onScroll={onScroll}>
            {status === 'loading' && hasPrevious && (
                <StatusIndicator label="Fetching previous events..." />
            )}

            {status === 'error' && logs.length === 0 ? (
                <TerminalErrorState onRetry={onRetry} />
            ) : logs.length === 0 ? (
                <div style={{ padding: '40px', color: '#64748b', fontFamily: 'inherit', fontStyle: 'italic' }}>
                    {status === 'loading' ? 'Establishing session...' : 'No logs available.'}
                </div>
            ) : (
                logs.map((log) => <TerminalLine key={log.id} log={log} />)
            )}

            {status === 'loading' && (hasNext || logs.length === 0) && (
                <StatusIndicator label="Loading additional logs..." />
            )}
        </div>
    )
}