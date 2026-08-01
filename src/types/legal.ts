import type { ReactNode } from 'react'
export interface LegalSection {
    id: string
    heading: string
    paragraphs: (string | ReactNode)[]
}

export interface LegalPageLayoutProps {
    title: string
    lastUpdated: string
    intro: string
    sections: LegalSection[]
}
