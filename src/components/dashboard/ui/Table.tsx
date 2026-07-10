'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export interface Column<T> {
    key: keyof T | string
    header: string
    width?: string
    align?: 'left' | 'right' | 'center'
    render?: (value: unknown, row: T) => React.ReactNode
    sortable?: boolean
}

interface TableProps<T> {
    columns: Column<T>[]
    rows: T[]
    keyField?: keyof T
    emptyMessage?: string
    onRowClick?: (row: T) => void
}

export default function Table<T extends Record<string, unknown>>({
    columns,
    rows,
    keyField,
    emptyMessage = 'No data available',
    onRowClick,
}: TableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

    const handleSort = (col: Column<T>) => {
        if (!col.sortable) return
        if (sortKey === String(col.key)) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(String(col.key))
            setSortDir('asc')
        }
    }

    const sorted = sortKey
        ? [...rows].sort((a, b) => {
            const av = a[sortKey]
            const bv = b[sortKey]
            if (av === undefined || bv === undefined) return 0
            const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
            return sortDir === 'asc' ? cmp : -cmp
        })
        : rows

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="db-table">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={String(col.key)}
                                style={{
                                    width: col.width,
                                    textAlign: col.align ?? 'left',
                                    cursor: col.sortable ? 'pointer' : 'default',
                                    userSelect: 'none',
                                }}
                                onClick={() => handleSort(col)}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    {col.header}
                                    {col.sortable && sortKey === String(col.key) && (
                                        sortDir === 'asc'
                                            ? <ChevronUp size={11} />
                                            : <ChevronDown size={11} />
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sorted.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                style={{ textAlign: 'center', color: 'var(--db-text-muted)', padding: '32px' }}
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        sorted.map((row, i) => (
                            <tr
                                key={keyField ? String(row[keyField as string]) : i}
                                style={{ cursor: onRowClick ? 'pointer' : undefined }}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map(col => (
                                    <td key={String(col.key)} style={{ textAlign: col.align ?? 'left' }}>
                                        {col.render
                                            ? col.render(row[col.key as string], row)
                                            : String(row[col.key as string] ?? '—')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
