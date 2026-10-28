const test = require('node:test')
const assert = require('node:assert')

// Pure JS replicas of formatters for testing logic
function formatCr(value) {
  if (value == null) return '—'
  if (Math.abs(value) >= 100000) {
    return `${(value / 100000).toFixed(2)} L cr`
  }
  return `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} cr`
}

function formatPct(value, decimals = 2) {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}%`
}

test('formatCr formats numbers in crore and lakh crore', () => {
  assert.strictEqual(formatCr(null), '—')
  assert.strictEqual(formatCr(undefined), '—')
  assert.strictEqual(formatCr(5000), '5,000 cr')
  assert.strictEqual(formatCr(150000), '1.50 L cr')
  assert.strictEqual(formatCr(-250000), '-2.50 L cr')
})

test('formatPct formats percentages correctly', () => {
  assert.strictEqual(formatPct(null), '—')
  assert.strictEqual(formatPct(12.3456), '12.35%')
  assert.strictEqual(formatPct(0), '0.00%')
  assert.strictEqual(formatPct(-5.2, 1), '-5.2%')
})

