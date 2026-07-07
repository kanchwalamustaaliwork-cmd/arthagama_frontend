"use client"

import { useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { easing, viewMotion } from '../constans/animation'
import { QUICK_LINKS, ACCOUNT_LINKS, IMPORTANT_LINKS, SOCIALS } from '../data/footer-links'
import TiltImage from './ui/TiltImage'
import { BRAND_ON_DARK } from '@/src/utils/brand'

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
  const [emailHovered, setEmailHovered] = useState(false)
  const emailBtnRef = useRef<HTMLDivElement>(null)

  // Magnetic hover for the email button
  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
        {/* Main Footer Content */}
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
          {/* CTA */}
          <motion.div className="text-center mb-14 sm:mb-16 md:mb-20" {...viewMotion}>
            <Link
              href={"/contact"}
              scroll={false}
            >

              <motion.div
                className="flex justify-center mb-6"
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: easing }}
                viewport={{ once: true, margin: '-100px' }}
              >
                <TiltImage
                  src="/assets/arthagama_logo.png"
                  alt="ARTHAGAMA Logo"
                  className="w-16 sm:w-20 md:w-24"
                />
              </motion.div>

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
                <motion.div
                  ref={emailBtnRef}
                  onMouseMove={handleMagneticMove}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="email-pill-mint relative z-10 flex items-center gap-3 text-xs sm:text-sm font-medium text-[#1B3236] rounded-full px-6 sm:px-8 py-3.5 sm:py-4"
                >
                  <span>Contact us</span>
                  <motion.span
                    className="text-[#244147]/70"
                    animate={{ x: emailHovered ? 3 : 0, y: emailHovered ? -3 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    ↗
                  </motion.span>
                </motion.div>
              </div>
            </Link>
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
                      href={link.to}
                      scroll={false}
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
                      href={link.to}
                      scroll={false}
                      className="text-sm text-[#DCE7E1]/80 hover:text-[#EAF1EC] transition-colors duration-200 inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#EAF1EC] transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            {/* Disclaimer */}
            <motion.div variants={cascadeItem}>
              <p className="text-xs text-[#B8CEC2] uppercase tracking-[0.25em] mb-4 font-medium">
                Disclaimer:
              </p>
              <p className="text-[11px] leading-relaxed text-[#DCE7E1]/85">
                Trading and investing in financial markets involves risk, including
                the potential loss of principal. Past performance is not indicative
                of future results. Nothing on this site constitutes financial advice.
              </p>
            </motion.div>
          </motion.div>

          {/* ===================== Horizontal Important Links ===================== */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8 sm:mb-10"
            variants={cascadeContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {IMPORTANT_LINKS.map((link) => (
              <motion.div key={link.label} variants={cascadeItem}>
                <Link
                  href={link.to}
                  scroll={false}
                  className="text-[9px] sm:text-[10px] text-[#DCE7E1]/80 hover:text-[#EAF1EC] transition-colors duration-200 uppercase tracking-[0.15em] inline-flex items-center gap-1.5 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-[#EAF1EC] transition-all duration-200" />
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#B8CEC2]/15"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <p className="text-xs text-[#B8CEC2]/50">
              © 2026 <strong className={BRAND_ON_DARK}>ARTHAGAMA</strong>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
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