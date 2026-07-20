interface TerminalErrorStateProps {
    onRetry: () => void
}

export default function TerminalErrorState({ onRetry }: TerminalErrorStateProps) {
    return (
        <div style={{ padding: '40px', color: '#f43f5e', fontFamily: 'inherit' }}>
            <div>ERROR:</div>
            <div style={{ marginTop: '8px', color: '#cbd5e1' }}>
                Unable to fetch logs from engine database. Click to retry.
            </div>
            <button
                onClick={onRetry}
                style={{
                    marginTop: '16px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#cbd5e1',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Retry Connection
            </button>
        </div>
    )
}