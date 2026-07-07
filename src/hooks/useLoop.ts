// hooks/useLoop.ts
"use client"
import { useEffect, useState } from 'react'

/** Cycles through an array of values on an interval, looping forever. */
export function useLoop<T>(values: T[], intervalMs: number) {
    const [index, setIndex] = useState(0)
    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % values.length)
        }, intervalMs)
        return () => clearInterval(id)
    }, [values.length, intervalMs])
    return values[index]
}