/**
 * src/mocks/indices/index-store.ts
 *
 * In-memory state manager for Arthagama Indices and Constituents.
 * Keeps relation records consistent across CRUD actions within the active session.
 */

import {
    ArthagamaIndex,
    CreateIndexRequest,
    UpdateIndexRequest,
    IndexConstituent,
    IndexWithPerformance,
} from '@/src/types/indices'
import { INITIAL_MOCK_INDICES } from './indices.mock'
import { INITIAL_CONSTITUENT_RECORDS, hydrateConstituents } from './index-constituents.mock'
import { getMockPerformanceSummary, getSparklinePoints } from './index-performance.mock'

type StoreListener = () => void

class IndexStore {
    private indices: ArthagamaIndex[] = [...INITIAL_MOCK_INDICES]
    private constituents = [...INITIAL_CONSTITUENT_RECORDS]
    private listeners = new Set<StoreListener>()

    public subscribe(listener: StoreListener): () => void {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    private notify() {
        this.listeners.forEach(fn => fn())
    }

    public getAllIndices(): ArthagamaIndex[] {
        return [...this.indices]
    }

    public getActiveIndices(): ArthagamaIndex[] {
        return this.indices.filter(idx => idx.status === 'ACTIVE')
    }

    public getIndicesWithPerformance(onlyActive = true): IndexWithPerformance[] {
        const list = onlyActive ? this.getActiveIndices() : this.getAllIndices()
        return list.map(idx => ({
            ...idx,
            performance: getMockPerformanceSummary(idx.indexId, idx.baseValue, idx.baseDate),
            sparkline: getSparklinePoints(idx.indexId),
        }))
    }

    public getIndexById(indexId: number): ArthagamaIndex | undefined {
        return this.indices.find(idx => idx.indexId === indexId)
    }

    public getConstituentsForIndex(indexId: number): IndexConstituent[] {
        const records = this.constituents.filter(c => c.indexId === indexId)
        return hydrateConstituents(records)
    }

    public getDistinctSectors(onlyActive = true): string[] {
        const list = onlyActive ? this.getActiveIndices() : this.getAllIndices()
        const sectors = Array.from(new Set(list.map(i => i.sector)))
        return sectors.sort()
    }

    public createIndex(payload: CreateIndexRequest): ArthagamaIndex {
        const nextId = this.indices.length > 0
            ? Math.max(...this.indices.map(i => i.indexId)) + 1
            : 1001

        const now = new Date().toISOString()
        const constituentCount = payload.constituents?.length || 0

        const newIndex: ArthagamaIndex = {
            indexId: nextId,
            indexName: payload.indexName.trim(),
            indexSymbol: payload.indexSymbol ? payload.indexSymbol.trim().toUpperCase() : null,
            sector: payload.sector.trim(),
            description: payload.description?.trim() || null,
            baseDate: payload.baseDate,
            baseValue: Number(payload.baseValue) || 1000,
            status: payload.status,
            createdAt: now,
            updatedAt: now,
            constituentCount,
        }

        // Add index
        this.indices = [newIndex, ...this.indices]

        // Add constituents if provided
        if (payload.constituents && payload.constituents.length > 0) {
            const newConstituents = payload.constituents.map(c => ({
                indexId: nextId,
                instrumentId: c.instrumentId,
                weight: c.weight !== undefined && c.weight !== null ? Number(c.weight) : (100 / constituentCount),
                addedAt: now,
            }))
            this.constituents = [...this.constituents, ...newConstituents]
        }

        this.notify()
        return newIndex
    }

    public updateIndex(indexId: number, payload: UpdateIndexRequest): ArthagamaIndex {
        const existing = this.getIndexById(indexId)
        if (!existing) {
            throw new Error(`Index with ID ${indexId} not found`)
        }

        const now = new Date().toISOString()
        let constituentCount = existing.constituentCount

        // If constituents are provided in payload, update relation records
        if (payload.constituents !== undefined) {
            // Remove existing relation records
            this.constituents = this.constituents.filter(c => c.indexId !== indexId)

            const total = payload.constituents.length
            constituentCount = total

            if (total > 0) {
                const newRecords = payload.constituents.map(c => ({
                    indexId,
                    instrumentId: c.instrumentId,
                    weight: c.weight !== undefined && c.weight !== null ? Number(c.weight) : (100 / total),
                    addedAt: now,
                }))
                this.constituents = [...this.constituents, ...newRecords]
            }
        }

        const updated: ArthagamaIndex = {
            ...existing,
            indexName: payload.indexName !== undefined ? payload.indexName.trim() : existing.indexName,
            indexSymbol: payload.indexSymbol !== undefined
                ? (payload.indexSymbol ? payload.indexSymbol.trim().toUpperCase() : null)
                : existing.indexSymbol,
            sector: payload.sector !== undefined ? payload.sector.trim() : existing.sector,
            description: payload.description !== undefined ? payload.description?.trim() || null : existing.description,
            baseDate: payload.baseDate !== undefined ? payload.baseDate : existing.baseDate,
            baseValue: payload.baseValue !== undefined ? Number(payload.baseValue) : existing.baseValue,
            status: payload.status !== undefined ? payload.status : existing.status,
            updatedAt: now,
            constituentCount,
        }

        this.indices = this.indices.map(i => (i.indexId === indexId ? updated : i))
        this.notify()
        return updated
    }

    public deleteIndex(indexId: number): boolean {
        const initialCount = this.indices.length
        this.indices = this.indices.filter(i => i.indexId !== indexId)

        // Keep relation data consistent: remove all constituent links for this index
        this.constituents = this.constituents.filter(c => c.indexId !== indexId)

        const deleted = this.indices.length < initialCount
        if (deleted) this.notify()
        return deleted
    }
}

export const indexStore = new IndexStore()
