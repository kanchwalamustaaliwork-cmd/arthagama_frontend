import { Search, X } from 'lucide-react'

interface LogSearchBoxProps {
    search: string
    onSearchChange: (v: string) => void
}

export default function LogSearchBox({ search, onSearchChange }: LogSearchBoxProps) {
    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px' }} />
            <input
                type="text"
                placeholder="Filter message content..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                    background: 'var(--db-elevated)',
                    border: '1px solid var(--db-border)',
                    borderRadius: 'var(--db-radius-md)',
                    color: 'var(--db-text)',
                    fontSize: '13px',
                    padding: '6px 10px 6px 30px',
                    width: '220px',
                    outline: 'none',
                }}
            />
            {search && (
                <button
                    onClick={() => onSearchChange('')}
                    style={{
                        position: 'absolute',
                        right: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <X size={12} />
                </button>
            )}
        </div>
    )
}