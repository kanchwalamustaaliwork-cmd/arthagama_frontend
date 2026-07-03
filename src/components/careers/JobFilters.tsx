import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import type { JobType, Department, JobFiltersProps } from '../../types/careers'


const TYPE_OPTIONS: { label: string; value: JobType | 'all' }[] = [
    { label: 'All Roles', value: 'all' },
    { label: 'Full-time', value: 'full-time' },
    { label: 'Internship', value: 'internship' },
]

const DEPT_OPTIONS: { label: string; value: Department | 'all' }[] = [
    { label: 'All Departments', value: 'all' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Finance', value: 'finance' },
    { label: 'Research', value: 'research' },
    { label: 'Operations', value: 'operations' },
]

function Chip({
    label,
    active,
    onClick,
}: {
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <motion.button
            onClick={onClick}
            // Scale + Fade on selection change
            animate={{ scale: active ? 1.04 : 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className={`chip whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors duration-300 ${active ? 'chip-active' : 'chip-inactive'
                }`}
        >
            {label}
        </motion.button>
    )
}

export default function JobFilters({
    query,
    onQueryChange,
    typeFilter,
    onTypeChange,
    deptFilter,
    onDeptChange,
}: JobFiltersProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="search-field relative flex items-center rounded-full px-5 py-3">
                <Search className="h-4 w-4 flex-shrink-0 text-[#244147]/60" />
                <input
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search open roles..."
                    className="ml-3 w-full bg-transparent text-sm text-[#1B3236] outline-none placeholder:text-[#244147]/45"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {TYPE_OPTIONS.map((opt) => (
                    <Chip key={opt.value} label={opt.label} active={typeFilter === opt.value} onClick={() => onTypeChange(opt.value)} />
                ))}
                <div className="mx-1 hidden h-6 w-px self-center bg-[#B8CEC2]/25 sm:block" />
                {DEPT_OPTIONS.map((opt) => (
                    <Chip key={opt.value} label={opt.label} active={deptFilter === opt.value} onClick={() => onDeptChange(opt.value)} />
                ))}
            </div>

            <style>{`
        .search-field {
          background: rgba(184, 206, 194, 0.9);
          border: 1px solid rgba(184, 206, 194, 1);
          box-shadow: 0 2px 14px rgba(18, 33, 36, 0.2);
        }
        .chip-active {
          background: #244147;
          color: #EAF1EC;
        }
        .chip-inactive {
          background: rgba(184, 206, 194, 0.15);
          color: #EAF1EC;
          border: 1px solid rgba(184, 206, 194, 0.3);
        }
      `}</style>
        </div>
    )
}