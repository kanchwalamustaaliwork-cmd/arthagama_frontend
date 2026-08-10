import { apiGet } from '@/src/api/axios'
import { CompanyFundamentals, Instrument } from '@/src/types/terminal'

export async function getFundamentals(instrument: Instrument): Promise<CompanyFundamentals> {
    const res = await apiGet<CompanyFundamentals>(`/terminal/fundamentals/${instrument.symbol}`, {
        params: { exchange: instrument.exchange },
    })
    return res.data
}
