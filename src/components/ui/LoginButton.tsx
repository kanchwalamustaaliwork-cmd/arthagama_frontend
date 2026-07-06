"use client"

import Link from 'next/link'

/* ── Login Button ────────────────────────────────────────────────────────── */
export default function LoginButton() {
    return (
        <Link
            href="/login"
            scroll={false}
            className="relative z-10 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 whitespace-nowrap"
            style={{
                border: '1px solid hsl(var(--mint) / 0.3)',
                color: 'hsl(var(--mint) / 0.85)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.color = 'hsl(var(--mint-soft))'
                e.currentTarget.style.borderColor = 'hsl(var(--mint) / 0.6)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsl(var(--mint) / 0.85)'
                e.currentTarget.style.borderColor = 'hsl(var(--mint) / 0.3)'
            }}
        >
            Log in
        </Link>
    )
}