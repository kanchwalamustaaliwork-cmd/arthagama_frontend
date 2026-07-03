export default function SkeletonCard() {
    return (
        <div className="skeleton-card rounded-2xl p-6">
            <div className="skeleton-shimmer mb-4 h-10 w-10 rounded-full" />
            <div className="skeleton-shimmer mb-2 h-4 w-3/4 rounded" />
            <div className="skeleton-shimmer mb-4 h-3 w-1/2 rounded" />
            <div className="skeleton-shimmer h-3 w-full rounded" />
            <style>{`
        .skeleton-card {
          background: rgba(184, 206, 194, 0.5);
          border: 1px solid rgba(184, 206, 194, 0.6);
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, rgba(36,65,71,0.08) 25%, rgba(36,65,71,0.16) 37%, rgba(36,65,71,0.08) 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </div>
    )
}