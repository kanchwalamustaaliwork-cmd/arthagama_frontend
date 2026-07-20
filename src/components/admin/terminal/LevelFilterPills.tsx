const LEVELS = ['all', 'INFO', 'WARNING', 'ERROR', 'DEBUG']

interface LevelFilterPillsProps {
    level: string
    onLevelChange: (v: string) => void
}

export default function LevelFilterPills({ level, onLevelChange }: LevelFilterPillsProps) {
    return (
        <div
            style={{
                display: 'flex',
                background: 'var(--db-elevated)',
                border: '1px solid var(--db-border)',
                borderRadius: 'var(--db-radius-md)',
                padding: '2px',
            }}
        >
            {LEVELS.map((lvl) => {
                const isActive = level === lvl
                return (
                    <button
                        key={lvl}
                        onClick={() => onLevelChange(lvl)}
                        style={{
                            border: 'none',
                            background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                            color: isActive ? 'var(--db-text)' : 'var(--db-text-muted)',
                            fontSize: '11px',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all 0.2s',
                        }}
                    >
                        {lvl === 'all' ? 'ALL' : lvl}
                    </button>
                )
            })}
        </div>
    )
}