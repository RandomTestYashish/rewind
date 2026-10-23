import { act, fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { StoryViewer, type StorySlide } from "./StoryViewer"

const slides: StorySlide[] = ["One", "Two", "Three"].map((label) => ({
  id: label.toLowerCase(),
  label,
  background: "#000",
  content: <p>{label} content</p>,
}))

function Harness({ onComplete = () => {}, autoAdvanceMs = 0, paused = false }) {
  const [index, setIndex] = useState(0)
  return (
    <StoryViewer
      slides={slides}
      index={index}
      onIndexChange={setIndex}
      onComplete={onComplete}
      autoAdvanceMs={autoAdvanceMs}
      paused={paused}
    />
  )
}

describe("StoryViewer", () => {
  it("moves forward and back with the tap zones", () => {
    render(<Harness />)
    expect(screen.getByText("One content")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    expect(screen.getByText("Two content")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }))
    expect(screen.getByText("One content")).toBeInTheDocument()
  })

  it("supports arrow keys and completes after the last slide", () => {
    const onComplete = vi.fn()
    render(<Harness onComplete={onComplete} />)
    fireEvent.keyDown(window, { key: "ArrowRight" })
    fireEvent.keyDown(window, { key: "ArrowRight" })
    expect(screen.getByText("Three content")).toBeInTheDocument()
    expect(screen.getByLabelText(/slide 3 of 3/)).toBeInTheDocument()
    fireEvent.keyDown(window, { key: "ArrowRight" })
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("auto-advances on a timer and stops while paused", () => {
    vi.useFakeTimers()
    try {
      const { rerender } = render(<Harness autoAdvanceMs={1000} />)
      act(() => vi.advanceTimersByTime(1100))
      expect(screen.getByText("Two content")).toBeInTheDocument()
      rerender(<Harness autoAdvanceMs={1000} paused />)
      act(() => vi.advanceTimersByTime(5000))
      expect(screen.getByText("Two content")).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
