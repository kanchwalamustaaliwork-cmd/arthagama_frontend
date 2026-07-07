// components/services/visuals/ServiceVisual.tsx
"use client"

import type { ServiceVisualType } from '../../../types/services'
import TerminalVisual from './TerminalVisual'
import BacktestVisual from './BacktestVisual'
import ResearchVisual from './ResearchVisual'
import ExecutionVisual from './ExecutionVisual'
import CompareVisual from './CompareVisual'

const VISUAL_MAP: Record<ServiceVisualType, React.ComponentType> = {
    terminal: TerminalVisual,
    backtest: BacktestVisual,
    research: ResearchVisual,
    execution: ExecutionVisual,
    compare: CompareVisual
}

export default function ServiceVisual({ type }: { type: ServiceVisualType }) {
    const Visual = VISUAL_MAP[type]
    return <Visual />
}