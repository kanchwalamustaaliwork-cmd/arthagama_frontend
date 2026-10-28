'use client'
import React, { useState } from 'react'
import { useMtfReport, useDayReport } from '@/src/hooks/mtf/useMtfData'
import { PeriodReportCard } from '@/src/components/mtf/reports/PeriodReportCard'
import { DayReportCard } from '@/src/components/mtf/reports/DayReportCard'
import { MoversTable } from '@/src/components/mtf/reports/MoversTable'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import type { ReportPeriod } from '@/src/types/mtf'

const PERIODS: { label: string; value: ReportPeriod }[] = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
]

export function MtfReportsView() {
  const [tab, setTab] = useState<'period' | 'day'>('period')
  const [period, setPeriod] = useState<ReportPeriod>('month')
  const today = new Date()
  const defaultKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const [key, setKey] = useState(defaultKey)
  const [dayDate, setDayDate] = useState(today.toISOString().split('T')[0])

  const { data: periodReport, loading: pLoading } = useMtfReport(period, key)
  const { data: dayReport, loading: dLoading } = useDayReport(dayDate)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">MTF Analytical Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">Rolling period roll-ups, growth statistics and daily snapshots</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="inline-flex rounded-lg border bg-gray-50 p-0.5 text-xs">
            <button
              onClick={() => setTab('period')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                tab === 'period' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Period Reports
            </button>
            <button
              onClick={() => setTab('day')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                tab === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Daily Report
            </button>
          </div>
          <AsOfBadge asOf={periodReport?.as_of} />
        </div>
      </div>

      {tab === 'period' ? (
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    period === p.value
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="h-8 rounded-lg border bg-white px-2.5 text-xs font-mono text-gray-700 w-36 focus:outline-none focus:ring-1 focus:ring-purple-600"
              placeholder="e.g. 2026-10"
            />
          </div>

          {pLoading ? (
            <div className="h-48 rounded-xl border bg-white p-6 animate-pulse" />
          ) : periodReport ? (
            <>
              <PeriodReportCard report={periodReport} />
              <MoversTable gainers={periodReport.biggest_gainers ?? []} losers={periodReport.biggest_losers ?? []} />
            </>
          ) : (
            <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-400">
              No report computed for {period} {key}.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Select Date:</label>
            <input
              type="date"
              value={dayDate}
              onChange={(e) => setDayDate(e.target.value)}
              className="h-8 rounded-lg border bg-white px-2.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {dLoading ? (
            <div className="h-48 rounded-xl border bg-white p-6 animate-pulse" />
          ) : dayReport ? (
            <>
              <DayReportCard report={dayReport} />
              <MoversTable
                gainers={(dayReport.biggest_movers ?? []).filter((m) => m.direction === 'UP')}
                losers={(dayReport.biggest_movers ?? []).filter((m) => m.direction === 'DOWN')}
              />
            </>
          ) : (
            <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-400">
              No daily snapshot recorded for {dayDate}.
            </div>
          )}
        </div>
      )}

      <SourceAttribution />
    </div>
  )
}
