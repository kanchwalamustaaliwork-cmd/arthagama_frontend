import { Loader2 } from 'lucide-react'

interface StatusIndicatorProps {
    label: string
}

export default function StatusIndicator({ label }: StatusIndicatorProps) {
    return (
        <div className="terminal-status-indicator">
            <Loader2 size={12} className="animate-spin" />
            <span>{label}</span>
        </div>
    )
}