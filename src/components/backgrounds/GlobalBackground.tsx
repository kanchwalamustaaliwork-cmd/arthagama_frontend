"use client"

import { useRef } from 'react'

const VIDEO_URL =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4'

interface GlobalBackgroundProps {
    videoUrl?: string | null
}

export default function GlobalBackground({ videoUrl }: GlobalBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const activeVideoUrl = videoUrl || VIDEO_URL

    return (
        <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src={activeVideoUrl} type="video/mp4" />
            </video>

            {/* Teal tint over video to lock the palette */}
            <div className="absolute inset-0 bg-[hsl(var(--teal-deep)/0.55)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--teal-deep)/0.35)] via-transparent to-[hsl(var(--teal-deep)/0.6)]" />
        </div>
    )
}