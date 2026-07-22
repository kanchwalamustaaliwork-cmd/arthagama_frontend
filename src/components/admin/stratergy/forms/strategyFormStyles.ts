import type { CSSProperties } from 'react'

const chevronBg =
    'var(--db-elevated) url("data:image/svg+xml;utf8,<svg fill=\'%23A5B7B3\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 12px center'

export const fieldStyle: CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'var(--db-elevated)',
    border: '1px solid var(--db-border)',
    borderRadius: 'var(--db-radius-md)',
    color: 'var(--db-text)',
    fontSize: '13.5px',
    padding: '10px 12px',
    resize: 'vertical',
    lineHeight: 1.5,
    outline: 'none',
    transition: 'border-color var(--db-transition)',
    fontFamily: 'inherit',
}

// Single-line input variant (no resize handle)
export const inputStyle: CSSProperties = { ...fieldStyle, resize: undefined }

// Disabled/readonly input variant
export const disabledInputStyle: CSSProperties = { ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }

// <select> variant with the custom chevron background
export const selectStyle: CSSProperties = {
    ...fieldStyle,
    WebkitAppearance: 'none',
    appearance: 'none',
    background: chevronBg,
}

export const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '11px',
    color: 'var(--db-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: '6px',
    fontWeight: 500,
}

export const gridTwoColStyle = (gap: string = '16px'): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap,
})