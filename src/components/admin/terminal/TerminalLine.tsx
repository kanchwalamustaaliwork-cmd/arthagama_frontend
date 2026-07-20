import type { TerminalLogItem } from '@/src/types/admin'
import { formatLogTimestamp, getLogLevelColor } from '@/src/utils/terminalLogFormat'

interface TerminalLineProps {
    log: TerminalLogItem
}

export default function TerminalLine({ log }: TerminalLineProps) {
    const timeStr = formatLogTimestamp(log.timestamp)
    const levelStr = log.level.toUpperCase()
    const levelColor = getLogLevelColor(levelStr)

    return (
        <div className="terminal-line">
            <span className="terminal-time">{timeStr}</span>
            <span className="terminal-level" style={{ color: levelColor }}>
                {levelStr.padEnd(8)}
            </span>
            <span className="terminal-msg">{log.message}</span>
        </div>
    )
}