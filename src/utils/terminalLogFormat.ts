export function formatLogTimestamp(iso: string): string {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso.slice(0, 19).replace('T', ' ')
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function getLogLevelColor(level: string): string {
    const up = level.toUpperCase()
    if (up.includes('INFO')) return '#38bdf8'
    if (up.includes('WARN')) return '#eab308'
    if (up.includes('ERR')) return '#f43f5e'
    if (up.includes('DBG') || up.includes('DEBUG')) return '#94a3b8'
    return 'inherit'
}