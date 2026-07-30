import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { easing } from '../../constans/animation'

export interface SectionHeadingProps {
  /** Main section heading text or node */
  title?: React.ReactNode
  /** Optional subtitle or description text or node */
  subtitle?: React.ReactNode
  /** Optional eyebrow / badge text above the title */
  eyebrow?: React.ReactNode
  /** Text alignment: 'left' | 'center' | 'right'. Default: 'left' */
  align?: 'left' | 'center' | 'right'
  /** Visual color theme: 'dark' (for dark background panels, light text) or 'light' (for light background cards, dark text). Default: 'dark' */
  theme?: 'dark' | 'light'
  /** Max width constraint for title/subtitle (e.g. 'max-w-2xl'). Default: auto */
  maxWidth?: string
  /** Additional container classes */
  className?: string
  /** Additional title element classes */
  titleClassName?: string
  /** Additional subtitle element classes */
  subtitleClassName?: string
  /** Additional eyebrow element classes */
  eyebrowClassName?: string
  /** Custom HTML heading tag: 'h1' | 'h2' | 'h3' | 'h4'. Default: 'h2' */
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  /** Disable entrance animation if needed. Default: false */
  noAnimation?: boolean
}

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = 'left',
  theme = 'dark',
  maxWidth,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  eyebrowClassName = '',
  as = 'h2',
  noAnimation = false,
}: SectionHeadingProps) {
  if (!title && !subtitle && !eyebrow) return null

  const isCenter = align === 'center'
  const isRight = align === 'right'

  const alignmentWrapperClass = isCenter
    ? 'flex flex-col items-center text-center'
    : isRight
    ? 'flex flex-col items-end text-right'
    : 'flex flex-col items-start text-left'

  const eyebrowColor = theme === 'dark' ? 'text-[#B8CEC2]/70' : 'text-[#244147]/70'
  const titleColor = theme === 'dark' ? 'text-[#EAF1EC]' : 'text-[#1B3236]'
  const subtitleColor = theme === 'dark' ? 'text-[#DCE7E1]/85' : 'text-[#244147]/85'

  const Component = motion[as] as React.ElementType

  const motionProps: HTMLMotionProps<'div'> = noAnimation
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: easing },
        viewport: { once: true, margin: '-80px' },
      }

  return (
    <motion.div
      className={`${alignmentWrapperClass} ${className}`}
      {...motionProps}
    >
      {eyebrow && (
        <p className={`text-xs uppercase tracking-[0.25em] font-medium mb-3 ${eyebrowColor} ${eyebrowClassName}`}>
          {eyebrow}
        </p>
      )}

      {title && (
        <Component
          className={`text-3xl sm:text-4xl md:text-5xl font-body font-light leading-tight ${titleColor} ${maxWidth ?? ''} ${titleClassName}`}
        >
          {title}
        </Component>
      )}

      {subtitle && (
        <p
          className={`text-sm sm:text-base font-body font-light leading-relaxed mt-3 ${subtitleColor} ${maxWidth ?? (isCenter ? 'max-w-xl' : 'max-w-md')} ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
