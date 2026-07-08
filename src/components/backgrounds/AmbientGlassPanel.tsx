// components/ui/AmbientGlassPanel.tsx
"use client"

import { motion } from 'framer-motion'
import { AmbientGlassPanelProps } from '@/src/types/AmbientGlassPanelProps'

export default function AmbientGlassPanel({
    children,
    className = '',
    sectionClassName = '',
    showAmbient = true,
    minHeight = '50vh',
}: AmbientGlassPanelProps) {
    return (
        <section className={`relative px-4 sm:px-6 md:px-10 lg:px-16 ${sectionClassName}`}>
            <div
                className={`ambient-glass-panel relative mx-auto flex max-w-[1200px] flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] ${className}`}
                style={{ minHeight }}
            >
                {showAmbient && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full bg-[#B8CEC2]/25 blur-[110px]"
                            animate={{ x: [0, 50, -20, 0], y: [0, 30, -20, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="absolute -bottom-32 -right-16 h-[420px] w-[420px] rounded-full bg-[#244147]/60 blur-[120px]"
                            animate={{ x: [0, -40, 20, 0], y: [0, -30, 20, 0] }}
                            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <div
                            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
                            style={{
                                backgroundImage: 'radial-gradient(circle, #B8CEC2 1px, transparent 1px)',
                                backgroundSize: '5px 5px',
                            }}
                        />
                    </div>
                )}

                <div className="relative z-10 flex flex-1 flex-col">{children}</div>
            </div>

            <style>{`
                .ambient-glass-panel {
                    background: rgba(18, 33, 36, 0.55);
                    backdrop-filter: blur(40px) saturate(1.1);
                    -webkit-backdrop-filter: blur(40px) saturate(1.1);
                    border: 1px solid rgba(184, 206, 194, 0.15);
                    box-shadow: 0 30px 90px -30px rgba(0, 0, 0, 0.55),
                        inset 0 1px 1px rgba(184, 206, 194, 0.15);
                }
            `}</style>
        </section>
    )
}