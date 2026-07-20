'use client'

import { useState } from 'react'
import type { NewsArticle } from '@/src/types/news'
import { formatTime } from '@/src/utils/formatTime'
import Link from 'next/link'
import Image from 'next/image'
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/Tooltip'

interface NewsMarqueeCardProps {
    article: NewsArticle
}

export default function NewsMarqueeCard({ article }: NewsMarqueeCardProps) {
    const [imageError, setImageError] = useState(false)
    const displaySummary = article.summary || 'No summary available.'
    const displayTime = formatTime(article.published_at, article.scraped_at)
    const showImage = Boolean(article.image_url) && !imageError

    return (
        <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className="marquee-news-card"
        >
            <div className="marquee-news-image-wrapper">
                {showImage ? (
                    <Image
                        src={article.image_url as string}
                        alt={article.title}
                        fill
                        sizes="320px"
                        className="marquee-news-image"
                        draggable={false}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="news-image-fallback">
                        {article.source || 'ARTHAGAMA'}
                    </div>
                )}
            </div>

            <div className="marquee-news-content">
                <div className="marquee-news-meta">
                    <span className="news-badge">{article.source}</span>
                    <span>•</span>
                    <span>{displayTime}</span>
                </div>

                <h4 className="marquee-news-title">{article.title}</h4>

                <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                        <p className="marquee-news-summary">{displaySummary}</p>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                        <p style={{ maxWidth: '280px', margin: 0 }}>{displaySummary}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </Link>
    )
}