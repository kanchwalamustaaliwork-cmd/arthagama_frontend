import { fetchCMS } from './client'
import type { CMSJob } from '@/src/types/cms'
import type { JobListing, ApplicationPayload } from '@/src/types/careers'
import { STATIC_JOBS } from '@/src/data/jobs'

export async function getJobs(): Promise<JobListing[]> {
  const cmsJobs = await fetchCMS<CMSJob[]>('/jobs', {
    tags: ['jobs'],
    revalidate: 1800,
  })

  if (!cmsJobs || cmsJobs.length === 0) {
    return STATIC_JOBS
  }

  return cmsJobs.map((job) => ({
    id: job.id,
    title: job.title,
    type: job.type as JobListing['type'],
    department: job.department as JobListing['department'],
    location: job.location,
    postedDaysAgo: job.postedAt
      ? Math.floor((Date.now() - new Date(job.postedAt).getTime()) / 86_400_000)
      : 0,
    summary: job.summary,
    responsibilities: job.responsibilities ?? [],
    requirements: job.requirements ?? [],
  }))
}

export async function submitApplication(_payload: ApplicationPayload): Promise<{ success: true }> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}
