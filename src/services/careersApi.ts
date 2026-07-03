import type { JobListing, ApplicationPayload } from '../types/careers'
import { STATIC_JOBS } from '../data/jobs'

// ── Swap point ────────────────────────────────────────────────────────────
// When a real backend exists, replace the body of fetchJobs / submitApplication
// with actual `fetch(...)` calls. Everything that consumes these functions
// (useJobs hook, ApplicationForm) already handles loading/error states, so
// no calling code needs to change.
//
// const API_BASE = import.meta.env.VITE_CAREERS_API_URL

const SIMULATED_DELAY_MS = 500

export async function fetchJobs(): Promise<JobListing[]> {
    // Real implementation, once available:
    // const res = await fetch(`${API_BASE}/jobs`)
    // if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`)
    // return res.json()

    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
    return STATIC_JOBS
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