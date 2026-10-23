import { useCallback, useEffect, useState, type ReactNode } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface StorySlide {
  id: string
  label: string
  /** CSS background for the slide. Defaults to the paper colour. */
  background?: string
  content: ReactNode
}

interface StoryViewerProps {
  slides: StorySlide[]
  index: number
  onIndexChange: (index: number) => void
  /** Called when the user moves past the last slide. */
  onComplete: () => void
  /** Milliseconds per slide. 0 turns auto-advance off. */
  autoAdvanceMs?: number
  paused?: boolean
  headerActions?: ReactNode
}

const TICK_MS = 50

export function StoryViewer({
  slides,
  index,
  onIndexChange,
  onComplete,
  autoAdvanceMs = 7000,
  paused = false,
  headerActions,
}: StoryViewerProps) {
  const [elapsed, setElapsed] = useState(0)
  const [holding, setHolding] = useState(false)
  const slide = slides[index]

  const next = useCallback(() => {
    if (index < slides.length - 1) onIndexChange(index + 1)
    else onComplete()
  }, [index, slides.length, onIndexChange, onComplete])

  const previous = useCallback(() => {
    if (index > 0) onIndexChange(index - 1)
    else setElapsed(0)
  }, [index, onIndexChange])

  // Restart the timer whenever the slide changes
  const [shownIndex, setShownIndex] = useState(index)
  if (shownIndex !== index) {
    setShownIndex(index)
    setElapsed(0)
  }

  const running = autoAdvanceMs > 0 && !paused && !holding
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setElapsed((value) => value + TICK_MS), TICK_MS)
    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (autoAdvanceMs > 0 && elapsed >= autoAdvanceMs) next()
  }, [elapsed, autoAdvanceMs, next])

  useEffect(() => {
    if (paused) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault()
        next()
      } else if (event.key === "ArrowLeft") {
        previous()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, previous, paused])

  const progressFor = (i: number) => {
    if (i < index) return 100
    if (i > index) return 0
    return autoAdvanceMs > 0 ? Math.min(100, (elapsed / autoAdvanceMs) * 100) : 100
  }

  return (
    <section
      className="relative flex h-full flex-col overflow-hidden bg-background text-foreground"
      style={slide.background ? { background: slide.background } : undefined}
      aria-roledescription="story"
      aria-label={`Rewind story, slide ${index + 1} of ${slides.length}: ${slide.label}`}
      onPointerDown={() => setHolding(true)}
      onPointerUp={() => setHolding(false)}
      onPointerLeave={() => setHolding(false)}
    >
      <div className="relative z-20 flex gap-[5px] px-4 pt-3" aria-hidden>
        {slides.map((s, i) => (
          <Progress
            key={s.id}
            value={progressFor(i)}
            className="h-[6px] rounded-none bg-[var(--paper-2)] shadow-[0_0_0_2px_var(--ink)] [&>[data-slot=progress-indicator]]:bg-primary [&>[data-slot=progress-indicator]]:transition-none"
          />
        ))}
      </div>
      <div className="relative z-20 flex items-center justify-between px-4 pt-3 pb-3">
        <span className="font-pixel-label text-[13px]">
          <span className="font-semibold">airtel</span> rewind <span className="text-muted-foreground">· {String(index + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}</span>
        </span>
        <div className="flex items-center gap-2">{headerActions}</div>
      </div>

      {/* Tap zones sit under the content; content opts back in with pointer-events-auto */}
      <button type="button" aria-label="Previous slide" className="absolute inset-y-0 left-0 z-0 w-1/3 cursor-w-resize" onClick={previous} />
      <button type="button" aria-label="Next slide" className="absolute inset-y-0 right-0 z-0 w-2/3 cursor-e-resize" onClick={next} />

      <div
        key={slide.id}
        className={cn(
          "pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col",
          "animate-in duration-300 fade-in",
        )}
      >
        {slide.content}
      </div>
    </section>
  )
}
