export type JobType = 'internship' | 'full-time'
export type Department = 'engineering' | 'finance' | 'research' | 'operations'

export interface JobListing {
    id: string
    title: string
    type: JobType
    department: Department
    location: string
    postedDaysAgo: number
    summary: string
    responsibilities: string[]
    requirements: string[]
}

export interface ApplicationPayload {
    jobId: string
    name: string
    email: string
    phone: string
    experienceYears: string
    expectedSalary: string
    resumeLink: string
    note: string
}

export type Point = { title: string; body: string }

export interface ApplicationFormProps {
    jobId: string
}

export interface JobFiltersProps {
    query: string
    onQueryChange: (v: string) => void
    typeFilter: JobType | 'all'
    onTypeChange: (v: JobType | 'all') => void
    deptFilter: Department | 'all'
    onDeptChange: (v: Department | 'all') => void
}

export interface JobListProps {
    jobs: JobListing[]
    status: 'loading' | 'error' | 'ready'
    onRetry: () => void
    onSelectJob: (job: JobListing) => void
}