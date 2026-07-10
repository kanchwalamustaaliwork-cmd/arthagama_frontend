interface FilterOption {
    label: string
    value: string
}

interface FilterBarProps {
    options: FilterOption[]
    active: string
    onChange: (value: string) => void
}

export default function FilterBar({ options, active, onChange }: FilterBarProps) {
    return (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`db-filter-pill ${active === opt.value ? 'active' : ''}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}
