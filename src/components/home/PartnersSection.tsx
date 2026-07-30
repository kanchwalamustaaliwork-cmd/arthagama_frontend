"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { easing } from '../../constans/animation'
import SectionHeading from '../ui/SectionHeading'
import type { CMSPartner } from '../../types/cms'

interface PartnersSectionProps {
  partners?: CMSPartner[]
  heading?: string | null
}

const DEFAULT_PARTNERS: CMSPartner[] = [
  { id: '1', name: 'Zerodha Broking', logo: null, url: 'https://zerodha.com' },
  { id: '2', name: 'Interactive Brokers', logo: null, url: 'https://interactivebrokers.com' },
  { id: '3', name: 'NSE India', logo: null, url: 'https://nseindia.com' },
  { id: '4', name: 'BSE India', logo: null, url: 'https://bseindia.com' },
  { id: '5', name: 'Dhan Trading', logo: null, url: 'https://dhan.co' },
]

export default function PartnersSection({ partners, heading }: PartnersSectionProps) {
  const items = partners && partners.length > 0 ? partners : DEFAULT_PARTNERS
  const title = heading ?? 'Integrated Execution & Market Infrastructure Partners'

  return (
    <section id="partners" className="relative py-14 sm:py-16 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 md:px-10 lg:px-16">
        <SectionHeading eyebrow={title} align="center" className="mb-8" />

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {items.map((partner, i) => (
            <motion.a
              key={partner.id || i}
              href={partner.url ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="partner-pill rounded-full px-6 py-3 text-sm text-[#EAF1EC]/80 font-medium transition-all duration-300 hover:text-[#EAF1EC] hover:scale-105"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: easing, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              {partner.logo?.url ? (
                <Image src={partner.logo.url} alt={partner.name} width={120} height={36} className="h-6 w-auto object-contain" />
              ) : (
                <span>{partner.name}</span>
              )}
            </motion.a>
          ))}
        </div>
      </div>

      <style>{`
        .partner-pill {
          background: rgba(184, 206, 194, 0.08);
          border: 1px solid rgba(184, 206, 194, 0.18);
          backdrop-filter: blur(10px);
        }
        .partner-pill:hover {
          background: rgba(184, 206, 194, 0.16);
          border-color: rgba(184, 206, 194, 0.4);
        }
      `}</style>
    </section>
  )
}
