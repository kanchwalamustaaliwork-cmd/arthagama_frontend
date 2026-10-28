'use client'
import React from 'react'

interface DateRangePickerProps {
  from?: string
  to?: string
  onChange: (range: { from?: string; to?: string }) => void
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1.5">
        <label className="text-gray-500 font-medium">From</label>
        <input
          type="date"
          value={from ?? ''}
          onChange={(e) => onChange({ from: e.target.value || undefined, to })}
          className="h-8 rounded-md border bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-600"
        />
      </div>
      <span className="text-gray-400">→</span>
      <div className="flex items-center gap-1.5">
        <label className="text-gray-500 font-medium">To</label>
        <input
          type="date"
          value={to ?? ''}
          onChange={(e) => onChange({ from, to: e.target.value || undefined })}
          className="h-8 rounded-md border bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-600"
        />
      </div>
      {(from || to) && (
        <button
          type="button"
          onClick={() => onChange({ from: undefined, to: undefined })}
          className="h-8 px-2 text-gray-400 hover:text-gray-600 rounded"
          title="Reset date range"
        >
          ✕
        </button>
      )}
    </div>
  )
}

