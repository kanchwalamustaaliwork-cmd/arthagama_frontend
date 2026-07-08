import { ReactNode } from 'react'
export interface AmbientGlassPanelProps {
    children: ReactNode
    className?: string
    /** Extra classes for the outer <section> wrapper (padding, etc.) */
    sectionClassName?: string
    /** Turn off the blobs/noise if you just want the glass panel */
    showAmbient?: boolean
    /** Fixed height for the panel so all heroes look consistent. Defaults to 70vh on desktop. */
    minHeight?: string
}