'use client'

import type { TerminalLogItem } from '@/src/types/admin'
import { useTerminalScroll } from '../../../hooks/admin/useTerminalScroll'
import TerminalToolbar from './TerminalToolbar'
import TerminalHeader from './TerminalHeader'
import TerminalBody from './TerminalBody'
import TerminalStyles from './TerminalStyles'

interface TerminalLogViewerProps {
    logs: TerminalLogItem[]
    total: number
    hasNext: boolean
    hasPrevious: boolean
    status: 'loading' | 'ready' | 'error'
    search: string
    onSearchChange: (v: string) => void
    level: string
    onLevelChange: (v: string) => void
    loadNext: () => void
    loadPrevious: () => Promise<void>
    retry: () => void
}

export default function TerminalLogViewer({
    logs,
    total,
    hasNext,
    hasPrevious,
    status,
    search,
    onSearchChange,
    level,
    onLevelChange,
    loadNext,
    loadPrevious,
    retry,
}: TerminalLogViewerProps) {
    const { containerRef, handleScroll } = useTerminalScroll({
        logs,
        hasPrevious,
        hasNext,
        status,
        loadPrevious,
        loadNext,
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: '520px' }}>
            <TerminalStyles />

            <TerminalToolbar
                total={total}
                level={level}
                onLevelChange={onLevelChange}
                search={search}
                onSearchChange={onSearchChange}
            />

            <div className="terminal-window">
                <TerminalHeader />
                <TerminalBody
                    logs={logs}
                    status={status}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    onRetry={retry}
                    containerRef={containerRef}
                    onScroll={handleScroll}
                />
            </div>
        </div>
    )
}