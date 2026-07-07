// components/services/visuals/BacktestVisual.tsx
"use client"

import { useLoop } from '../../../hooks/useLoop'
import { SNAPSHOTS_BACKTEST } from '../../../data/visuals';
import StatCard from '../../ui/StatCard'


export default function BacktestVisual() {
    const snap = useLoop(SNAPSHOTS_BACKTEST, 3200)

    return (
        <div className="backtest-visual flex h-full flex-col justify-center gap-3 p-3 sm:gap-5 sm:p-6 md:gap-7 md:p-8">
            <svg viewBox="0 0 200 90" className="h-14 w-full sm:h-24 md:h-32">
                <path
                    d={snap.path}
                    fill="none"
                    stroke="#B8CEC2"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="equity-path"
                />
            </svg>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4">
                <StatCard label="Net PnL" value={snap.pnl} />
                <StatCard label="Win Ratio" value={snap.win} />
                <StatCard label="Sharpe" value={snap.sharpe} />
            </div>

            <style>{`
        .backtest-visual { background: rgba(10, 20, 20, 0.4); }
        .equity-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw 2s ease-out forwards;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>
        </div>
    )
}