import { useRef, useLayoutEffect, useCallback } from 'react'
import type { TerminalLogItem } from '@/src/types/admin'

interface UseTerminalScrollArgs {
    logs: TerminalLogItem[]
    hasPrevious: boolean
    hasNext: boolean
    status: 'loading' | 'ready' | 'error'
    loadPrevious: () => Promise<void>
    loadNext: () => void
}

export function useTerminalScroll({
    logs,
    hasPrevious,
    hasNext,
    status,
    loadPrevious,
    loadNext,
}: UseTerminalScrollArgs) {
    const containerRef = useRef<HTMLDivElement>(null)
    const prevScrollHeightRef = useRef(0)
    const prevScrollTopRef = useRef(0)
    const prevFirstLogIdRef = useRef<string | undefined>(undefined)
    const firstLogId = logs[0]?.id

    // Preserve scroll position when older logs are prepended above the current view
    useLayoutEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (prevFirstLogIdRef.current && firstLogId && prevFirstLogIdRef.current !== firstLogId) {
            const heightDiff = container.scrollHeight - prevScrollHeightRef.current
            container.scrollTop = prevScrollTopRef.current + heightDiff
        }

        prevFirstLogIdRef.current = firstLogId
    }, [logs, firstLogId])

    const handleScroll = useCallback(() => {
        const container = containerRef.current
        if (!container) return

        const { scrollTop, scrollHeight, clientHeight } = container

        if (scrollTop <= 40 && hasPrevious && status !== 'loading') {
            prevScrollHeightRef.current = scrollHeight
            prevScrollTopRef.current = scrollTop
            loadPrevious()
        }

        if (scrollTop + clientHeight >= scrollHeight - 40 && hasNext && status !== 'loading') {
            loadNext()
        }
    }, [hasPrevious, hasNext, status, loadPrevious, loadNext])

    return { containerRef, handleScroll }
}