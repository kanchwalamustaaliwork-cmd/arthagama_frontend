export function formatTime(isoString: string | null, fallbackIsoString: string) {
    const dateStr = isoString || fallbackIsoString
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) {
            return 'Recent'
        }
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours}h ago`

        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch {
        return 'Recent'
    }
}