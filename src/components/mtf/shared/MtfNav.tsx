/**
 * src/components/mtf/shared/MtfNav.tsx
 *
 * Module-level navigation bar for the Admin MTF Intelligence suite.
 * Follows the dark institutional design system consistent with StockDashboardNav.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  SlidersHorizontal,
  Building2,
  Coins,
  AlertTriangle,
  FileText,
  PieChart,
  Database,
  ShieldCheck,
} from 'lucide-react'

const NAV_TABS = [
  { label: 'Overview', href: '/admin/mtf', icon: LayoutDashboard },
  { label: 'Stock Screener', href: '/admin/mtf/stocks', icon: SlidersHorizontal },
  { label: 'Broker Books', href: '/admin/mtf/brokers', icon: Building2 },
  { label: 'Funding & CP', href: '/admin/mtf/funding', icon: Coins },
  { label: 'Market Events', href: '/admin/mtf/events', icon: AlertTriangle },
  { label: 'Reports', href: '/admin/mtf/reports', icon: FileText },
  { label: 'Free Float', href: '/admin/mtf/freefloat', icon: PieChart },
  { label: 'Data Ingestion', href: '/admin/mtf/methodology', icon: Database },
] as const

export function MtfNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin/mtf') {
      return pathname === '/admin/mtf'
    }
    return pathname.startsWith(href)
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Top row: Module Title & System Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              MTF Intelligence &amp; Leverage Analytics
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--db-mint, #B8CEC2)',
                background: 'rgba(184, 206, 194, 0.1)',
                border: '1px solid rgba(184, 206, 194, 0.2)',
                borderRadius: '6px',
                padding: '2px 7px',
              }}
            >
              NSE &amp; BSE
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--db-text-muted, #708482)',
              margin: '4px 0 0 0',
            }}
          >
            Institutional-grade Margin Trading Facility debt tracking, broker disclosures, and systemic leverage monitoring.
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--db-text-2, #A5B7B3)',
            background: 'var(--db-surface, #18282C)',
            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
            borderRadius: '20px',
            padding: '5px 12px',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--db-gain, #22C55E)',
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
              display: 'inline-block',
            }}
          />
          <ShieldCheck size={14} color="var(--db-mint, #B8CEC2)" />
          <span>Surveillance Active</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {NAV_TABS.map((tab) => {
          const active = isActive(tab.href)
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px 8px 0 0',
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-2, #A5B7B3)',
                background: active ? 'var(--db-surface, #18282C)' : 'transparent',
                borderBottom: active
                  ? '2px solid var(--db-mint, #B8CEC2)'
                  : '2px solid transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
              }}
            >
              <Icon size={15} color={active ? 'var(--db-mint, #B8CEC2)' : 'currentColor'} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
