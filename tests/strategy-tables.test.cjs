/**
 * Strategy dashboard tables rendered from real API payloads
 * (fixtures/strategy-payloads.json = backend holdings/trades responses for
 * demarker, VixStraddle, DumbStraddle, spdl and HekinASHI).
 *
 * Run: npm test
 */
const test = require('node:test')
const assert = require('node:assert/strict')
const { render, rows } = require('./render-harness.cjs')
const payloads = require('./fixtures/strategy-payloads.json')

const holdingsRows = (holdings, ltpMap = {}) =>
    rows(render('src/components/admin/HoldingsTable.tsx', { holdings, ltpMap }))

const tradeRows = trades =>
    rows(render('src/components/admin/TradesTable.tsx', {
        trades, total: trades.length, page: 1, hasMore: false, search: '', action: 'all', tradeStatus: 'all',
        onSearchChange() {}, onActionChange() {}, onTradeStatusChange() {}, onPageChange() {},
    }))

const tick = (ticker, latestPrice, pnl) => ({ ticker, latestPrice, pnl, timestamp: '', isHolding: true })

test('equity holdings keep the equity layout and take live price/P&L by priceKey', () => {
    const [header, bse] = holdingsRows(payloads.demarker.holdings, { 'BSE-EQ': tick('BSE-EQ', 3700, 12.1) })
    assert.equal(header, 'Stock | Qty | Initial Qty | Avg Buy Price | LTP | PnL | Buy Date | Duration')
    assert.match(bse, /^BSE-EQ \| 1 \| 1 \| ₹3,687\.90 \| ₹3,700\.00 \| \+₹12\.10 \| \S+ \| 70d$/)
})

test('option legs show contract, direction and expiry and are never priced by their underlying', () => {
    const [header, ce, pe] = holdingsRows(payloads.VixStraddle.holdings, { NIFTY: tick('NIFTY', 24000, 999) })
    assert.equal(header, 'Instrument | Side | Expiry | Qty | Avg Price | LTP | PnL | Entry Date | Duration')
    assert.match(ce, /^NIFTY 23900 CE \| SHORT \| 15\/9\/2026 \| 130 \| ₹4\.50 \| — \| — \|/)
    assert.match(pe, /^NIFTY 22800 PE ⚠ \| SHORT \| 15\/9\/2026 \| 65 \|/)
})

test('data-quality warnings from the backend are surfaced, not hidden', () => {
    const html = render('src/components/admin/HoldingsTable.tsx', { holdings: payloads.DumbStraddle.holdings })
    assert.match(html, /Contract has expired but the strategy still marks this leg open/)
})

test('empty holdings render the empty message in either layout', () => {
    assert.deepEqual(holdingsRows(payloads.spdl.holdings).slice(1), ['No holdings found'])
})

test('equity trades: SELL closes with realized P&L', () => {
    assert.ok(tradeRows(payloads.demarker.trades).some(r =>
        /^HBLENGINE-EQ \| SELL Exit \| 6 \| ₹737\.35 \| ₹4,424\.10 \| -₹162\.00 \|/.test(r)))
})

test('short option legs: ENTRY is a SELL, EXIT is a BUY carrying the reported P&L', () => {
    const r = tradeRows(payloads.VixStraddle.trades)
    assert.ok(r.some(row => /^NIFTY 23900 CE \| SELL Entry \| 130 \| ₹4\.50 \| ₹585\.00 \| — \|/.test(row)))
    assert.ok(r.some(row => /^BSESEN 76800 CE TIME \| BUY Exit \| 40 \| ₹0\.00 \| ₹0\.00 \| \+₹2,044\.00 \|/.test(row)))
})

test('multi-leg strangle renders both legs with per-leg prices and no fake quantity', () => {
    assert.ok(tradeRows(payloads.spdl.trades).some(r =>
        /^NIFTY 24300 CE \/ NIFTY 24100 PE STOP_LOSS \| SELL Exit \| — \| 12\.65 \/ 5\.55 \| — \| -₹319\.56 \|/.test(r)))
})

test('futures: a BUY that covers a short is an exit with direction-aware P&L', () => {
    const r = tradeRows(payloads.HekinASHI.trades)
    assert.ok(r.some(row => /^NIFTY FUT \| SELL Entry \| 65 \| ₹25,191\.10 \|/.test(row)))
    assert.ok(r.some(row => /^NIFTY FUT \| BUY Exit \| 75 \| ₹26,184\.90 \| ₹19,63,867\.50 \| -₹14,325\.00 \|/.test(row)))
})
