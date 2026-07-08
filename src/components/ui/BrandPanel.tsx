// components/ui/BrandPanel.tsx
"use client"

import TiltImage from './TiltImage'
import { BrandPanelProps } from '@/src/types/brand-panel'


export default function BrandPanel({
    className = '',
    logoClassName = 'w-20 sm:w-24 lg:w-28',
    nameClassName = 'mx-auto w-full max-w-[380px] sm:max-w-[520px] lg:max-w-[640px]',
    showTagline = true,
    animated = true,
}: BrandPanelProps) {
    const logoWrapClass = animated ? 'blur-in flex justify-center' : 'flex justify-center'
    const nameWrapClass = 'name-reveal'
    const taglineClass = animated
        ? 'blur-in whitespace-nowrap text-[9px] tracking-[0.08em] uppercase text-[hsl(var(--mint)/0.6)] xs:text-[10px] sm:text-xs md:text-sm'
        : 'whitespace-nowrap text-[9px] tracking-[0.08em] uppercase text-[hsl(var(--mint)/0.6)] xs:text-[10px] sm:text-xs md:text-sm'

    return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
            <div className={logoWrapClass}>
                <TiltImage
                    src="/assets/arthagama_logo.png"
                    alt="ARTHAGAMA Logo"
                    className={logoClassName}
                />
            </div>

            <div className={nameWrapClass}>
                <TiltImage
                    src="/assets/arthagama_name.png"
                    alt="ARTHAGAMA"
                    className={nameClassName}
                />
            </div>

            {showTagline && (
                <p className={taglineClass}>
                    ArthĀ · Wealth + Āgama · Inflow
                </p>
            )}
        </div>
    )
}