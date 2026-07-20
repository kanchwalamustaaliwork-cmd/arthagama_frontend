import SkeletonRow from "./SkeletonRow"
export default function LiveNewsSkeleton() {
    return (
        <div className="live-news-container">
            <style>{`
                .live-news-container {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .news-marquee-row {
                    overflow: hidden;
                    position: relative;
                    padding: 6px 0;
                }
                .news-marquee-track {
                    display: flex;
                    gap: 16px;
                    width: max-content;
                    align-items: stretch;
                }
                .marquee-news-card {
                    flex: 0 0 320px;
                    width: 320px;
                    height: 260px;
                    display: flex;
                    flex-direction: column;
                    border-radius: 12px;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.02);
                }
                .marquee-news-image-wrapper {
                    width: 100%;
                    height: 150px;
                    flex: none;
                    position: relative;
                    overflow: hidden;
                }
                .marquee-news-content {
                    padding: 12px 14px 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    flex: 1;
                    min-height: 0;
                }
            `}</style>

            <SkeletonRow />
            <SkeletonRow />
        </div>
    )
}