"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'
import AmbientGlassPanel from '@/src/components/backgrounds/AmbientGlassPanel'
import type { CMSMedia } from '@/src/types/cms'

export interface HeroProps {
  /** Main title text or JSX element */
  title?: string | React.ReactNode | null
  /** Substring to highlight inside the title in brand accent color */
  titleHighlight?: string | null
  /** Subtitle text or JSX element */
  subtitle?: string | React.ReactNode | null
  /** Background image from CMS or URL string. Uses default ambient glass panel if omitted. */
  backgroundImage?: string | CMSMedia | null
  /** Optional additional content rendered below subtitle */
  children?: React.ReactNode
  /** Additional section class names */
  sectionClassName?: string
  /** Additional inner panel class names */
  className?: string
}

function renderFormattedTitle(
  title?: string | React.ReactNode | null,
  titleHighlight?: string | null
): React.ReactNode {
  if (!title) return null
  if (typeof title !== 'string') return title
  if (!titleHighlight || !titleHighlight.trim()) return title

  const highlight = titleHighlight.trim()
  const lowerTitle = title.toLowerCase()
  const lowerHighlight = highlight.toLowerCase()
  const startIndex = lowerTitle.indexOf(lowerHighlight)

  if (startIndex !== -1) {
    const before = title.slice(0, startIndex)
    const matched = title.slice(startIndex, startIndex + highlight.length)
    const after = title.slice(startIndex + highlight.length)
    return (
      <>
        {before}
        <span className="font-bold text-[#B8CEC2]">{matched}</span>
        {after}
      </>
    )
  }

  return (
    <>
      {title}{' '}
      <span className="font-bold text-[#B8CEC2]">{highlight}</span>
    </>
  )
}

export default function Hero({
  title,
  titleHighlight,
  subtitle,
  backgroundImage,
  children,
  sectionClassName = 'pt-28 sm:pt-32 pb-14 sm:pb-16',
  className = '',
}: HeroProps) {
  const bgImageUrl =
    typeof backgroundImage === 'string'
      ? backgroundImage
      : backgroundImage?.hero ?? backgroundImage?.url ?? null

  const formattedTitle = renderFormattedTitle(title, titleHighlight)

  return (
    <AmbientGlassPanel sectionClassName={sectionClassName} className={className} showAmbient={!bgImageUrl}>
      {/* Background Image Layer (when CMS provides an image) */}
      {bgImageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bgImageUrl}
            alt={typeof backgroundImage === 'object' && backgroundImage?.alt ? backgroundImage.alt : 'Hero background'}
            className="h-full w-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#122124]/80 via-[#122124]/60 to-[#122124]/90" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 sm:py-24 text-center">
        {formattedTitle && (
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: easing, delay: 0.15 }}
            className="text-shadow-soft mx-auto max-w-4xl text-2xl font-semibold leading-tight text-[#EAF1EC] sm:text-5xl md:text-3xl lg:text-5xl"
          >
            {formattedTitle}
          </motion.h1>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.55 }}
            className="mx-auto max-w-2xl text-sm italic tracking-wide text-[#B8CEC2]/90 sm:text-base"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.7 }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </div>

      <style>{`
        .text-shadow-soft {
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </AmbientGlassPanel>
  )
}
