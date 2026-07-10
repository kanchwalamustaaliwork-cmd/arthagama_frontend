export interface Sector {
    name: string
    change: number
    marketCap?: string
}

export default function HeatmapCell({ sector }: { sector: Sector }) {
    const clamp = Math.max(-5, Math.min(5, sector.change))
    // Interpolate: -5 = red, 0 = neutral, +5 = green
    const alpha = Math.abs(clamp) / 5
    const bg = clamp > 0
        ? `rgba(56,217,150,${0.1 + alpha * 0.35})`
        : clamp < 0
            ? `rgba(227,93,106,${0.1 + alpha * 0.35})`
            : 'var(--db-elevated)'

    const textColor = clamp > 0 ? 'var(--db-profit)' : clamp < 0 ? 'var(--db-loss)' : 'var(--db-text-muted)'

    return (
        <div
            style={{
                background: bg,
                border: '1px solid var(--db-border)',
                borderRadius: '10px',
                padding: '14px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                textAlign: 'center',
                transition: 'transform 0.15s ease',
                cursor: 'default',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--db-text)', letterSpacing: '0.01em' }}>
                {sector.name}
            </span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: textColor, letterSpacing: '-0.01em' }}>
                {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
            </span>
            {sector.marketCap && (
                <span style={{ fontSize: '10px', color: 'var(--db-text-muted)' }}>{sector.marketCap}</span>
            )}
        </div>
    )
}
