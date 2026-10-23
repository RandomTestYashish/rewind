import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Notched white box with a blinking red marker: the reference's bubble style, without the scene. */
export function Callout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative bg-white px-5 py-3 text-center font-serif text-[17px] leading-snug text-[var(--ink)] px-notch", className)}>
      {children}
      <span aria-hidden className="animate-px-blink absolute right-2 bottom-1.5 size-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-primary" />
    </div>
  )
}
