// components/services/visuals/ExecutionVisual.tsx
"use client"

import { useEffect, useState } from 'react'
import { ORDERS } from '@/src/data/visuals';


export default function ExecutionVisual() {
    const [rows, setRows] = useState<{ id: number; order: typeof ORDERS[number]; filled: boolean }[]>([])
    const [latency, setLatency] = useState(3.2)

    useEffect(() => {
        let id = 0
        const push = () => {
            const order = ORDERS[id % ORDERS.length]
            const rowId = id
            setRows((prev) => [...prev.slice(-3), { id: rowId, order, filled: false }])
            setTimeout(() => {
                setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, filled: true } : r)))
            }, 500)
            setLatency(2.8 + Math.random() * 1.6)
            id++
        }
        push()
        const interval = setInterval(push, 1600)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="execution-visual flex h-full flex-col justify-center gap-5 p-6 md:gap-2 md:p-4   sm:gap-6 sm:p-8">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-[#B8CEC2]/60 sm:text-[11px]">
                <span>Signal → Broker → Exchange</span>
                <span className="text-[#9FD9B8]">{latency.toFixed(1)}ms</span>
            </div>

            <div className="flex flex-col gap-3">
                {rows.map((r) => (
                    <div
                        key={r.id}
                        className="order-row flex items-center justify-between rounded-lg px-4 py-3 text-xs sm:text-sm"
                    >
                        <span className={r.order.side === 'BUY' ? 'text-[#9FD9B8]' : 'text-[#E3A8A8]'}>
                            {r.order.side}
                        </span>
                        <span className="text-[#EAF1EC]/85">{r.order.symbol}</span>
                        <span className="text-[#DCE7E1]/60">{r.order.qty}</span>
                        <span className={`fill-pulse text-[10px] ${r.filled ? 'text-[#9FD9B8]' : 'text-[#B8CEC2]/40'}`}>
                            {r.filled ? 'FILLED' : 'ROUTING'}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
        .execution-visual { background: rgba(10, 20, 20, 0.4); }
        .order-row {
          background: rgba(184, 206, 194, 0.06);
          border: 1px solid rgba(184, 206, 194, 0.12);
          animation: row-in 0.35s ease-out;
        }
        @keyframes row-in { from { opacity: 0; transform: translateY(6px); } }
      `}</style>
        </div>
    )
}