/**
 * Instrument domain types — the core shared model.
 * Every other terminal type references this.
 */

export type InstrumentType = 'equity' | 'index' | 'futures' | 'options'

export interface Instrument {
    symbol: string           // underlying: "RELIANCE", "NIFTY", "BANKNIFTY"
    tradingSymbol?: string   // contract trading symbol: "NIFTY11AUG2624000CE"
    displayName: string      // human label: "NIFTY FUT", "NIFTY 25000 CE", "RELIANCE"
    type: InstrumentType
    exchange: string         // "NSE" | "BSE"
    // options fields
    strike?: number
    optionType?: 'CE' | 'PE'
    expiry?: string          // ISO date
    // futures fields
    contractExpiry?: string  // ISO date; undefined = front-month
    // metadata
    lotSize?: number
    name?: string            // full company name
    // instrument master fields (new — additive)
    token?: string           // exchange token for direct provider calls
    segment?: string         // raw segment, e.g. "NFO" — for Definedge history URL
    tickSize?: number
    company?: string         // full company / index name
}

/** Null-object for "no instrument selected" state */
export const NO_INSTRUMENT: Instrument | null = null
