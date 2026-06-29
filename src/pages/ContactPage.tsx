import VideoBackground from '../components/VideoBackground'

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg">
      <VideoBackground overlayOpacity="bg-black/40" bottomFade topFade />
      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary">
          Contact Us
        </h1>
      </div>
    </div>
  )
}
