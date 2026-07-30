"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { easing } from '../../constans/animation'
import SectionHeading from '../ui/SectionHeading'
import type { CMSTestimonial } from '../../types/cms'

interface TestimonialsSectionProps {
  testimonials?: CMSTestimonial[]
  heading?: string | null
}

const DEFAULT_TESTIMONIALS: CMSTestimonial[] = [
  {
    id: '1',
    name: 'Vikram Mehta',
    testimonialRole: 'Chief Investment Officer',
    company: 'Alpha Asset Management',
    quote: 'Arthagama transformed our execution pipeline. Their systematic strategies operate with zero downtime and incredible precision.',
    photo: null,
    rating: 5,
  },
  {
    id: '2',
    name: 'Rajesh Singhania',
    testimonialRole: 'Founder & Managing Partner',
    company: 'Quant Capital Partners',
    quote: 'The backtesting rigour and quantitative research provided by Arthagama gave us complete confidence before deploying live capital.',
    photo: null,
    rating: 5,
  },
  {
    id: '3',
    name: 'Ananya Deshmukh',
    testimonialRole: 'Head of Algorithmic Trading',
    company: 'Nexus Broking Services',
    quote: 'Seamless broker API integration and transparent risk monitoring. They are true quantitative specialists.',
    photo: null,
    rating: 5,
  },
]

export default function TestimonialsSection({ testimonials, heading }: TestimonialsSectionProps) {
  const items = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS
  const title = heading ?? 'What Our Clients Say'

  return (
    <section id="testimonials" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="section-backing absolute inset-x-4 inset-y-6 -z-10 rounded-3xl sm:inset-x-6" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
        <SectionHeading title={title} align="center" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {items.map((t, i) => (
            <motion.div
              key={t.id || i}
              className="testimonial-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating ?? 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-[#B8CEC2] text-[#B8CEC2]" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-[#244147]/90 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#244147]/15">
                {t.photo?.url ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#244147]/30">
                    <Image src={t.photo.url} alt={t.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#244147]/15 text-[#1B3236] font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-[#1B3236]">{t.name}</h4>
                  <p className="text-xs text-[#244147]/70">
                    {t.testimonialRole}{t.company ? ` · ${t.company}` : ''}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          backdrop-filter: blur(28px) saturate(1.1);
          -webkit-backdrop-filter: blur(28px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.1);
        }
        .testimonial-card {
          background: rgba(184, 206, 194, 0.88);
          backdrop-filter: blur(14px) saturate(1.1);
          -webkit-backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
          box-shadow: 0 4px 20px rgba(18, 33, 36, 0.2);
        }
      `}</style>
    </section>
  )
}
