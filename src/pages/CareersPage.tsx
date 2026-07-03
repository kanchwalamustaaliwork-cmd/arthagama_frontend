import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { JobListing } from '../types/careers'
import { useJobs } from '../hooks/useJobs'
import CareersHero from '../components/careers/CareersHero'
import JobFilters from '../components/careers/JobFilters'
import JobList from '../components/careers/JobList'
import JobDetailDrawer from '../components/careers/JobDetailDrawer'

export default function CareersPage() {
  const {
    jobs, totalCount, status, retry,
    query, setQuery, typeFilter, setTypeFilter, deptFilter, setDeptFilter,
  } = useJobs()

  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)

  return (
    <div className="relative min-h-screen w-full pb-24">
      <CareersHero />

      <section className="cv-section relative px-5 py-8 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-col gap-2 sm:mb-10">
            <h2 className="text-2xl font-body font-light text-[#EAF1EC] sm:text-3xl">
              Open <em className="font-display italic text-[#EAF1EC]">roles</em>
            </h2>
            {status === 'ready' && (
              <p className="text-xs text-[#DCE7E1]/70">
                {jobs.length} of {totalCount} role{totalCount === 1 ? '' : 's'} shown
              </p>
            )}
          </div>

          <div className="mb-8">
            <JobFilters
              query={query}
              onQueryChange={setQuery}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              deptFilter={deptFilter}
              onDeptChange={setDeptFilter}
            />
          </div>

          <JobList jobs={jobs} status={status} onRetry={retry} onSelectJob={setSelectedJob} />
        </div>
      </section>

      <AnimatePresence>
        {selectedJob && (
          <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}