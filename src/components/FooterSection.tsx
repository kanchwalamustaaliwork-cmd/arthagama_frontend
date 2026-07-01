// import { useEffect, useRef, useState } from 'react'
// import { Link } from 'react-router-dom'
// import gsap from 'gsap'
// import { motion, type Transition } from 'framer-motion'

// const QUICK_LINKS = [
//   { label: 'Home', to: '/' },
//   { label: 'About Us', to: '/about' },
//   { label: 'Services', to: '/services' },
//   { label: 'Careers', to: '/careers' },
//   { label: 'Contact', to: '/contact' },
// ]

// const ACCOUNT_LINKS = [
//   { label: 'Log In', to: '/login' },
//   { label: 'Sign Up', to: '/signup' },
// ]

// const SOCIALS = [
//   { label: 'Twitter', href: '#' },
//   { label: 'LinkedIn', href: '#' },
//   { label: 'Instagram', href: '#' },
// ]

// const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
// const viewTransition: Transition = { duration: 1, ease: easing }
// const viewMotion = {
//   initial: { opacity: 0, y: 30 },
//   whileInView: { opacity: 1, y: 0 },
//   transition: viewTransition,
//   viewport: { once: true as const, margin: '-100px' },
// }

// const cascadeContainer = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
// }
// const cascadeItem = {
//   hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
//   visible: {
//     opacity: 1,
//     y: 0,
//     filter: 'blur(0px)',
//     transition: { duration: 0.6, ease: easing },
//   },
// }

// export default function FooterSection() {
//   const marqueeRef = useRef<HTMLDivElement>(null)
//   const [emailHovered, setEmailHovered] = useState(false)
//   const emailBtnRef = useRef<HTMLAnchorElement>(null)

//   // GSAP Marquee — scrolling brand strip above the CTA
//   useEffect(() => {
//     if (!marqueeRef.current) return
//     const ctx = gsap.context(() => {
//       gsap.to(marqueeRef.current, {
//         xPercent: -50,
//         duration: 28,
//         ease: 'none',
//         repeat: -1,
//       })
//     })
//     return () => ctx.revert()
//   }, [])

//   // Magnetic hover for the email button
//   const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     const el = emailBtnRef.current
//     if (!el) return
//     const rect = el.getBoundingClientRect()
//     const x = e.clientX - rect.left - rect.width / 2
//     const y = e.clientY - rect.top - rect.height / 2
//     gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power2.out' })
//   }
//   const handleMagneticLeave = () => {
//     const el = emailBtnRef.current
//     if (!el) return
//     gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
//   }

//   return (
//     <div className="md:px-4 lg:px-8 md:pt-6 lg:pt-10 md:pb-6 lg:pb-10">
//       <motion.footer
//         id="contact"
//         {...viewMotion}
//         className="footer-backing relative pt-14 sm:pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden
//                md:rounded-[2rem] lg:rounded-[2.5rem]"
//       >
//         {/* Marquee brand strip */}
//         <div className="relative mb-12 sm:mb-16 overflow-hidden border-y border-[#B8CEC2]/12 py-3">
//           <div ref={marqueeRef} className="flex w-max whitespace-nowrap">
//             {Array.from({ length: 16 }).map((_, i) => (
//               <span
//                 key={i}
//                 className="mx-6 font-display italic text-lg sm:text-xl text-[#B8CEC2]/25"
//               >
//                 Arthagama &nbsp;✦
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Main Footer Content */}
//         <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
//           {/* CTA */}
//           <motion.div className="text-center mb-14 sm:mb-16 md:mb-20" {...viewMotion}>
//             <p className="text-[11px] sm:text-xs text-[#B8CEC2]/75 uppercase tracking-[0.3em] mb-5 sm:mb-6">
//               Get in touch
//             </p>
//             <motion.h2
//               className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display italic text-[#EAF1EC] mb-7 sm:mb-8 leading-[0.95] sm:leading-[0.9]"
//               initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
//               whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
//               transition={{ duration: 1, ease: easing }}
//               viewport={{ once: true, margin: '-100px' }}
//             >
//               Let's work together
//             </motion.h2>

//             {/* Email Button — Magnetic Hover + Glow */}
//             <div
//               className="inline-block relative"
//               onMouseEnter={() => setEmailHovered(true)}
//               onMouseLeave={() => {
//                 setEmailHovered(false)
//                 handleMagneticLeave()
//               }}
//             >
//               <span
//                 className="absolute inset-[-2px] rounded-full bg-[#B8CEC2] blur-[14px] transition-opacity duration-300 pointer-events-none"
//                 style={{ opacity: emailHovered ? 0.4 : 0 }}
//               />
//               <motion.a
//                 ref={emailBtnRef}
//                 href="mailto:hello@arthagama.com"
//                 onMouseMove={handleMagneticMove}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.97 }}
//                 className="email-pill relative z-10 flex items-center gap-3 text-xs sm:text-sm text-[#EAF1EC] rounded-full px-6 sm:px-8 py-3.5 sm:py-4"
//               >
//                 <span>info@arthagama.com</span>
//                 <motion.span
//                   className="text-[#EAF1EC]/70"
//                   animate={{ x: emailHovered ? 3 : 0, y: emailHovered ? -3 : 0 }}
//                   transition={{ type: 'spring', stiffness: 300, damping: 15 }}
//                 >
//                   ↗
//                 </motion.span>
//               </motion.a>
//             </div>
//           </motion.div>

//           {/* Quick Links Grid — cascade reveal */}
//           <motion.div
//             className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 sm:gap-8 mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-[#B8CEC2]/15"
//             variants={cascadeContainer}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: '-100px' }}
//           >
//             {/* Pages */}
//             <motion.div variants={cascadeItem}>
//               <p className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.25em] mb-4">Pages</p>
//               <ul className="flex flex-col gap-2.5">
//                 {QUICK_LINKS.map((link) => (
//                   <li key={link.label}>
//                     <Link
//                       to={link.to}
//                       className="text-sm text-[#DCE7E1]/80 hover:text-[#EAF1EC] transition-colors duration-200 inline-flex items-center gap-1.5 group"
//                     >
//                       <span className="w-0 group-hover:w-2 h-px bg-[#EAF1EC] transition-all duration-200" />
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>

//             {/* Account */}
//             <motion.div variants={cascadeItem}>
//               <p className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.25em] mb-4">Account</p>
//               <ul className="flex flex-col gap-2.5">
//                 {ACCOUNT_LINKS.map((link) => (
//                   <li key={link.label}>
//                     <Link
//                       to={link.to}
//                       className="text-sm text-[#DCE7E1]/80 hover:text-[#EAF1EC] transition-colors duration-200 inline-flex items-center gap-1.5 group"
//                     >
//                       <span className="w-0 group-hover:w-2 h-px bg-[#EAF1EC] transition-all duration-200" />
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>

//             {/* Social */}
//             <motion.div variants={cascadeItem}>
//               <p className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.25em] mb-4">Social</p>
//               <ul className="flex flex-col gap-2.5">
//                 {SOCIALS.map((s) => (
//                   <li key={s.label}>
//                     <a
//                       href={s.href}
//                       className="text-sm text-[#DCE7E1]/80 hover:text-[#EAF1EC] transition-colors duration-200 inline-flex items-center gap-1.5 group"
//                     >
//                       <span className="w-0 group-hover:w-2 h-px bg-[#EAF1EC] transition-all duration-200" />
//                       {s.label}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>

//             {/* Availability */}
//             <motion.div variants={cascadeItem}>
//               <p className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.25em] mb-4">Status</p>
//               <div className="flex items-center gap-2">
//                 <span className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8CEC2] opacity-75" />
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8CEC2]" />
//                 </span>
//                 <span className="text-sm text-[#DCE7E1]/75">Available</span>
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Bottom Bar */}
//           <motion.div
//             className="flex flex-col sm:flex-row items-center justify-between gap-4"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.8, ease: easing, delay: 0.2 }}
//             viewport={{ once: true, margin: '-100px' }}
//           >
//             <p className="text-xs text-[#B8CEC2]/50">
//               © 2026 Arthagama. All rights reserved.
//             </p>
//             <div className="flex items-center gap-6">
//               {SOCIALS.map((s) => (
//                 <a
//                   key={s.label}
//                   href={s.href}
//                   className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.2em] hover:text-[#EAF1EC] transition-colors duration-200"
//                 >
//                   {s.label}
//                 </a>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//         <style>{`
//               .footer-backing {
//                 background: rgba(18, 33, 36, 0.68);
//                 backdrop-filter: blur(34px) saturate(1.1);
//                 -webkit-backdrop-filter: blur(34px) saturate(1.1);
//                 border: 1px solid rgba(184, 206, 194, 0.14);
//                 box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.55),
//                   inset 0 1px 1px rgba(184, 206, 194, 0.12);
//               }

//               .email-pill {
//                 background: rgba(184, 206, 194, 0.1);
//                 border: 1px solid rgba(184, 206, 194, 0.25);
//                 backdrop-filter: blur(8px);
//                 -webkit-backdrop-filter: blur(8px);
//                 transition: background 0.3s ease, border-color 0.3s ease;
//               }
//               .email-pill:hover {
//                 background: rgba(184, 206, 194, 0.18);
//                 border-color: rgba(184, 206, 194, 0.5);
//               }
//             `}</style>
//       </motion.footer >
//     </div >
//   )
// }

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { motion, type Transition } from 'framer-motion'

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

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const viewTransition: Transition = { duration: 1, ease: easing }
const viewMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: viewTransition,
  viewport: { once: true as const, margin: '-100px' },
}

const cascadeContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const cascadeItem = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: easing },
  },
}

export default function FooterSection() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [emailHovered, setEmailHovered] = useState(false)
  const emailBtnRef = useRef<HTMLAnchorElement>(null)

  // GSAP Marquee — scrolling brand strip above the CTA
  useEffect(() => {
    if (!marqueeRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 28,
        ease: 'none',
        repeat: -1,
      })
    })
    return () => ctx.revert()
  }, [])

  // Magnetic hover for the email button
  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = emailBtnRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power2.out' })
  }
  const handleMagneticLeave = () => {
    const el = emailBtnRef.current
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <div className="md:px-4 lg:px-8 md:pt-6 lg:pt-10 md:pb-6 lg:pb-10">
      <motion.footer
        id="contact"
        {...viewMotion}
        className="footer-backing relative pt-14 sm:pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden
               md:rounded-[2rem] lg:rounded-[2.5rem]"
      >
        {/* Marquee brand strip */}
        <div className="relative mb-12 sm:mb-16 overflow-hidden border-y border-[#B8CEC2]/12 py-3">
          <div ref={marqueeRef} className="flex w-max whitespace-nowrap">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="mx-6 font-display italic text-lg sm:text-xl text-[#B8CEC2]/25"
              >
                Arthagama &nbsp;✦
              </span>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
          {/* CTA */}
          <motion.div className="text-center mb-14 sm:mb-16 md:mb-20" {...viewMotion}>
            <p className="text-[11px] sm:text-xs text-[#B8CEC2]/75 uppercase tracking-[0.3em] mb-5 sm:mb-6">
              Get in touch
            </p>
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display italic text-[#EAF1EC] mb-7 sm:mb-8 leading-[0.95] sm:leading-[0.9]"
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: easing }}
              viewport={{ once: true, margin: '-100px' }}
            >
              Let's work together
            </motion.h2>

            {/* Email Button — mint pill, dark teal text, magnetic hover + glow */}
            <div
              className="inline-block relative"
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => {
                setEmailHovered(false)
                handleMagneticLeave()
              }}
            >
              <span
                className="absolute inset-[-2px] rounded-full bg-[#B8CEC2] blur-[16px] transition-opacity duration-300 pointer-events-none"
                style={{ opacity: emailHovered ? 0.55 : 0 }}
              />
              <motion.a
                ref={emailBtnRef}
                href="mailto:hello@arthagama.com"
                onMouseMove={handleMagneticMove}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="email-pill-mint relative z-10 flex items-center gap-3 text-xs sm:text-sm font-medium text-[#1B3236] rounded-full px-6 sm:px-8 py-3.5 sm:py-4"
              >
                <span>info@arthagama.com</span>
                <motion.span
                  className="text-[#244147]/70"
                  animate={{ x: emailHovered ? 3 : 0, y: emailHovered ? -3 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  ↗
                </motion.span>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links Grid — cascade reveal */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 sm:gap-8 mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-[#B8CEC2]/15"
            variants={cascadeContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Pages */}
            <motion.div variants={cascadeItem}>
              <p className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.25em] mb-4">Pages</p>
              <ul className="flex flex-col gap-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#DCE7E1]/80 hover:text-[#EAF1EC] transition-colors duration-200 inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#EAF1EC] transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Account */}
            <motion.div variants={cascadeItem}>
              <p className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.25em] mb-4">Account</p>
              <ul className="flex flex-col gap-2.5">
                {ACCOUNT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#DCE7E1]/80 hover:text-[#EAF1EC] transition-colors duration-200 inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#EAF1EC] transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social */}
            <motion.div variants={cascadeItem}>
              <p className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.25em] mb-4">Social</p>
              <ul className="flex flex-col gap-2.5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="text-sm text-[#DCE7E1]/80 hover:text-[#EAF1EC] transition-colors duration-200 inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#EAF1EC] transition-all duration-200" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Availability */}
            <motion.div variants={cascadeItem}>
              <p className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.25em] mb-4">Status</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8CEC2] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8CEC2]" />
                </span>
                <span className="text-sm text-[#DCE7E1]/75">Available</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <p className="text-xs text-[#B8CEC2]/50">
              © 2026 Arthagama. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-xs text-[#B8CEC2]/70 uppercase tracking-[0.2em] hover:text-[#EAF1EC] transition-colors duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <style>{`
          .footer-backing {
            background: rgba(18, 33, 36, 0.68);
            backdrop-filter: blur(34px) saturate(1.1);
            -webkit-backdrop-filter: blur(34px) saturate(1.1);
            border: 1px solid rgba(184, 206, 194, 0.14);
            box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.55),
              inset 0 1px 1px rgba(184, 206, 194, 0.12);
          }

          .email-pill-mint {
            background: rgba(184, 206, 194, 0.9);
            border: 1px solid rgba(184, 206, 194, 1);
            box-shadow: 0 4px 18px rgba(18, 33, 36, 0.3);
            transition: background 0.3s ease, box-shadow 0.3s ease;
          }
          .email-pill-mint:hover {
            background: rgba(200, 220, 210, 1);
          }
        `}</style>
      </motion.footer>
    </div>
  )
}