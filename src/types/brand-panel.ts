export interface BrandPanelProps {
    /** Wrapper class for outer container (control width/padding per page) */
    className?: string
    /** Class for the logo image */
    logoClassName?: string
    /** Class for the name image */
    nameClassName?: string
    /** Show/hide the tagline text */
    showTagline?: boolean
    /** Apply GSAP animation trigger classes (name-reveal / blur-in) */
    animated?: boolean
}