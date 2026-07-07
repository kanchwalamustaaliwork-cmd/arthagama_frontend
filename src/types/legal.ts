import type { ReactNode } from 'react'
export interface LegalSection {
    id: string
    heading: string
    paragraphs: (string | ReactNode)[]
}

export interface LegalPageLayoutProps {
    eyebrow: string
    title: string
    lastUpdated: string
    intro: string
    sections: LegalSection[]
}
