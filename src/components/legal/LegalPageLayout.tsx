"use client"

import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useSpring, useScroll, type Transition } from 'framer-motion'
import { formatBrandText, BRAND_ON_DARK, BRAND_ON_LIGHT } from '@/src/utils/brand'

export interface LegalSection {
    id: string
    heading: string
    paragraphs: (string | ReactNode)[]
}

interface LegalPageLayoutProps {
    eyebrow: string
    title: string
    lastUpdated: string
    intro: string
    sections: LegalSection[]
}

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const viewTransition: Transition = { duration: 0.8, ease: easing }

// Hero: mask reveal, word by word — the one "spent" animation budget item
const maskContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
}
const maskWord = {
    hidden: { clipPath: 'inset(0 0 100% 0)', y: 34, opacity: 0 },
    visible: {
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: easing },
    },
}

function MaskRevealHeading({ text }: { text: string }) {
    const words = text.split(' ')
    return (
        <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-body font-light text-[#EAF1EC] leading-[1.05] flex flex-wrap gap-x-3"
            variants={maskContainer}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block">
                    <motion.span variants={maskWord} className="inline-block">
                        {word}
                    </motion.span>
                </span>
            ))}
        </motion.h1>
    )
}

const sectionMotion = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: viewTransition,
    viewport: { once: true as const, margin: '-80px' },
}

const paraContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
}
const paraItem = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easing } },
}

export default function LegalPageLayout({
    eyebrow,
    title,
    lastUpdated,
    intro,
    sections,
}: LegalPageLayoutProps) {
    const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
    const tocContainerRef = useRef<HTMLDivElement>(null)
    const tocLinkRefs = useRef<(HTMLAnchorElement | null)[]>([])
    const contentRef = useRef<HTMLDivElement>(null)

    // ── Scroll-spy: which section heading is currently nearest the top ──────
    useEffect(() => {
        const headingEls = sections
            .map((s) => document.getElementById(s.id))
            .filter(Boolean) as HTMLElement[]

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (visible[0]) setActiveId(visible[0].target.id)
            },
            { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
        )

        headingEls.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [sections])

    // ── Liquid blob indicator, same mechanic as the navbar pill nav ─────────
    const [box, setBox] = useState({ top: 0, height: 0 })

    const measure = useCallback(() => {
        const idx = sections.findIndex((s) => s.id === activeId)
        const el = tocLinkRefs.current[idx]
        const container = tocContainerRef.current
        if (!el || !container) return
        const elRect = el.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        setBox({ top: elRect.top - containerRect.top, height: elRect.height })
    }, [activeId, sections])

    useEffect(() => {
        measure()
    }, [measure])

    const springConfig = { stiffness: 380, damping: 30, mass: 1 }
    const y = useSpring(box.top, springConfig)
    const height = useSpring(box.height, springConfig)

    useEffect(() => {
        y.set(box.top)
        height.set(box.height)
    }, [box, y, height])

    // ── Reading progress bar across the content column ───────────────────────
    const { scrollYProgress } = useScroll({
        target: contentRef,
        offset: ['start start', 'end end'],
    })
    const progressWidth = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

    return (
        <div className="relative min-h-screen w-full pt-32 pb-24 sm:pt-36">
            <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-6 md:px-10 lg:px-16">
                {/* ── Hero ─────────────────────────────────────────────────────── */}
                <div className="mb-14 sm:mb-16 md:mb-20 max-w-3xl">
                    <motion.div
                        className="mb-5 flex items-center gap-3"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easing }}
                    >
                        <div className="w-8 h-px bg-[#B8CEC2]/40" />
                        <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8CEC2]/75">
                            {eyebrow}
                        </span>
                    </motion.div>

                    <MaskRevealHeading text={title} />

                    <motion.div
                        className="mt-6 flex flex-wrap items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, ease: easing, delay: 0.5 }}
                    >
                        <span className="last-updated-pill text-xs text-[#1B3236] font-medium px-4 py-1.5 rounded-full">
                            Last updated {lastUpdated}
                        </span>
                        <p className="text-sm text-[#DCE7E1]/80 max-w-lg leading-relaxed">{typeof intro === 'string' ? formatBrandText(intro, BRAND_ON_DARK) : intro}</p>
                    </motion.div>
                </div>

                {/* ── Body: sticky TOC + content ──────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                    {/* Sidebar TOC — desktop only */}
                    <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-32">
                        <p className="text-xs text-[#B8CEC2]/60 uppercase tracking-[0.25em] mb-4">
                            On this page
                        </p>
                        <div ref={tocContainerRef} className="relative flex flex-col gap-1">
                            {/* Liquid blob */}
                            <motion.div
                                className="absolute left-0 w-full rounded-xl pointer-events-none toc-blob"
                                style={{ y, height }}
                            />
                            {sections.map((section, i) => (
                                <a
                                    key={section.id}
                                    ref={(el) => {
                                        tocLinkRefs.current[i] = el
                                    }}
                                    href={`#${section.id}`}
                                    className={`relative z-10 rounded-xl px-4 py-2.5 text-sm leading-snug transition-colors duration-300 ${activeId === section.id
                                            ? 'text-[#1B3236] font-medium'
                                            : 'text-[#B8CEC2]/65 hover:text-[#EAF1EC]'
                                        }`}
                                >
                                    {section.heading}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Mobile TOC — horizontal scroll pills */}
                    <div className="lg:hidden col-span-1 -mx-5 px-5 mb-2 overflow-x-auto no-scrollbar">
                        <div className="flex gap-2 w-max">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className={`whitespace-nowrap text-xs rounded-full px-3.5 py-2 border transition-colors duration-300 ${activeId === section.id
                                            ? 'bg-[#B8CEC2] text-[#1B3236] border-[#B8CEC2] font-medium'
                                            : 'border-[#B8CEC2]/25 text-[#B8CEC2]/70'
                                        }`}
                                >
                                    {section.heading}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div ref={contentRef} className="lg:col-span-9 relative">
                        <div className="legal-card relative rounded-3xl overflow-hidden">
                            {/* Reading progress bar */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#122124]/20 z-10">
                                <motion.div
                                    className="h-full bg-[#244147]"
                                    style={{ scaleX: progressWidth, transformOrigin: 'left' }}
                                />
                            </div>

                            <div className="p-6 sm:p-10 md:p-14 flex flex-col gap-14 sm:gap-16">
                                {sections.map((section) => (
                                    <motion.section
                                        key={section.id}
                                        id={section.id}
                                        className="scroll-mt-32"
                                        {...sectionMotion}
                                    >
                                        <h2 className="text-xl sm:text-2xl font-body font-semibold text-[#1B3236] mb-5">
                                            {section.heading}
                                        </h2>
                                        <motion.div
                                            className="flex flex-col gap-4"
                                            variants={paraContainer}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: '-60px' }}
                                        >
                                            {section.paragraphs.map((para, i) => (
                                                <motion.p
                                                    key={i}
                                                    variants={paraItem}
                                                    className="text-sm sm:text-[15px] text-[#244147]/85 leading-relaxed"
                                                >
                                                    {typeof para === 'string' ? formatBrandText(para, BRAND_ON_LIGHT) : para}
                                                </motion.p>
                                            ))}
                                        </motion.div>
                                    </motion.section>
                                ))}

                                {/* Footer note inside the card */}
                                <div className="pt-8 border-t border-[#244147]/12">
                                    <p className="text-xs text-[#244147]/60 leading-relaxed">
                                        Questions about this document? Reach us at{' '}
                                        <a href="mailto:hello@arthagama.com" className="underline hover:text-[#1B3236]">
                                            hello@arthagama.com
                                        </a>
                                        , or see our{' '}
                                        <Link href="/contact" scroll={false} className="underline hover:text-[#1B3236]">
                                            contact page
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .last-updated-pill {
          background: rgba(184, 206, 194, 0.85);
          border: 1px solid rgba(184, 206, 194, 0.95);
        }

        .toc-blob {
          background: linear-gradient(180deg, #B8CEC2 0%, #CBDBD1 100%);
          box-shadow: 0 2px 10px rgba(18, 33, 36, 0.35);
        }

        .legal-card {
          background: rgba(184, 206, 194, 0.9);
          backdrop-filter: blur(20px) saturate(1.05);
          -webkit-backdrop-filter: blur(20px) saturate(1.05);
          border: 1px solid rgba(184, 206, 194, 1);
          box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.45);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    )
}