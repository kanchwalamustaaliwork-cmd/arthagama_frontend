/**
 * src/components/indices/IndexConstituentsTable.tsx
 *
 * Tabular constituent view for an index.
 */

import { IndexConstituent } from '@/src/types/indices'
import { formatIndexDate } from '@/src/utils/indices/format-index-value'

interface IndexConstituentsTableProps {
    constituents: IndexConstituent[]
}

export default function IndexConstituentsTable({ constituents }: IndexConstituentsTableProps) {
    if (!constituents || constituents.length === 0) {
        return (
            <div className="db-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--db-text-muted)' }}>
                No constituent instruments currently linked to this index.
            </div>
        )
    }

    return (
        <div className="db-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)' }}>
                    Index Constituents ({constituents.length})
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                    Methodology: Capital / Equity Weighted
                </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--db-border)', background: 'rgba(184, 206, 194, 0.03)' }}>
                            <th style={{ padding: '12px 20px', color: 'var(--db-text-muted)', fontWeight: 600 }}>Instrument</th>
                            <th style={{ padding: '12px 20px', color: 'var(--db-text-muted)', fontWeight: 600 }}>Exchange</th>
                            <th style={{ padding: '12px 20px', color: 'var(--db-text-muted)', fontWeight: 600 }}>Sector</th>
                            <th style={{ padding: '12px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>Weight (%)</th>
                            <th style={{ padding: '12px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>Added Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {constituents.map((item, idx) => {
                            const inst = item.instrument
                            const weightStr = item.weight !== null && item.weight !== undefined
                                ? `${Number(item.weight).toFixed(1)}%`
                                : '—'

                            return (
                                <tr
                                    key={item.instrumentId}
                                    style={{
                                        borderBottom: idx < constituents.length - 1 ? '1px solid var(--db-border)' : 'none',
                                        transition: 'background var(--db-transition)',
                                    }}
                                >
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--db-text)' }}>
                                                {inst.symbol}
                                            </span>
                                            {inst.name && (
                                                <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                                                    {inst.name}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: 'var(--db-elevated)',
                                                color: 'var(--db-text-2)',
                                            }}
                                        >
                                            {inst.exchange}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: 'var(--db-text-2)' }}>
                                        {inst.sector || 'General'}
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: 'var(--db-text)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                            <span>{weightStr}</span>
                                            {item.weight !== null && item.weight !== undefined && (
                                                <div
                                                    style={{
                                                        width: '40px',
                                                        height: '4px',
                                                        borderRadius: '2px',
                                                        background: 'var(--db-elevated)',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: `${Math.min(100, Math.max(0, item.weight))}%`,
                                                            height: '100%',
                                                            background: 'var(--db-mint)',
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', color: 'var(--db-text-muted)' }}>
                                        {formatIndexDate(item.addedAt)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
