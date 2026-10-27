/**
 * src/components/indices/IndexSparkline.tsx
 *
 * Vector SVG sparkline for displaying index performance trends on cards.
 */

interface IndexSparklineProps {
    points?: number[]
    isPositive?: boolean
    width?: number
    height?: number
}

export default function IndexSparkline({
    points = [],
    isPositive = true,
    width = 110,
    height = 36,
}: IndexSparklineProps) {
    if (!points || points.length < 2) return null

    const min = Math.min(...points)
    const max = Math.max(...points)
    const range = max - min || 1

    const pad = 3
    const usableH = height - pad * 2
    const usableW = width - pad * 2

    const coords = points.map((val, idx) => {
        const x = pad + (idx / (points.length - 1)) * usableW
        const y = pad + (1 - (val - min) / range) * usableH
        return `${x.toFixed(1)},${y.toFixed(1)}`
    })

    const pathD = `M ${coords.join(' L ')}`
    const strokeColor = isPositive ? 'var(--db-profit)' : 'var(--db-loss)'

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ overflow: 'visible', flexShrink: 0 }}
            aria-hidden="true"
        >
            <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
