import { createContext, useContext } from "react"

/**
 * Element that overlays (sheets, dialogs) portal into. Lets them stay inside
 * the phone frame on desktop instead of covering the whole browser window.
 */
export const PortalContainerContext = createContext<HTMLElement | null>(null)

export const usePortalContainer = () => useContext(PortalContainerContext) ?? undefined
