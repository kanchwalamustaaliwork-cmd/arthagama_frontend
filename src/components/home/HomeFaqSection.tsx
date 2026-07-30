"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { easing } from '../../constans/animation'
import SectionHeading from '../ui/SectionHeading'
import type { CMSFAQ } from '../../types/cms'

interface HomeFaqSectionProps {
  faqs?: CMSFAQ[]
  heading?: string | null
}

const DEFAULT_FAQS: CMSFAQ[] = [
  {
    id: '1',
    question: 'How does Arthagama deploy algorithmic trading strategies?',
    answer: 'We connect directly to your broker through low-latency APIs. Our quantitative models run in server environments with automated order routing, strict position controls, and risk limits.',
    category: 'general',
    order: 1,
  },
  {
    id: '2',
    question: 'Can I backtest my custom trading ideas before going live?',
    answer: 'Yes. We run multi-year historical backtests with slippage modelling, transaction cost accounting, and regime analysis before any strategy touches real capital.',
    category: 'general',
    order: 2,
  },
  {
    id: '3',
    question: 'What markets and asset classes do you support?',
    answer: 'Our infrastructure supports equities, futures, options, and multi-asset quantitative models across major Indian exchanges (NSE, BSE) and international markets.',
    category: 'general',
    order: 3,
  },
  {
    id: '4',
    question: 'How are risk management rules enforced?',
    answer: 'Every deployed algorithm includes hard stop-loss limits, maximum drawdown caps, position sizing constraints, and real-time kill-switches monitored by our engineering desk.',
    category: 'general',
    order: 4,
  },
]

export default function HomeFaqSection({ faqs, heading }: HomeFaqSectionProps) {
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS
  const title = heading ?? 'Frequently Asked Questions'
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <section id="faq" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="section-backing absolute inset-x-4 inset-y-6 -z-10 rounded-3xl sm:inset-x-6" />

      <div className="relative z-10 max-w-[900px] mx-auto px-5 sm:px-6">
        <SectionHeading title={title} align="center" className="mb-12" />

        <div className="flex flex-col gap-4">
          {items.map((faq, i) => {
            const isOpen = openId === (faq.id || String(i))
            return (
              <motion.div
                key={faq.id || i}
                className="faq-card rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easing, delay: i * 0.08 }}
                viewport={{ once: true, margin: '-60px' }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id || String(i))}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-semibold text-[#1B3236] text-base sm:text-lg"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#1B3236] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: easing }}
                    >
                      <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base text-[#244147]/85 leading-relaxed border-t border-[#244147]/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          backdrop-filter: blur(28px) saturate(1.1);
          -webkit-backdrop-filter: blur(28px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.1);
        }
        .faq-card {
          background: rgba(184, 206, 194, 0.88);
          backdrop-filter: blur(14px) saturate(1.1);
          -webkit-backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
        }
      `}</style>
    </section>
  )
}
