import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import {
  Sparkles,
  ArrowUpRight,
  LineChart,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6'
import TiltImage from '../ui/TiltImage'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4'

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
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen w-full overflow-hidden font-sans"
      style={
        {
          // Dark Teal #244147 -> hsl(193, 33%, 21%)
          // Mint     #B8CEC2 -> hsl(135, 14%, 78%)
          '--teal': '193 33% 21%',
          '--teal-deep': '193 38% 13%',
          '--mint': '135 14% 78%',
          '--mint-soft': '135 14% 88%',
          '--radius': '1rem',
        } as React.CSSProperties
      }
    >
      {/* ---------------- Background video ---------------- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        {/* Teal tint over video to lock the palette */}
        <div className="absolute inset-0 bg-[hsl(var(--teal-deep)/0.55)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--teal-deep)/0.35)] via-transparent to-[hsl(var(--teal-deep)/0.6)]" />
      </div>

      {/* ---------------- Foreground ---------------- */}
      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">
        {/* ===================== LEFT PANEL ===================== */}
        <div className="relative w-full lg:w-[52%]">
          <div className="liquid-glass-strong absolute inset-4 rounded-3xl lg:inset-6" />

          <div className="relative z-10 flex h-full min-h-screen flex-col px-6 py-8 lg:px-12 lg:py-10">
            {/* Hero center */}
            <div className="flex flex-1 flex-col items-center justify-center text-center">


              {/* ----------------------------------------------------------
               * Arthagama name image — now an interactive 3D-tilt element.
               * `name-reveal` is preserved on the wrapper so the original
               * GSAP entrance animation (opacity/y) still targets it; the
               * tilt logic itself is handled separately by TiltImage via
               * framer-motion springs, so the two animation systems don't
               * fight over the same transform.
               * -------------------------------------------------------- */}
              <div className="name-reveal mb-6">
                <TiltImage
                  src="public/assets/arthagama_name.png"
                  alt="Arthagama"
                  className="mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px]"
                />
              </div>

              <p className="blur-in mb-2 text-xs uppercase tracking-[0.25em] text-[hsl(var(--mint)/0.5)]">
                Artha &nbsp;·&nbsp; Wealth &nbsp;&nbsp;+&nbsp;&nbsp; Āgama &nbsp;·&nbsp; Inflow
              </p>

              <p className="blur-in mb-10 max-w-md text-sm leading-relaxed text-[hsl(var(--mint)/0.7)] md:text-base">
                Harnessing quantitative analysis, machine learning, and disciplined
                execution to identify opportunities and generate sustainable returns
                across diverse market conditions.
              </p>

              <button className="liquid-glass-strong blur-in mb-10 flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-medium text-[hsl(var(--mint-soft))] transition-transform hover:scale-105 active:scale-95">
                Our Strategies
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--mint-soft)/0.15)]">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </button>

              <div className="blur-in flex flex-wrap items-center justify-center gap-3">
                {['Precision', 'Discipline', 'Innovation'].map((label) => (
                  <span
                    key={label}
                    className="liquid-glass rounded-full px-4 py-2 text-xs text-[hsl(var(--mint-soft)/0.8)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom quote */}
            <div className="blur-in flex flex-col items-center text-center">
              <p className="mb-4 text-xs uppercase tracking-widest text-[hsl(var(--mint)/0.5)]">
                Trading Philosophy
              </p>
              <p className="mb-5 max-w-md text-xl leading-snug text-[hsl(var(--mint-soft))]">
                <span className="font-sans">Not predicting markets</span>{' '}
                <span className="font-serif italic text-[hsl(var(--mint-soft)/0.85)]">
                  — understanding probabilities.
                </span>
              </p>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[hsl(var(--mint)/0.3)]" />
                <span className="text-xs tracking-widest text-[hsl(var(--mint)/0.5)]">
                  ARTHAGAMA &nbsp;·&nbsp; FOUNDED 2026
                </span>
                <span className="h-px w-10 bg-[hsl(var(--mint)/0.3)]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT PANEL ===================== */}
        <div className="relative hidden w-[48%] flex-col px-8 py-10 lg:flex">
          {/* Top bar */}
          <div className="blur-in flex items-center justify-between">
            <div className="absolute right-8 top-8 z-20">
              <div className="liquid-glass flex items-center gap-4 rounded-full px-5 py-2.5">
                {[FaXTwitter, FaInstagram, FaFacebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-[hsl(var(--mint-soft))] transition-colors hover:text-[hsl(var(--mint-soft)/0.7)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}

                <ArrowRight className="h-4 w-4 text-[hsl(var(--mint-soft)/0.6)]" />
              </div>
            </div>
          </div>

          {/* Company snapshot card */}
          <div className="liquid-glass blur-in mt-20 w-64 rounded-3xl p-5">
            <h3 className="mb-1.5 text-sm font-medium text-[hsl(var(--mint-soft))]">
              Partnership &nbsp;·&nbsp; 2–10 employees
            </h3>
            <p className="text-xs leading-relaxed text-[hsl(var(--mint)/0.6)]">
              A Mumbai-based algorithmic trading firm researching, building, and
              deploying systematic strategies since 2026.
            </p>
          </div>

          {/* Bottom feature section */}
          <div className="liquid-glass-strong blur-in mt-auto rounded-[2.5rem] p-5">
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div className="liquid-glass rounded-3xl p-4">
                <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--mint-soft)/0.1)]">
                  <LineChart className="h-4 w-4 text-[hsl(var(--mint-soft))]" />
                </div>
                <h4 className="mb-1 text-sm font-medium text-[hsl(var(--mint-soft))]">
                  Quantitative Research
                </h4>
                <p className="text-xs leading-relaxed text-[hsl(var(--mint)/0.6)]">
                  Statistical models and market intelligence behind every strategy.
                </p>
              </div>
              <div className="liquid-glass rounded-3xl p-4">
                <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--mint-soft)/0.1)]">
                  <ShieldCheck className="h-4 w-4 text-[hsl(var(--mint-soft))]" />
                </div>
                <h4 className="mb-1 text-sm font-medium text-[hsl(var(--mint-soft))]">
                  Risk Management
                </h4>
                <p className="text-xs leading-relaxed text-[hsl(var(--mint)/0.6)]">
                  Robust frameworks built to remove emotion from execution.
                </p>
              </div>
            </div>

            <div className="liquid-glass flex items-center gap-4 rounded-3xl p-4">
              <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--mint-soft)/0.1)]">
                <Sparkles className="h-6 w-6 text-[hsl(var(--mint-soft)/0.7)]" />
              </div>
              <div className="flex-1">
                <h4 className="mb-1 text-sm font-medium text-[hsl(var(--mint-soft))]">
                  Machine Learning Automation
                </h4>
                <p className="text-xs leading-relaxed text-[hsl(var(--mint)/0.6)]">
                  Objective, data-driven decisions across market conditions.
                </p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--mint-soft)/0.15)] text-[hsl(var(--mint-soft))] transition-transform hover:scale-105 active:scale-95">
                +
              </button>
            </div>
          </div>
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