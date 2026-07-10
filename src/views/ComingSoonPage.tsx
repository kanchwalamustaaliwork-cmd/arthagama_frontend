'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'

export default function ComingSoonPage() {
    const router = useRouter()

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6">
            {/* Ambient glow orbs */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    width: '600px',
                    height: '600px',
                    background:
                        'radial-gradient(circle at center, rgba(184, 206, 194, 0.08) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />
            <div
                className="pointer-events-none absolute left-1/4 top-1/4"
                style={{
                    width: '300px',
                    height: '300px',
                    background:
                        'radial-gradient(circle at center, rgba(36, 65, 71, 0.4) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Back button */}
            <motion.button
                onClick={() => router.back()}
                className="absolute left-6 top-8 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[#B8CEC2]/70 transition-colors hover:text-[#B8CEC2]"
                style={{
                    background: 'rgba(184, 206, 194, 0.05)',
                    border: '1px solid rgba(184, 206, 194, 0.12)',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ x: -2 }}
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
            </motion.button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-10 flex h-20 w-20 items-center justify-center rounded-full"
                    style={{
                        background: 'rgba(184, 206, 194, 0.07)',
                        border: '1px solid rgba(184, 206, 194, 0.2)',
                        boxShadow: '0 0 40px rgba(184, 206, 194, 0.08)',
                    }}
                >
                    <Clock className="h-9 w-9 text-[#B8CEC2]/70" />
                </motion.div>

                {/* Label */}
                <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6 inline-block rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-[#B8CEC2]/60"
                    style={{
                        background: 'rgba(184, 206, 194, 0.06)',
                        border: '1px solid rgba(184, 206, 194, 0.12)',
                    }}
                >
                    In Development
                </motion.span>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-6 font-body font-light leading-[1.1] tracking-tight text-[#EAF1EC]"
                    style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
                >
                    Coming
                    <br />
                    <span
                        style={{
                            background:
                                'linear-gradient(135deg, #B8CEC2 0%, #8AADA0 40%, #B8CEC2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Soon
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="max-w-md text-base leading-relaxed text-[#DCE7E1]/50"
                >
                    We're working hard to bring this feature to life.
                    <br />
                    Stay tuned — it'll be worth the wait.
                </motion.p>

                {/* Divider line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mt-12 h-px w-32 origin-left"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent, rgba(184, 206, 194, 0.4), transparent)',
                    }}
                />
            </div>

            <style>{`
                @keyframes floatOrb {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -54%) scale(1.06); }
                }
            `}</style>
        </div>
    )
}
