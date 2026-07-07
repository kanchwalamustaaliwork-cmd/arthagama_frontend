// components/services/visuals/TerminalVisual.tsx
"use client"

import { useEffect, useState } from 'react'
import { LOG_LINES } from '@/src/data/visuals'


export default function TerminalVisual() {
  const [visibleLines, setVisibleLines] = useState<string[]>([])

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setVisibleLines((prev) => {
        const next = [...prev, LOG_LINES[i % LOG_LINES.length]]
        return next.length > 10 ? next.slice(next.length - 10) : next
      })
      i++
    }, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="terminal-visual flex h-full flex-col justify-end gap-1 overflow-hidden p-3 font-mono text-[9px] sm:gap-1.5 sm:p-4 sm:text-[10px] md:gap-3 md:p-5 md:text-[11px] lg:gap-2.5 lg:p-6 lg:text-xs xl:gap-3 xl:p-8">
      {visibleLines.map((line, idx) => (
        <div
          key={`${line}-${idx}`}
          className="terminal-line min-w-0 truncate text-[#9FD9B8]"
          style={{ opacity: 0.35 + (idx / visibleLines.length) * 0.65 }}
        >
          {line}
        </div>
      ))}
      <div className="flex min-w-0 items-center gap-1 text-[#B8CEC2]">
        <span>&gt;</span>
        <span className="terminal-cursor h-3 w-1.5 bg-[#B8CEC2] lg:h-3.5" />
      </div>

      <style>{`
        .terminal-visual { background: rgba(10, 20, 20, 0.55); background-blend-mode: luminosity; }
        .terminal-line { animation: line-in 0.4s ease-out; }
        @keyframes line-in { from { opacity: 0; transform: translateY(4px); } }
        .terminal-cursor { animation: blink 1s steps(2, start) infinite; }
        @keyframes blink { to { opacity: 0; } }
      `}</style>
    </div>
  )
}