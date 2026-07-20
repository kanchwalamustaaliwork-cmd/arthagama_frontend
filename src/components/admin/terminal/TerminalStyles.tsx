export default function TerminalStyles() {
    return (
        <style>{`
            .terminal-window {
                background: #090d16;
                border: 1px solid #1e293b;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                height: calc(100vh - 320px);
                min-height: 480px;
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5);
            }
            .terminal-header {
                background: #0f172a;
                border-bottom: 1px solid #1e293b;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 16px;
                user-select: none;
                flex: none;
            }
            .terminal-dots {
                display: flex;
                gap: 6px;
            }
            .terminal-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }
            .terminal-body {
                flex: 1;
                min-height: 0;   /* CRITICAL: without this, flex items default to min-height:auto and refuse
                                     to shrink below content size — the terminal never actually scrolls
                                     internally, and the whole page/outer scrollbar has to be used instead */
                overflow-y: auto;
                overscroll-behavior: contain;  /* stop wheel scroll from bubbling to the page once terminal is scrolled */
                padding: 16px 0;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                font-size: 13px;
                color: #cbd5e1;
            }
            .terminal-body::-webkit-scrollbar {
                width: 10px;
            }
            .terminal-body::-webkit-scrollbar-track {
                background: #090d16;
            }
            .terminal-body::-webkit-scrollbar-thumb {
                background: #1e293b;
                border-radius: 5px;
            }
            .terminal-body::-webkit-scrollbar-thumb:hover {
                background: #334155;
            }
            .terminal-line {
                display: flex;
                padding: 3px 20px;
                line-height: 20px;
                transition: background 0.1s;
            }
            .terminal-line:hover {
                background: rgba(255, 255, 255, 0.03);
            }
            .terminal-time {
                width: 180px;
                color: #475569;
                flex-shrink: 0;
                user-select: none;
            }
            .terminal-level {
                width: 80px;
                flex-shrink: 0;
                font-weight: 700;
                user-select: none;
            }
            .terminal-msg {
                flex: 1;
                white-space: pre-wrap;
                word-break: break-all;
            }
            .terminal-status-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px;
                color: #64748b;
                font-family: inherit;
                font-size: 12px;
            }
            @media (max-width: 768px) {
                .terminal-time {
                    width: 140px;
                }
            }
            @media (max-width: 640px) {
                .terminal-line {
                    font-size: 11.5px;
                    padding: 3px 10px;
                }
                .terminal-time {
                    width: 70px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .terminal-level {
                    width: 60px;
                }
            }
        `}</style>
    )
}