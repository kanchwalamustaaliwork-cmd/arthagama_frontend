"use client"

import { useState } from 'react'
import Link from 'next/link'

/* ── Logo ────────────────────────────────────────────────────────────────── */
export default function NavLogo() {
    const [hovered, setHovered] = useState(false)

    return (
        <Link href="/" scroll={false} aria-label="Home" className="relative z-10">
            <div
                className="w-10 h-10 rounded-full p-[2px] transition-transform duration-300 hover:scale-110"
                style={{
                    background: hovered
                        ? 'linear-gradient(270deg, hsl(var(--mint)) 0%, hsl(var(--teal-soft)) 100%)'
                        : 'linear-gradient(90deg, hsl(var(--mint)) 0%, hsl(var(--teal-soft)) 100%)',
                    transition: 'background 0.4s ease, transform 0.3s ease',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div
                    className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: 'hsl(var(--teal-deep))' }}
                >
                    <img
                        src="/favicon/favicon-96x96.png"
                        alt="AG Logo"
                        className="w-7 h-7 object-contain select-none"
                    />
                </div>
            </div>
        </Link>
    )
}