import type { JobListing, ApplicationPayload } from '../types/careers'
import { STATIC_JOBS } from '../data/jobs'

// ── CMS Integration ───────────────────────────────────────────────────────
// fetchJobs() now calls the Payload CMS public API for live job listings.
// Falls back to STATIC_JOBS if the CMS is unreachable (dev, cold start, etc.)
// useJobs hook and ApplicationForm are untouched — same return type.

const CMS_JOBS_URL =
    (process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001') + '/api/public/jobs'

export async function fetchJobs(): Promise<JobListing[]> {
    try {
        const res = await fetch(CMS_JOBS_URL, { cache: 'no-store' })
        if (!res.ok) throw new Error(`CMS returned ${res.status}`)

        // CMS response shape matches JobListing closely; map the differences:
        const cmsJobs: Array<{
            id: string
            title: string
            department: string
            type: string
            location: string
            summary: string
            responsibilities: string[]
            requirements: string[]
            postedAt: string | null
            order: number
        }> = await res.json()

        return cmsJobs.map((job) => ({
            id: job.id,
            title: job.title,
            type: job.type as JobListing['type'],
            department: job.department as JobListing['department'],
            location: job.location,
            // CMS uses postedAt; convert to postedDaysAgo for UI compatibility
            postedDaysAgo: job.postedAt
                ? Math.floor((Date.now() - new Date(job.postedAt).getTime()) / 86_400_000)
                : 0,
            summary: job.summary,
            responsibilities: job.responsibilities ?? [],
            requirements: job.requirements ?? [],
        }))
    } catch {
        // CMS unavailable — silently fall back to static data
        console.warn('[careersApi] CMS unavailable, using static jobs fallback')
        return STATIC_JOBS
    }
}

export async function submitApplication(payload: ApplicationPayload): Promise<{ success: true }> {
    // Real implementation, once available:
    // const res = await fetch(`${API_BASE}/applications`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // })
    // if (!res.ok) throw new Error(`Submission failed (${res.status})`)
    // return res.json()

    await new Promise((resolve) => setTimeout(resolve, 900))

    if (!payload.resumeLink.trim()) {
        throw new Error('A resume link is required.')
    }

    // Simulated persistence for now — logs to console until a real endpoint exists
    console.info('[careersApi] application submitted (stub):', payload)
    return { success: true }
}