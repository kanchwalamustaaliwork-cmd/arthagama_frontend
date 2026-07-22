import Chip from './Chip'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import type { JobFiltersProps } from '../../types/careers'
import { TYPE_OPTIONS, DEPT_OPTIONS } from '../../data/jobs'

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
            <SearchBar
                value={query}
                onChange={onQueryChange}
                placeholder="Search open roles..."
                variant="pill"
                iconColor="rgba(36, 65, 71, 0.6)"
                iconSize={16}
                containerStyle={{
                    background: 'rgba(184, 206, 194, 0.9)',
                    border: '1px solid rgba(184, 206, 194, 1)',
                    boxShadow: '0 2px 14px rgba(18, 33, 36, 0.2)',
                }}
                inputStyle={{
                    background: 'transparent',
                    border: 'none',
                    color: '#1B3236',
                    fontSize: '14px',
                    outline: 'none',
                }}
            />

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