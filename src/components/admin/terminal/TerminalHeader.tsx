export default function TerminalHeader() {
    return (
        <div className="terminal-header">
            <div className="terminal-dots">
                <div className="terminal-dot" style={{ background: '#ef4444' }} />
                <div className="terminal-dot" style={{ background: '#f59e0b' }} />
                <div className="terminal-dot" style={{ background: '#22c55e' }} />
            </div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, fontFamily: 'monospace' }}>
                strategy-log-viewer.sh
            </span>
            <div style={{ width: '42px' }} />
        </div>
    )
}