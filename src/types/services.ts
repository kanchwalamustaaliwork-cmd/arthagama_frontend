// types/services.ts
export type ServiceVisualType = 'terminal' | 'backtest' | 'research' | 'execution' | 'compare'

export interface ServiceSummary {
    slug: string
    title: string
    shortDescription: string
    highlights: string[]
    visual: ServiceVisualType   // replaces `image`
    ctaLabel: string
}

export interface ServiceContainerProps {
    service: ServiceSummary
    reverse: boolean
    index: number
}