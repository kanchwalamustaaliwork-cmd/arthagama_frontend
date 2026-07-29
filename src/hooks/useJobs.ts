import { useEffect, useMemo, useState } from 'react'
import type { JobListing, JobType, Department } from '../types/careers'
import { getJobs } from '../lib/cms/careers'
import { useDebounce } from './useDebounce'

export function useJobs(initialJobs?: JobListing[]) {
    const [jobs, setJobs] = useState<JobListing[]>(initialJobs ?? [])
    const [status, setStatus] = useState<'loading' | 'error' | 'ready'>(
        initialJobs && initialJobs.length > 0 ? 'ready' : 'loading'
    )
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 300)
    const activeQuery = query === '' ? '' : debouncedQuery

    const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all')
    const [deptFilter, setDeptFilter] = useState<Department | 'all'>('all')

    useEffect(() => {
        let cancelled = false
        // If initialJobs were provided by server component, we are already ready
        if (initialJobs && initialJobs.length > 0) {
            return
        }

        setStatus('loading')

        getJobs()
            .then((data) => {
                if (!cancelled) {
                    setJobs(data)
                    setStatus('ready')
                }
            })
            .catch(() => {
                if (!cancelled) setStatus('error')
            })

        return () => {
            cancelled = true
        }
    }, [])

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesQuery =
                activeQuery.trim().length === 0 ||
                job.title.toLowerCase().includes(activeQuery.trim().toLowerCase())
            const matchesType = typeFilter === 'all' || job.type === typeFilter
            const matchesDept = deptFilter === 'all' || job.department === deptFilter
            return matchesQuery && matchesType && matchesDept
        })
    }, [jobs, activeQuery, typeFilter, deptFilter])

    const retry = () => {
        setStatus('loading')
        getJobs()
            .then((data) => {
                setJobs(data)
                setStatus('ready')
            })
            .catch(() => setStatus('error'))
    }

    return {
        jobs: filteredJobs,
        totalCount: jobs.length,
        status,
        retry,
        query,
        setQuery,
        typeFilter,
        setTypeFilter,
        deptFilter,
        setDeptFilter,
    }
}