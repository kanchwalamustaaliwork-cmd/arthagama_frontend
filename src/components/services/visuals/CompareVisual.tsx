// components/services/visuals/CompareVisual.tsx
"use client"

import { useLoop } from '../../../hooks/useLoop'
import { SNAPSHOTS_COMPARE, COLORS, GRID_COLS } from '@/src/data/visuals'


export default function CompareVisual() {
    const snap = useLoop(SNAPSHOTS_COMPARE, 4200)
    const n = snap.stocks.length
    const colsClass = GRID_COLS[n] ?? 'grid-cols-4'

    return (
        <div className="compare-visual flex h-full flex-col justify-center gap-2.5 p-5 sm:gap-3 sm:p-6">
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                {snap.stocks.map((s, i) => {
                    const up = s.chg.startsWith('+')
                    return (
                        <div key={s.symbol} className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="font-medium text-[#EAF1EC]">{s.symbol}</span>
                            <span className={up ? 'text-[#9FD9B8]' : 'text-[#E3A8A8]'}>{s.chg}</span>
                        </div>
                    )
                })}
            </div>

            {/* Chart */}
            <svg viewBox="0 0 200 70" className="h-16 w-full sm:h-20">
                {snap.stocks.map((s, i) => (
                    <path
                        key={s.symbol}
                        d={s.path}
                        fill="none"
                        stroke={COLORS[i % COLORS.length]}
                        strokeWidth="1.4"
                        strokeDasharray={i % 2 === 1 ? '4 3' : undefined}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="compare-path"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </svg>

            {/* Volatility cards */}
            <div className={`grid ${colsClass} gap-1.5`}>
                {snap.stocks.map((s, i) => (
                    <div key={s.symbol} className="metric-card rounded-md px-1.5 py-1.5 text-center">
                        <div className="truncate text-[7px] uppercase tracking-[0.1em] text-[#B8CEC2]/60">
                            {s.symbol.slice(0, 6)}
                        </div>
                        <div className="text-[10px] font-medium sm:text-[11px]" style={{ color: COLORS[i % COLORS.length] }}>
                            {s.vol}
                        </div>
                    </div>
                ))}
            </div>

            {/* Correlation matrix */}
            <div
                className="grid gap-0.5"
                style={{ gridTemplateColumns: `auto repeat(${n}, minmax(0, 1fr))` }}
            >
                <div />
                {snap.stocks.map((s) => (
                    <div key={s.symbol} className="corr-label truncate text-center">
                        {s.symbol.slice(0, 3)}
                    </div>
                ))}
                {snap.stocks.map((rowStock, i) => (
                    <>
                        <div key={`label-${rowStock.symbol}`} className="corr-label truncate pr-1.5 text-right">
                            {rowStock.symbol.slice(0, 3)}
                        </div>
                        {snap.corr[i].map((val, j) => (
                            <div
                                key={`${i}-${j}`}
                                className="corr-cell flex items-center justify-center rounded"
                                style={{ background: `rgba(159, 217, 184, ${i === j ? 0.05 : val * 0.55})` }}
                            >
                                {val.toFixed(2)}
                            </div>
                        ))}
                    </>
                ))}
            </div>

            <style>{`
        .compare-visual { background: rgba(10, 20, 20, 0.4); }
        .compare-path { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw 1.8s ease-out forwards; }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        .metric-card { background: rgba(184, 206, 194, 0.06); border: 1px solid rgba(184, 206, 194, 0.12); }
        .corr-label {
          font-size: 7px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(184, 206, 194, 0.6);
          padding: 1px;
        }
        .corr-cell {
          aspect-ratio: 1;
          max-height: 18px;
          font-size: 8px;
          color: #EAF1EC;
          border: 1px solid rgba(184, 206, 194, 0.1);
        }
      `}</style>
        </div>
    )
}