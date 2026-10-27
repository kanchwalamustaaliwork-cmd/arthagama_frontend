/**
 * src/utils/indices/validate-index.ts
 *
 * Validation functions for Arthagama Index create and edit operations.
 */

import { CreateIndexRequest, ArthagamaIndex } from '@/src/types/indices'

export interface IndexValidationError {
    field: string
    message: string
}

export function validateIndexForm(
    payload: Partial<CreateIndexRequest>,
    existingIndices: ArthagamaIndex[] = [],
    currentIndexId?: number
): IndexValidationError[] {
    const errors: IndexValidationError[] = []

    // 1. Index Name
    if (!payload.indexName || !payload.indexName.trim()) {
        errors.push({ field: 'indexName', message: 'Index Name is required.' })
    } else {
        const trimmed = payload.indexName.trim().toLowerCase()
        const duplicate = existingIndices.find(
            idx => idx.indexId !== currentIndexId && idx.indexName.trim().toLowerCase() === trimmed
        )
        if (duplicate) {
            errors.push({ field: 'indexName', message: 'An index with this name already exists.' })
        }
    }

    // 2. Sector
    if (!payload.sector || !payload.sector.trim()) {
        errors.push({ field: 'sector', message: 'Sector is required.' })
    }

    // 3. Symbol (optional, but must be unique if provided)
    if (payload.indexSymbol && payload.indexSymbol.trim()) {
        const sym = payload.indexSymbol.trim().toUpperCase()
        const duplicateSym = existingIndices.find(
            idx => idx.indexId !== currentIndexId && idx.indexSymbol?.trim().toUpperCase() === sym
        )
        if (duplicateSym) {
            errors.push({ field: 'indexSymbol', message: 'This ticker symbol is already assigned to another index.' })
        }
    }

    // 4. Base Value
    if (payload.baseValue === undefined || payload.baseValue === null || isNaN(Number(payload.baseValue))) {
        errors.push({ field: 'baseValue', message: 'Base value is required.' })
    } else if (Number(payload.baseValue) <= 0) {
        errors.push({ field: 'baseValue', message: 'Base value must be a positive number.' })
    }

    // 5. Base Date
    if (!payload.baseDate || isNaN(new Date(payload.baseDate).getTime())) {
        errors.push({ field: 'baseDate', message: 'A valid base date is required.' })
    }

    // 6. Constituents
    const constituents = payload.constituents || []
    if (payload.status === 'ACTIVE' && constituents.length === 0) {
        errors.push({
            field: 'constituents',
            message: 'Active indices must contain at least one constituent instrument.',
        })
    }

    // Duplicate constituents check
    const instrumentIds = new Set<number>()
    let hasDuplicateConstituents = false
    for (const c of constituents) {
        if (instrumentIds.has(c.instrumentId)) {
            hasDuplicateConstituents = true
            break
        }
        instrumentIds.add(c.instrumentId)
    }
    if (hasDuplicateConstituents) {
        errors.push({
            field: 'constituents',
            message: 'Cannot add the same instrument more than once to an index.',
        })
    }

    // Weight validation if weights are provided
    const withWeights = constituents.filter(c => c.weight !== undefined && c.weight !== null)
    if (withWeights.length > 0) {
        let weightSum = 0
        for (const c of withWeights) {
            const w = Number(c.weight)
            if (isNaN(w) || w < 0) {
                errors.push({ field: 'weights', message: 'Weights must be non-negative numbers.' })
                break
            }
            weightSum += w
        }
        // If all constituents have weights, check if they sum up to ~100%
        if (withWeights.length === constituents.length && constituents.length > 0) {
            if (Math.abs(weightSum - 100) > 0.5) {
                errors.push({
                    field: 'weights',
                    message: `Total weights must sum to 100% (currently ${weightSum.toFixed(1)}%).`,
                })
            }
        }
    }

    return errors
}
