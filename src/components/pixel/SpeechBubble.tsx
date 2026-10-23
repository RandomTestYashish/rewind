import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Notched white speech bubble with a stepped tail, as in the reference. */
export function SpeechBubble({ children, className, tail = "center" }: { children: ReactNode; className?: string; tail?: "center" | "left" }) {
  return (
    <div className={cn("relative bg-white px-4 py-2.5 text-center font-serif text-[17px] leading-snug text-[var(--ink)] px-notch", className)}>
      {children}
      <span className="animate-px-blink absolute right-2 bottom-1.5 size-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-[#e40000]" aria-hidden />
      <span
        aria-hidden
        className={cn("absolute -bottom-[9px] flex flex-col items-center", tail === "center" ? "left-1/2 -translate-x-1/2" : "left-8")}
      >
        <span className="block h-[3px] w-[15px] bg-white shadow-[-3px_0_0_0_var(--ink),3px_0_0_0_var(--ink)]" />
        <span className="block h-[3px] w-[9px] bg-white shadow-[-3px_0_0_0_var(--ink),3px_0_0_0_var(--ink)]" />
        <span className="block h-[3px] w-[3px] bg-[var(--ink)]" />
      </span>
    </div>
  )
}
