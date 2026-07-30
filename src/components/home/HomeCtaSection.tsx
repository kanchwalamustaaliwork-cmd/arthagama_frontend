"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { easing } from '../../constans/animation'
import SectionHeading from '../ui/SectionHeading'

interface HomeCtaSectionProps {
  cmsCta?: {
    heading: string | null
    subtitle: string | null
    ctaLabel: string | null
    ctaUrl: string | null
  } | null
}

export default function HomeCtaSection({ cmsCta }: HomeCtaSectionProps) {
  const heading = cmsCta?.heading ?? 'Ready to elevate your trading strategy?'
  const subtitle = cmsCta?.subtitle ?? 'Partner with Arthagama to transform quantitative insights into live, rule-based execution.'
  const label = cmsCta?.ctaLabel ?? 'Get in Touch'
  const url = cmsCta?.ctaUrl ?? '/contact'

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 md:px-10 lg:px-16">
        <motion.div
          className="cta-card rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easing }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionHeading
            title={heading}
            subtitle={subtitle}
            align="center"
            theme="light"
            maxWidth="max-w-2xl"
            className="mb-8"
            noAnimation
          />

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
          -webkit-backdrop-filter: blur(20px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 1);
          box-shadow: 0 20px 60px -20px rgba(18, 33, 36, 0.3);
        }
      `}</style>
    </section>
  )
}
