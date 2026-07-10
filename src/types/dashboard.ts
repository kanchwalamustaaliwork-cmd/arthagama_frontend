export type ActivityAction = 'created' | 'edited' | 'backtest' | 'viewed' | 'cloned'

export interface Activity {
    id: string
    action: ActivityAction
    subject: string
    detail?: string
    timestamp: string
}

export interface StrategyFormData {
    name: string
    description: string
    instruments: string
    entryRules: string
    exitRules: string
    riskPct: string
}