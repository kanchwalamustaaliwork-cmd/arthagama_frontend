import { useCountUp } from '../../../hooks/useCountUp'
import type { Stock } from '../../../types/compareStocks'
import { METRICS } from '../../../data/stocks'

function MetricCell({ value, suffix, decimals }: { value: number; suffix: string; decimals: number }) {
    const ref = useCountUp(value, decimals)
    return (
        <span className="text-sm font-medium text-[#1B3236]">
            <span ref={ref}>0</span>{suffix}
        </span>
    )
}

export default function MetricsComparisonTable({ stocks }: { stocks: Stock[] }) {
    if (stocks.length === 0) return null

    return (
        <div className="table-card overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.15em] text-[#244147]/55">Metric</th>
                            {stocks.map((s) => (
                                <th key={s.symbol} className="px-6 py-4 text-left">
                                    <span className="flex items-center gap-2 text-xs font-semibold text-[#1B3236]">
                                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                                        {s.symbol}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {METRICS.map((row, i) => (
                            <tr key={row.key} className={i % 2 === 0 ? 'row-alt' : ''}>
                                <td className="px-6 py-3.5 text-sm text-[#244147]/75">{row.label}</td>
                                {stocks.map((s) => (
                                    <td key={s.symbol} className="px-6 py-3.5">
                                        <MetricCell value={s.metrics[row.key]} suffix={row.suffix} decimals={row.decimals} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
        .table-card { background: rgba(184,206,194,0.92); border: 1px solid rgba(184,206,194,1); box-shadow: 0 2px 16px rgba(18,33,36,0.22); }
        .row-alt { background: rgba(18,33,36,0.03); }
      `}</style>
        </div>
    )
}