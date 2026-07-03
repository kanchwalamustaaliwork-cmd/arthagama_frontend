import { useEffect, useMemo, useState } from 'react'
import type { JobListing, JobType, Department } from '../types/careers'
import { fetchJobs } from '../services/careersApi'

export function useJobs() {
    const [jobs, setJobs] = useState<JobListing[]>([])
    const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')
    const [query, setQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all')
    const [deptFilter, setDeptFilter] = useState<Department | 'all'>('all')

    useEffect(() => {
        let cancelled = false
        setStatus('loading')

        fetchJobs()
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
                query.trim().length === 0 ||
                job.title.toLowerCase().includes(query.trim().toLowerCase())
            const matchesType = typeFilter === 'all' || job.type === typeFilter
            const matchesDept = deptFilter === 'all' || job.department === deptFilter
            return matchesQuery && matchesType && matchesDept
        })
    }, [jobs, query, typeFilter, deptFilter])

    const retry = () => {
        setStatus('loading')
        fetchJobs()
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