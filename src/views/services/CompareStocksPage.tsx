'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useStockCompare } from '../../hooks/useStockCompare'
import StockSearchPicker from '../../components/services/compare/StockSearchPicker'
import CompareChart from '../../components/services/compare/CompareChart'
import MetricsComparisonTable from '../../components/services/compare/MetricsComparisonTable'
import { easing } from '../../constans/animation'
export default function CompareStocksPage() {
    const title = 'Compare stocks'
    const subtitle = `Pick up to 3 stocks and compare their historical performance and key risk metrics side by side.`
    const { selected, availableResults, query, setQuery, addStock, removeStock, canAddMore, maxSelected } =
        useStockCompare()

    const ctaHeading = 'Want this analysis run on your own watchlist?'
    const ctaSubtitle = undefined
    const ctaLabel = 'Talk to us'
    const ctaUrl = '/contact'

    return (
        <div className="relative min-h-screen w-full pb-24 pt-32 sm:pt-36">
            <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
                <Link href="/services" scroll={false} className="mb-8 inline-flex items-center gap-2 text-xs text-[#DCE7E1]/70 hover:text-[#EAF1EC]">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Services
                </Link>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: easing }}
                        className="inline-block w-fit rounded-full bg-[#B8CEC2]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#B8CEC2]/80"
                    >
                        Service
                    </motion.span>
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: easing }}
                        className="text-shadow-soft text-sm text-[#DCE7E1]/80 sm:text-right"
                    >
                        Side-by-side, data-driven comparison
                    </motion.p>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easing, delay: 0.1 }}
                    className="text-shadow-soft mb-5 mt-4 max-w-xl font-body text-4xl font-light leading-[1.1] text-[#EAF1EC] sm:text-5xl"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easing, delay: 0.2 }}
                    className="text-shadow-soft max-w-lg text-sm leading-relaxed text-[#DCE7E1]/85 sm:text-base"
                >
                    {subtitle}
                </motion.p>

                <div className="mt-14 flex flex-col gap-8">
                    <StockSearchPicker
                        selected={selected}
                        availableResults={availableResults}
                        query={query}
                        onQueryChange={setQuery}
                        onAdd={addStock}
                        onRemove={removeStock}
                        canAddMore={canAddMore}
                        maxSelected={maxSelected}
                    />

                    {selected.length > 0 && (
                        <>
                            <CompareChart stocks={selected} />
                            <MetricsComparisonTable stocks={selected} />
                        </>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easing }}
                    viewport={{ once: true }}
                    className="cta-card mt-16 rounded-3xl p-8 text-center sm:p-10"
                >
                    <h2 className="mb-3 text-xl font-body font-semibold text-[#1B3236] sm:text-2xl">
                        {ctaHeading}
                    </h2>
                    {ctaSubtitle && <p className="mb-4 text-sm text-[#244147]/80">{ctaSubtitle}</p>}
                    <Link
                        href={ctaUrl}
                        scroll={false}
                        className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#244147] px-6 py-3 text-sm font-medium text-[#EAF1EC] transition-transform hover:scale-105"
                    >
                        {ctaLabel}
                    </Link>
                </motion.div>
            </div>

            <style>{`.text-shadow-soft { text-shadow: 0 2px 14px rgba(0,0,0,0.4); } .cta-card { background: rgba(184,206,194,0.92); border: 1px solid rgba(184,206,194,1); }`}</style>
        </div>
    )
}