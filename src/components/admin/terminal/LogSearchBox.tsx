import SearchBar from '@/src/components/dashboard/ui/SearchBar'

interface LogSearchBoxProps {
    search: string
    onSearchChange: (v: string) => void
}

export default function LogSearchBox({ search, onSearchChange }: LogSearchBoxProps) {
    return (
        <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Filter message content..."
            width="220px"
            iconColor="#64748b"
            inputStyle={{
                background: 'var(--db-elevated)',
                border: '1px solid var(--db-border)',
                borderRadius: 'var(--db-radius-md)',
                color: 'var(--db-text)',
                fontSize: '13px',
                height: '32px',
                paddingLeft: '30px',
            }}
        />
    )
}