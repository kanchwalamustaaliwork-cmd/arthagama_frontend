import { getJobs } from '@/src/lib/cms/careers'
import CareersPageView from '@/src/views/CareersPage'

export default async function CareersPage() {
  const initialJobs = await getJobs()
  return <CareersPageView initialJobs={initialJobs} />
}
