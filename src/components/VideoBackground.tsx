import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

const HLS_URL = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

interface VideoBackgroundProps {
  overlayOpacity?: string // e.g. 'bg-black/40'
  bottomFade?: boolean
  topFade?: boolean
  flipped?: boolean
}

export default function VideoBackground({
  overlayOpacity = 'bg-black/30',
  bottomFade = true,
  topFade = false,
  flipped = false,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(HLS_URL)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_URL
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute left-1/2 top-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        style={flipped ? { transform: 'translate(-50%, -50%) scaleY(-1)' } : undefined}
      />
      {/* Dark overlay */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      {/* Bottom fade */}
      {bottomFade && (
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      )}
      {/* Top fade */}
      {topFade && (
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg to-transparent" />
      )}
    </div>
  )
}
