"use client"

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Link from 'next/link'
import { SOCIALS } from '../../data/footer-links'
import BrandPanel from '../ui/BrandPanel'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ ease: 'power3.out' })
      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      )
      tl.fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1, delay: 0.3 },
        '<'
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* ---------------- Foreground ---------------- */}
      <div className="relative z-10 flex min-h-screen w-full flex-col-reverse lg:flex-row">
        {/* ===================== LEFT PANEL — themed intro text ===================== */}
        <div className="relative w-full lg:w-[48%]">
          <div className="liquid-glass-strong absolute inset-4 rounded-3xl lg:inset-6" />

          <div className="relative z-10 flex h-full min-h-screen flex-col justify-center px-6 py-8 lg:px-12 lg:py-10">
            <h1 className="blur-in mb-6 max-w-lg font-body text-3xl font-light leading-tight text-[hsl(var(--mint-soft))] sm:text-4xl lg:text-5xl">
              <span className="font-semibold">Precision</span> built{" "}
              <em className="font-display font-semibold text-[hsl(var(--mint-soft))]">
                systems
              </em>{" "}
              for modern markets.
            </h1>

            <p className="blur-in mb-10 max-w-md text-sm leading-relaxed text-[hsl(var(--mint)/0.75)] md:text-base">
              Harnessing quantitative analysis, machine learning, and disciplined
              execution to identify opportunities and generate sustainable returns
              across diverse market conditions.
            </p>

            <div className="blur-in flex items-center gap-3">
              <div className="liquid-glass flex items-center gap-4 rounded-full px-5 py-2.5">
                {SOCIALS.map((s) => {
                  const Icon = s.icon
                  return (
                    <Link
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.2em] hover:text-[#EAF1EC] transition-colors duration-200"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-1 flex-col items-center justify-center px-6 py-12 text-center lg:w-[52%] lg:px-12">
          <BrandPanel />
        </div>
      </div>

      {/* ---------------- Glass styles (scoped) ---------------- */}
      <style>{`
        .liquid-glass {
          background: rgba(184, 206, 194, 0.04);
          background-blend-mode: luminosity;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: none;
          box-shadow: inset 0 1px 1px rgba(184, 206, 194, 0.15);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1.4px;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(184, 206, 194, 0.45) 0%,
            rgba(184, 206, 194, 0.15) 20%,
            transparent 40%,
            transparent 60%,
            rgba(184, 206, 194, 0.15) 80%,
            rgba(184, 206, 194, 0.45) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .liquid-glass-strong {
          background: rgba(36, 65, 71, 0.18);
          background-blend-mode: luminosity;
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          border: none;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.15),
            inset 0 1px 1px rgba(184, 206, 194, 0.2);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass-strong::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1.4px;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(184, 206, 194, 0.5) 0%,
            rgba(184, 206, 194, 0.2) 20%,
            transparent 40%,
            transparent 60%,
            rgba(184, 206, 194, 0.2) 80%,
            rgba(184, 206, 194, 0.5) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </section>
  )
}