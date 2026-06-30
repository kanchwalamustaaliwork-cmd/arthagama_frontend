import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'


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
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [emailHovered, setEmailHovered] = useState(false)

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
    // Wrapper creates the "floating" inset on md+ screens; on mobile it
    // collapses to zero so the footer sits flush, full-bleed.
    <div className="md:px-4 lg:px-8 md:pt-6 lg:pt-10 md:pb-6 lg:pb-10">
      <footer
        id="contact"
        className="bg-[#244147] pt-14 sm:pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden
               md:rounded-[2rem] lg:rounded-[2.5rem]
               md:border md:border-[#B8CEC2]/15
               md:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.55)]"
      >

        {/* Main Footer Content */}
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">

          {/* CTA */}
          <div className="text-center mb-14 sm:mb-16 md:mb-20">
            <p className="text-[11px] sm:text-xs text-[#B8CEC2]/70 uppercase tracking-[0.3em] mb-5 sm:mb-6">
              Get in touch
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display italic text-[#B8CEC2] mb-7 sm:mb-8 leading-[0.95] sm:leading-[0.9]">
              Let's work together
            </h2>

            {/* Email Button */}
            <div
              className="inline-block relative"
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
            >
              <span
                className="absolute inset-[-2px] rounded-full bg-[#B8CEC2] blur-[10px] transition-opacity duration-300 pointer-events-none"
                style={{ opacity: emailHovered ? 0.35 : 0 }}
              />
              <a
                href="mailto:hello@arthagama.com"
                className="relative z-10 flex items-center gap-3 text-xs sm:text-sm text-[#B8CEC2] rounded-full px-6 sm:px-8 py-3.5 sm:py-4 border border-[#B8CEC2]/20 bg-[#244147] transition-all duration-300 hover:scale-105"
              >
                <span>hello@arthagama.com</span>
                <span className="text-[#B8CEC2]/60">↗</span>
              </a>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 sm:gap-8 mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-[#B8CEC2]/15">
            {/* Pages */}
            <div>
              <p className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.25em] mb-4">Pages</p>
              <ul className="flex flex-col gap-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#B8CEC2]/70 hover:text-[#B8CEC2] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <p className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.25em] mb-4">Account</p>
              <ul className="flex flex-col gap-2.5">
                {ACCOUNT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#B8CEC2]/70 hover:text-[#B8CEC2] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <p className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.25em] mb-4">Social</p>
              <ul className="flex flex-col gap-2.5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="text-sm text-[#B8CEC2]/70 hover:text-[#B8CEC2] transition-colors duration-200"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div>
              <p className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.25em] mb-4">Status</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8CEC2] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8CEC2]" />
                </span>
                <span className="text-sm text-[#B8CEC2]/60">Available</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#B8CEC2]/40">
              © 2026 Arthagama. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.2em] hover:text-[#B8CEC2] transition-colors duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div >
      </footer >
    </div >
  )
}