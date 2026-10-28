'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'Overview',   href: '/admin/mtf' },
  { label: 'Stocks',     href: '/admin/mtf/stocks' },
  { label: 'Brokers',    href: '/admin/mtf/brokers' },
  { label: 'Funding',    href: '/admin/mtf/funding' },
  { label: 'Events',     href: '/admin/mtf/events' },
  { label: 'Reports',    href: '/admin/mtf/reports' },
  { label: 'Free Float', href: '/admin/mtf/freefloat' },
  { label: 'Data',       href: '/admin/mtf/methodology' },
] as const

export function MtfNav() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2 mb-6 text-sm">
      {NAV.map(({ label, href }) => {
        const active = href === '/admin/mtf' ? pathname === href : pathname.startsWith(href)
        return (
          <Link key={href} href={href}
            className={`px-3 py-1.5 rounded-md transition-colors ${active ? 'bg-blue-600 text-white font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
