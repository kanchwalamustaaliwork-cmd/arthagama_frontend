export default function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="stat-card min-w-0 rounded-lg px-1.5 py-1.5 text-center sm:rounded-xl sm:px-3 sm:py-3 md:px-4 md:py-4">
            <div className="mb-0.5 truncate text-[6.5px] uppercase tracking-[0.08em] text-[#B8CEC2]/60 sm:mb-1 sm:text-[8px] sm:tracking-[0.12em] md:text-[9px] md:tracking-[0.15em]">
                {label}
            </div>
            <div className="truncate text-[10px] font-medium leading-tight text-[#EAF1EC] transition-all duration-500 sm:text-xs md:text-sm">
                {value}
            </div>
            <style>{`
        .stat-card {
          background: rgba(184, 206, 194, 0.06);
          border: 1px solid rgba(184, 206, 194, 0.12);
        }
      `}</style>
        </div>
    )
}