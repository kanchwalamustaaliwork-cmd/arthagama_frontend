import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Hls from 'hls.js'
import gsap from 'gsap'

const HLS_URL = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
const MARQUEE_TEXT = 'BUILDING THE FUTURE • '

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
]

const ACCOUNT_LINKS = [
  { label: 'Log In', to: '/login' },
  { label: 'Sign Up', to: '/signup' },
]

const SOCIALS = [
  { label: 'Twitter', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
]

export default function FooterSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [emailHovered, setEmailHovered] = useState(false)

  // HLS Video (flipped)
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

  // GSAP Marquee
  useEffect(() => {
    if (!marqueeRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <footer id="contact" className="bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      {/* Background Video (flipped vertically) */}
      <div className="relative h-[50vh] overflow-hidden mb-12 md:mb-20">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '100%',
            height: '140%',
            objectFit: 'cover',
            objectPosition: 'center top',
            transform: 'translateX(-50%) scaleY(-1)',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Marquee */}
      <div className="overflow-hidden mb-16 md:mb-20">
        <div className="flex whitespace-nowrap">
          <div ref={marqueeRef} className="flex whitespace-nowrap">
            {Array(20).fill(MARQUEE_TEXT).map((text, i) => (
              <span
                key={i}
                className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/10 tracking-tight"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">

        {/* CTA */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-6">Get in touch</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary mb-8 leading-[0.9]">
            Let's work together
          </h2>

          {/* Email Button */}
          <div
            className="inline-block relative"
            onMouseEnter={() => setEmailHovered(true)}
            onMouseLeave={() => setEmailHovered(false)}
          >
            <span
              className="absolute inset-[-2px] rounded-full accent-gradient transition-opacity duration-300 pointer-events-none"
              style={{ opacity: emailHovered ? 1 : 0 }}
            />
            <a
              href="mailto:hello@arthagama.com"
              className="relative z-10 flex items-center gap-3 text-sm text-text-primary rounded-full px-8 py-4 border border-stroke bg-bg transition-all duration-300 hover:scale-105"
            >
              <span>hello@arthagama.com</span>
              <span className="text-muted">↗</span>
            </a>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12 pb-12 border-b border-stroke">
          {/* Pages */}
          <div>
            <p className="text-xs text-muted uppercase tracking-[0.25em] mb-4">Pages</p>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-primary/70 hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs text-muted uppercase tracking-[0.25em] mb-4">Account</p>
            <ul className="flex flex-col gap-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-primary/70 hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs text-muted uppercase tracking-[0.25em] mb-4">Social</p>
            <ul className="flex flex-col gap-2.5">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-sm text-text-primary/70 hover:text-text-primary transition-colors duration-200"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability */}
          <div>
            <p className="text-xs text-muted uppercase tracking-[0.25em] mb-4">Status</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-sm text-muted">Available</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/40">
            © 2026 Arthagama. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-xs text-muted uppercase tracking-[0.2em] hover:text-text-primary transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}