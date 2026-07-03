export interface ServiceSummary {
    slug: string
    title: string
    shortDescription: string
    highlights: string[]
    image: string
    ctaLabel: string
}

export interface ServiceContainerProps {
    service: ServiceSummary
    reverse: boolean
    index: number
}