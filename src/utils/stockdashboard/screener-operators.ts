/**
 * src/utils/stockdashboard/screener-operators.ts
 *
 * Evaluation engine for user-defined screener filter rules.
 */

import { ScreenerFilterRule, ScreenerStockResult } from '@/src/types/stockdashboard'

export function evaluateFilterRule(stock: ScreenerStockResult, rule: ScreenerFilterRule): boolean {
    const rawVal = (stock as any)[rule.field]
    if (rawVal === undefined || rawVal === null) return false

    const stockNum = Number(rawVal)
    const targetNum = Number(rule.value)

    if (isNaN(stockNum) || isNaN(targetNum)) return true

    switch (rule.operator) {
        case 'gt':
            return stockNum > targetNum
        case 'gte':
            return stockNum >= targetNum
        case 'lt':
            return stockNum < targetNum
        case 'lte':
            return stockNum <= targetNum
        case 'eq':
            return Math.abs(stockNum - targetNum) < 0.001
        case 'between': {
            const secondary = Number(rule.secondaryValue)
            if (isNaN(secondary)) return stockNum >= targetNum
            const min = Math.min(targetNum, secondary)
            const max = Math.max(targetNum, secondary)
            return stockNum >= min && stockNum <= max
        }
        default:
            return true
    }
}
