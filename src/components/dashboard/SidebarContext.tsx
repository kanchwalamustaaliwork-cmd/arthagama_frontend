'use client'

import { createContext, useContext, useState } from 'react'

const SIDEBAR_EXPANDED = '240px'
const SIDEBAR_COLLAPSED = '64px'

interface SidebarContextValue {
    collapsed: boolean
    toggle: () => void
    sidebarW: string
}

const SidebarContext = createContext<SidebarContextValue>({
    collapsed: false,
    toggle: () => { },
    sidebarW: SIDEBAR_EXPANDED,
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <SidebarContext.Provider
            value={{
                collapsed,
                toggle: () => setCollapsed(c => !c),
                sidebarW: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
            }}
        >
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    return useContext(SidebarContext)
}