"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { easing } from '../../constans/animation'

interface ContactCtaSectionProps {
  cmsCta?: {
    heading: string | null
    subtitle: string | null
    ctaLabel: string | null
    ctaUrl: string | null
  } | null
}

export default function ContactCtaSection({ cmsCta }: ContactCtaSectionProps) {
  const heading = cmsCta?.heading ?? 'Prefer a direct meeting or call?'
  const subtitle = cmsCta?.subtitle ?? 'Schedule a session with our quantitative team to discuss strategy development, infrastructure, or partnership options.'
  const label = cmsCta?.ctaLabel ?? 'Book a consultation'
  const url = cmsCta?.ctaUrl ?? 'mailto:info@arthagama.com'

  return (
    <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:px-16 overflow-hidden">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          className="cta-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easing }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-body font-light text-[#1B3236] max-w-2xl mb-4">
            {heading}
          </h2>

          <p className="text-sm sm:text-base text-[#244147]/85 max-w-xl mb-8 leading-relaxed">
            {subtitle}
          </p>

          <Link
            href={url}
            scroll={false}
            className="inline-flex items-center gap-2 rounded-full bg-[#244147] px-8 py-3.5 text-sm font-medium text-[#EAF1EC] transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            <span>{label}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .cta-card {
          background: rgba(184, 206, 194, 0.92);
          backdrop-filter: blur(20px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 1);
          box-shadow: 0 20px 60px -20px rgba(18, 33, 36, 0.3);
        }
      `}</style>
    </section>
  )
}
