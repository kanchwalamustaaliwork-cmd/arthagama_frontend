import { apiGet } from '@/src/api/axios'
import { MacroSnapshot, MacroTile, MacroDetail } from '@/src/types/terminal'

export async function getMacroSnapshot(): Promise<MacroTile[]> {
    const res = await apiGet<MacroSnapshot>('/terminal/macro/snapshot')
    return res.data.tiles || []
}

export async function getMacroDetail(name: string): Promise<MacroDetail> {
    const res = await apiGet<MacroDetail>(`/terminal/macro/detail/${name}`)
    return res.data
}
