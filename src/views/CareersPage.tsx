"use client"

import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { JobListing } from '../types/careers'
import type { CMSCareersPage } from '../types/cms'
import { useJobs } from '../hooks/useJobs'
import CareersHero from '../components/careers/CareersHero'
import CareersIntro from '../components/careers/CareersIntro'
import CareersBenefits from '../components/careers/CareersBenefits'
import HiringProcess from '../components/careers/HiringProcess'
import CareersCtaSection from '../components/careers/CareersCtaSection'
import JobFilters from '../components/careers/JobFilters'
import JobList from '../components/careers/JobList'
import JobDetailDrawer from '../components/careers/JobDetailDrawer'

interface CareersPageViewProps {
  initialJobs?: JobListing[]
  cmsCareers?: CMSCareersPage | null
}

export default function CareersPage({ initialJobs, cmsCareers }: CareersPageViewProps) {
  const {
    jobs, totalCount, status, retry,
    query, setQuery, typeFilter, setTypeFilter, deptFilter, setDeptFilter,
  } = useJobs(initialJobs)

  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)

  const openHeading = cmsCareers?.openRolesHeading ?? 'Open roles'
  const teamSubtext = cmsCareers?.teamDescription ?? 'Join a team that ships real systems, not slideware.'

  return (
    <div className="relative min-h-screen w-full pb-24">
      <CareersHero
        heading={cmsCareers?.careersHero?.heading}
        subtitle={cmsCareers?.careersHero?.subtitle}
        culturePoints={cmsCareers?.culturePoints}
        typewriterRoles={cmsCareers?.typewriterRoles}
      />

      <CareersIntro
        heading={cmsCareers?.careersIntro?.heading}
        body={cmsCareers?.careersIntro?.body}
      />

      <CareersBenefits
        heading={cmsCareers?.careersBenefits?.heading}
        items={cmsCareers?.careersBenefits?.items}
      />

      <HiringProcess
        heading={cmsCareers?.hiringProcess?.heading}
        steps={cmsCareers?.hiringProcess?.steps}
      />

      <section className="cv-section relative px-5 py-8 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-col gap-2 sm:mb-10">
            <h2 className="text-2xl font-body font-light text-[#EAF1EC] sm:text-3xl">
              {openHeading}
            </h2>
            <p className="text-sm text-[#DCE7E1]/70">{teamSubtext}</p>
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

          <JobList
            jobs={jobs}
            status={status}
            onRetry={retry}
            onSelectJob={setSelectedJob}
            emptyState={cmsCareers?.careersEmptyState}
          />
        </div>
      </section>

      <CareersCtaSection cmsCta={cmsCareers?.careersCta} />

      <AnimatePresence>
        {selectedJob && (
          <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}