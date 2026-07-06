"use client"

import { useState } from 'react'
import Link from 'next/link'

/* ── Sign Up Button ──────────────────────────────────────────────────────── */
export default function SignUpButton() {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            className="relative z-10"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Gradient border ring */}
            <span
                className="absolute inset-[-2px] rounded-full transition-opacity duration-300 pointer-events-none"
                style={{
                    opacity: hovered ? 1 : 0,
                    background: 'linear-gradient(90deg, hsl(var(--mint)) 0%, hsl(var(--teal-soft)) 100%)',
                }}
            />
            <Link
                href="/signup"
                scroll={false}
                className="relative z-10 flex items-center gap-1 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md transition-all duration-200 whitespace-nowrap"
                style={{
                    background: 'hsl(var(--teal) / 0.7)',
                    color: 'hsl(var(--mint-soft))',
                }}
            >
                Become a Member <span style={{ color: 'hsl(var(--mint) / 0.6)' }}>↗</span>
            </Link>
        </div>
    )
}