'use client'

import TerminalLogViewer from '@/src/components/admin/TerminalLogViewer'
import { useStrategyLogs } from '@/src/hooks/admin/useStrategyLogs'

interface Props { strategyId: string }

export default function StrategyLogsTab({ strategyId }: Props) {
    const {
        logs, total, hasNext, hasPrevious, status,
        search, setSearch, level, setLevel,
        loadNext, loadPrevious, retry,
    } = useStrategyLogs(strategyId)

    return (
        <TerminalLogViewer
            logs={logs}
            total={total}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            status={status}
            search={search}
            onSearchChange={setSearch}
            level={level}
            onLevelChange={setLevel}
            loadNext={loadNext}
            loadPrevious={loadPrevious}
            retry={retry}
        />
    )
}
