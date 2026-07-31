// types/services.ts
export type ServiceVisualType = 'terminal' | 'backtest' | 'research' | 'execution' | 'compare'

export interface ServiceSummary {
    slug: string
    title: string
    shortDescription: string
    highlights: string[]
    visual: ServiceVisualType
    ctaLabel: string
    url: string
}

export interface ServiceContainerProps {
    service: ServiceSummary
    reverse: boolean
    index: number
}