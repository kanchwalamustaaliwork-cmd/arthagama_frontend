import { motion } from 'framer-motion'
import { ArrowUpRight, Briefcase, MapPin } from 'lucide-react'
import type { JobListing } from '../../types/careers'
import { easing } from '../../constans/animation'


const DEPT_LABEL: Record<JobListing['department'], string> = {
    engineering: 'Engineering',
    finance: 'Finance',
    research: 'Research',
    operations: 'Operations',
}

export default function JobCard({
    job,
    index,
    onSelect,
}: {
    job: JobListing
    index: number
    onSelect: () => void
}) {
    const isNew = job.postedDaysAgo <= 3

    return (
        <motion.div
            // Flip In — rotateX from 90deg to 0, feels distinct from the tilt/pop-in used elsewhere
            initial={{ opacity: 0, rotateX: 70, y: 30 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.6, ease: easing, delay: index * 0.06 }}
            viewport={{ once: true, margin: '-60px' }}
            style={{ transformPerspective: 800 }}
            whileHover={{ y: -4 }}
            onClick={onSelect}
            className="job-card group relative cursor-pointer overflow-hidden rounded-2xl p-5 sm:p-6"
        >
            {isNew && (
                <motion.span
                    className="absolute right-4 top-4 rounded-full bg-[#244147] px-2.5 py-1 text-[10px] font-medium text-[#EAF1EC]"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    New
                </motion.span>
            )}

            {/* Rotate Reveal icon */}
            <motion.div
                initial={{ rotate: -25, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: easing, delay: index * 0.06 + 0.15 }}
                viewport={{ once: true }}
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#244147]/10 text-[#244147]"
            >
                <Briefcase className="h-4.5 w-4.5" />
            </motion.div>

            <h3 className="pr-14 text-base font-semibold text-[#1B3236] sm:text-lg">{job.title}</h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#244147]/65">
                <span className="rounded-full bg-[#244147]/8 px-2.5 py-1">{DEPT_LABEL[job.department]}</span>
                <span className="rounded-full bg-[#244147]/8 px-2.5 py-1">
                    {job.type === 'internship' ? 'Internship' : 'Full-time'}
                </span>
                <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#244147]/75">{job.summary}</p>

            <span className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#244147]/80 transition-colors duration-300 group-hover:text-[#1B3236]">
                View role
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>

            <style>{`
        .job-card {
          background: rgba(184, 206, 194, 0.9);
          border: 1px solid rgba(184, 206, 194, 1);
          box-shadow: 0 2px 16px rgba(18, 33, 36, 0.22);
          transition: box-shadow 0.3s ease;
        }
        .job-card:hover {
          box-shadow: 0 20px 45px -15px rgba(18, 33, 36, 0.35);
        }
      `}</style>
        </motion.div>
    )
}