// Macro module types — Phase 1

export interface MacroTile {
    key: string
    name: string
    unit: string
    value?: number | null
    change_pct?: number | null
    source: string
    available: boolean
}

export interface MacroSnapshot {
    tiles: MacroTile[]
}

export interface MacroSeriesPoint {
    date: string
    value: number
}

export interface MacroDetail {
    key: string
    name: string
    unit?: string
    description?: string
    value?: number | null
    change_pct?: number | null
    source?: string
    available: boolean
    series?: MacroSeriesPoint[]
    reason?: string
}
