import LevelFilterPills from './LevelFilterPills'
import LogSearchBox from './LogSearchBox'

interface TerminalToolbarProps {
    total: number
    level: string
    onLevelChange: (v: string) => void
    search: string
    onSearchChange: (v: string) => void
}

export default function TerminalToolbar({
    total,
    level,
    onLevelChange,
    search,
    onSearchChange,
}: TerminalToolbarProps) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--db-text-muted)', fontWeight: 500 }}>
                    Filtered: <strong>{total}</strong> log entries
                </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <LevelFilterPills level={level} onLevelChange={onLevelChange} />
                <LogSearchBox search={search} onSearchChange={onSearchChange} />
            </div>
        </div>
    )
}