// import { useEffect, useRef, useState } from 'react'
// import Hls from 'hls.js'
// import gsap from 'gsap'

// const HLS_URL = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
// const ROLES = ['Creative', 'Fullstack', 'Founder', 'Scholar']

// export default function HeroSection() {
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const sectionRef = useRef<HTMLElement>(null)
//   const [roleIndex, setRoleIndex] = useState(0)

//   // HLS Video
//   useEffect(() => {
//     const video = videoRef.current
//     if (!video) return

//     if (Hls.isSupported()) {
//       const hls = new Hls()
//       hls.loadSource(HLS_URL)
//       hls.attachMedia(video)
//       return () => hls.destroy()
//     } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
//       video.src = HLS_URL
//     }
//   }, [])

//   // Role cycling every 2s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRoleIndex(i => (i + 1) % ROLES.length)
//     }, 2000)
//     return () => clearInterval(interval)
//   }, [])

//   // GSAP entrance
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ ease: 'power3.out' })

//       tl.fromTo(
//         '.name-reveal',
//         { opacity: 0, y: 50 },
//         { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
//       )
//       tl.fromTo(
//         '.blur-in',
//         { opacity: 0, filter: 'blur(10px)', y: 20 },
//         { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1, delay: 0.3 },
//         '<'
//       )
//     }, sectionRef)

//     return () => ctx.revert()
//   }, [])

//   return (
//     <section
//       ref={sectionRef}
//       id="home"
//       className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
//     >
//       {/* Background HLS Video */}
//       <div className="absolute inset-0 overflow-hidden">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute left-1/2 top-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
//         />
//         {/* Dark overlay */}
//         <div className="absolute inset-0 bg-black/20" />
//         {/* Bottom fade */}
//         <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
//       </div>

//       {/* Hero Content */}
//       <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
//         {/* Eyebrow */}
//         <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
//           COLLECTION '26
//         </p>

//         {/* Name */}
//         <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
//           Michael Smith
//         </h1>

//         {/* Role line */}
//         <p className="blur-in text-sm md:text-base text-muted mb-3">
//           A{' '}
//           <span
//             key={roleIndex}
//             className="font-display italic text-text-primary inline-block animate-[role-fade-in_0.4s_ease-out]"
//           >
//             {ROLES[roleIndex]}
//           </span>
//           {' '}lives in Chicago.
//         </p>

//         {/* Description */}
//         <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12">
//           Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
//         </p>

//         {/* CTA Buttons */}
//         <div className="blur-in inline-flex gap-4 flex-wrap justify-center">
//           <GradientBorderButton
//             variant="solid"
//             href="#work"
//           >
//             See Works
//           </GradientBorderButton>
//           <GradientBorderButton
//             variant="outline"
//             href="mailto:hello@michaelsmith.com"
//           >
//             Reach out...
//           </GradientBorderButton>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
//         <span className="text-xs text-muted uppercase tracking-[0.2em]">SCROLL</span>
//         <div className="relative w-px h-10 bg-stroke overflow-hidden">
//           <div className="absolute inset-x-0 top-0 w-full h-1/3 accent-gradient animate-[scroll-down_1.5s_ease-in-out_infinite]" />
//         </div>
//       </div>
//     </section>
//   )
// }

// interface GradientBorderButtonProps {
//   variant: 'solid' | 'outline'
//   href: string
//   children: React.ReactNode
// }

// function GradientBorderButton({ variant, href, children }: GradientBorderButtonProps) {
//   const [hovered, setHovered] = useState(false)

//   const baseClasses = 'relative rounded-full text-sm px-7 py-3.5 transition-all duration-300 hover:scale-105 font-body font-medium'

//   const variantClasses =
//     variant === 'solid'
//       ? `bg-text-primary text-bg ${hovered ? 'bg-bg text-text-primary' : ''}`
//       : `border-2 border-stroke bg-bg text-text-primary ${hovered ? 'border-transparent' : ''}`

//   return (
//     <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
//       {/* Gradient border ring */}
//       <span
//         className="absolute rounded-full accent-gradient transition-opacity duration-300 pointer-events-none"
//         style={{
//           inset: '-2px',
//           opacity: hovered ? 1 : 0,
//           zIndex: 0,
//         }}
//       />
//       <a
//         href={href}
//         className={`relative z-10 block ${baseClasses} ${variantClasses}`}
//         style={
//           variant === 'solid' && hovered
//             ? { backgroundColor: 'hsl(var(--bg))', color: 'hsl(var(--text))' }
//             : variant === 'solid'
//             ? { backgroundColor: 'hsl(var(--text))', color: 'hsl(var(--bg))' }
//             : {}
//         }
//       >
//         {children}
//       </a>
//     </div>
//   )
// }


import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import gsap from 'gsap'

const HLS_URL = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

// Cycling descriptors drawn from the company's core philosophy
const PILLARS = ['Precision', 'Discipline', 'Innovation', 'Intelligence']

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [pillarIndex, setPillarIndex] = useState(0)

  // HLS Video
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

  // Pillar cycling every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setPillarIndex(i => (i + 1) % PILLARS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // GSAP entrance
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
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background HLS Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
        {/* Dark overlay — heavier than before to keep financial tone serious */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">

        {/* Eyebrow — firm location + category */}
        <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
          Mumbai &nbsp;·&nbsp; Algorithmic Trading &nbsp;·&nbsp; Systematic Strategies
        </p>

        {/* Brand Name */}
        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          Arthagama
        </h1>

        {/* Sanskrit etymology line */}
        <p className="blur-in text-xs text-muted uppercase tracking-[0.25em] mb-6">
          Artha &nbsp;·&nbsp; Wealth &nbsp;&nbsp;+&nbsp;&nbsp; Āgama &nbsp;·&nbsp; Inflow
        </p>

        {/* Cycling philosophy pillar */}
        <p className="blur-in text-sm md:text-base text-muted mb-3">
          Trading built on{' '}
          <span
            key={pillarIndex}
            className="font-display italic text-text-primary inline-block animate-[role-fade-in_0.4s_ease-out]"
          >
            {PILLARS[pillarIndex]}
          </span>
          .
        </p>

        {/* Core description */}
        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12">
          Harnessing quantitative analysis, machine learning, and disciplined execution
          to generate consistent, data-driven returns across all market conditions.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in inline-flex gap-4 flex-wrap justify-center">
          <GradientBorderButton
            variant="solid"
            href="#strategies"
          >
            Our Strategies
          </GradientBorderButton>
          <GradientBorderButton
            variant="outline"
            href="#contact"
          >
            Get in Touch
          </GradientBorderButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-xs text-muted uppercase tracking-[0.2em]">SCROLL</span>
        <div className="relative w-px h-10 bg-stroke overflow-hidden">
          <div className="absolute inset-x-0 top-0 w-full h-1/3 accent-gradient animate-[scroll-down_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  )
}

interface GradientBorderButtonProps {
  variant: 'solid' | 'outline'
  href: string
  children: React.ReactNode
}

function GradientBorderButton({ variant, href, children }: GradientBorderButtonProps) {
  const [hovered, setHovered] = useState(false)

  const baseClasses =
    'relative rounded-full text-sm px-7 py-3.5 transition-all duration-300 hover:scale-105 font-body font-medium'

  const variantClasses =
    variant === 'solid'
      ? `bg-text-primary text-bg ${hovered ? 'bg-bg text-text-primary' : ''}`
      : `border-2 border-stroke bg-bg text-text-primary ${hovered ? 'border-transparent' : ''}`

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient border ring */}
      <span
        className="absolute rounded-full accent-gradient transition-opacity duration-300 pointer-events-none"
        style={{
          inset: '-2px',
          opacity: hovered ? 1 : 0,
          zIndex: 0,
        }}
      />
      <a
        href={href}
        className={`relative z-10 block ${baseClasses} ${variantClasses}`}
        style={
          variant === 'solid' && hovered
            ? { backgroundColor: 'hsl(var(--bg))', color: 'hsl(var(--text))' }
            : variant === 'solid'
            ? { backgroundColor: 'hsl(var(--text))', color: 'hsl(var(--bg))' }
            : {}
        }
      >
        {children}
      </a>
    </div>
  )
}