import React from 'react'
import type { StrategyMetrics } from '@/src/types/admin'
import type { MetricSectionConfig } from './metricsConfig'
import StrategyMetricCard from './StrategyMetricCard'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import { formatMetricValue, getMetricColor } from '@/src/utils/metrics'

interface MetricSectionProps {
    config: MetricSectionConfig
    metrics: StrategyMetrics
}

export default function MetricSection({ config, metrics }: MetricSectionProps) {
    return (
        <section style={{ marginBottom: '24px' }}>
            <SectionHeader title={config.title} />
            <p
                style={{
                    fontSize: '12px',
                    color: 'var(--db-text-muted)',
                    marginTop: '-8px',
                    marginBottom: '14px',
                }}
            >
                {config.subtitle}
            </p>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '14px',
                }}
            >
                {config.metrics.map((item) => {
                    const rawVal = metrics[item.key]
                    const formattedValue = formatMetricValue(rawVal, item.type)
                    const computedColor = getMetricColor(
                        typeof rawVal === 'number' ? rawVal : undefined,
                        item.colorType
                    )

                    return (
                        <StrategyMetricCard
                            key={item.key}
                            title={item.title}
                            value={formattedValue}
                            iconName={item.iconName}
                            accentColor={item.accentColor}
                            textColor={computedColor}
                            tooltip={item.tooltip}
                        />
                    )
                })}
            </div>
        </section>
    )
}
