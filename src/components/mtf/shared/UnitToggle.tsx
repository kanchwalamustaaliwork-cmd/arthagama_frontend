'use client'
import React from 'react'

export type MoneyUnit = 'cr' | 'lakh_cr'

interface UnitToggleProps {
  unit: MoneyUnit
  onChange: (unit: MoneyUnit) => void
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="inline-flex rounded-lg border bg-gray-50 p-0.5 text-xs">
      <button
        type="button"
        onClick={() => onChange('cr')}
        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
          unit === 'cr' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        ₹ Crore
      </button>
      <button
        type="button"
        onClick={() => onChange('lakh_cr')}
        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
          unit === 'lakh_cr' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        ₹ Lakh Cr
      </button>
    </div>
  )
}

