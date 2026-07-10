import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Search } from 'lucide-react'
import type { StockSearchPickerProps } from '../../../types/compareStocks'
import { easing } from '../../../constans/animation'

export default function StockSearchPicker({
    selected, availableResults, query, onQueryChange, onAdd, onRemove, canAddMore, maxSelected,
}: StockSearchPickerProps) {
    return (
        <div className="picker-card rounded-3xl p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-[#244147]/60">
                    Comparing {selected.length} of {maxSelected}
                </p>
            </div>

            {/* Selected chips — staggered pop in/out */}
            <div className="mb-5 flex flex-wrap gap-2.5">
                <AnimatePresence mode="popLayout">
                    {selected.map((stock) => (
                        <motion.button
                            key={stock.symbol}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                            onClick={() => onRemove(stock.symbol)}
                            className="stock-chip group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
                            style={{ borderColor: `${stock.color}55` }}
                        >
                            <span className="h-2 w-2 rounded-full" style={{ background: stock.color }} />
                            {stock.symbol}
                            <X className="h-3 w-3 text-[#244147]/50 transition-colors group-hover:text-[#244147]" />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {canAddMore ? (
                <div className="relative">
                    <div className="search-field flex items-center gap-3 rounded-full px-4 py-3">
                        <Search className="h-4 w-4 flex-shrink-0 text-[#244147]/60" />
                        <input
                            value={query}
                            onChange={(e) => onQueryChange(e.target.value)}
                            placeholder="Search by symbol or name..."
                            className="w-full bg-transparent text-sm text-[#1B3236] outline-none placeholder:text-[#244147]/40"
                        />
                    </div>

                    {/* Layered Reveal — results drop in as a layered list */}
                    <AnimatePresence>
                        {query.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: easing }}
                                className="results-panel absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-2xl p-2"
                            >
                                {availableResults.length === 0 ? (
                                    <p className="px-3 py-4 text-center text-xs text-[#244147]/50">No matching stocks</p>
                                ) : (
                                    availableResults.map((stock, i) => (
                                        <motion.button
                                            key={stock.symbol}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, ease: easing, delay: i * 0.03 }}
                                            onClick={() => onAdd(stock.symbol)}
                                            className="result-row flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-[#1B3236]">{stock.symbol}</p>
                                                <p className="text-xs text-[#244147]/55">{stock.name}</p>
                                            </div>
                                            <Plus className="h-4 w-4 text-[#244147]/50" />
                                        </motion.button>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <p className="text-xs text-[#244147]/50">
                    Maximum of {maxSelected} stocks reached — remove one to add another.
                </p>
            )}

            <style>{`
        .picker-card { background: rgba(184,206,194,0.92); border: 1px solid rgba(184,206,194,1); box-shadow: 0 2px 16px rgba(18,33,36,0.22); }
        .stock-chip { background: rgba(18,33,36,0.06); border: 1.5px solid; color: #1B3236; transition: background 0.2s ease; }
        .stock-chip:hover { background: rgba(18,33,36,0.12); }
        .search-field { background: rgba(18,33,36,0.06); border: 1px solid rgba(36,65,71,0.18); }
        .results-panel { background: rgba(184,206,194,0.98); border: 1px solid rgba(184,206,194,1); box-shadow: 0 20px 45px -15px rgba(18,33,36,0.4); }
        .result-row { transition: background 0.15s ease; }
        .result-row:hover { background: rgba(18,33,36,0.06); }
      `}</style>
        </div>
    )
}