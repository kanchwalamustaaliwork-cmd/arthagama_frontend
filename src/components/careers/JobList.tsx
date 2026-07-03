import { motion } from 'framer-motion'
import { RefreshCcw, SearchX } from 'lucide-react'
import type { JobListProps } from '../../types/careers'
import JobCard from './JobCard'
import SkeletonCard from '../ui/SkeletonCard'


export default function JobList({ jobs, status, onRetry, onSelectJob }: JobListProps) {
    if (status === 'loading') {
        return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    if (status === 'error') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-state flex flex-col items-center gap-4 rounded-2xl p-10 text-center"
            >
                <p className="text-sm text-[#1B3236]">
                    Couldn't load open roles right now. Please try again.
                </p>
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 rounded-full bg-[#244147] px-5 py-2.5 text-xs font-medium text-[#EAF1EC] transition-transform hover:scale-105"
                >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Retry
                </button>
                <style>{`
          .error-state {
            background: rgba(184, 206, 194, 0.9);
            border: 1px solid rgba(184, 206, 194, 1);
          }
        `}</style>
            </motion.div>
        )
    }

    if (jobs.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-state flex flex-col items-center gap-3 rounded-2xl p-10 text-center"
            >
                <SearchX className="h-6 w-6 text-[#244147]/60" />
                <p className="text-sm text-[#1B3236]">No roles match your filters right now.</p>
                <style>{`
          .error-state {
            background: rgba(184, 206, 194, 0.9);
            border: 1px solid rgba(184, 206, 194, 1);
          }
        `}</style>
            </motion.div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} onSelect={() => onSelectJob(job)} />
            ))}
        </div>
    )
}