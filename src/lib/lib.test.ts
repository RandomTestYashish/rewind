import { describe, expect, it } from "vitest"
import { formatHours, formatINR, formatNumber } from "./format"
import { loadReports, saveReport } from "./reports"
import { channelUrl, slugify } from "./share"

describe("format", () => {
  it("formats rupees and Indian digit grouping", () => {
    expect(formatINR(13188)).toBe("₹13,188")
    expect(formatNumber(1234567)).toBe("12,34,567")
  })

  it("formats hours, using minutes under an hour", () => {
    expect(formatHours(0.5)).toBe("30 min")
    expect(formatHours(18)).toBe("18 hr")
    expect(formatHours(6.5)).toBe("6.5 hr")
  })
})

describe("share helpers", () => {
  it("slugifies card labels for file names", () => {
    expect(slugify("Year summary")).toBe("year-summary")
    expect(slugify("  Data & Calls! ")).toBe("data-calls")
  })

  it("builds encoded channel links", () => {
    expect(channelUrl("whatsapp", "Hi there", "https://x.y")).toBe("https://wa.me/?text=Hi%20there%20https%3A%2F%2Fx.y")
    expect(channelUrl("x", "Hi", "https://x.y")).toContain("url=https%3A%2F%2Fx.y")
    expect(channelUrl("telegram", "Hi", "https://x.y")).toMatch(/^https:\/\/t\.me\/share\/url/)
    expect(channelUrl("sms", "Hi", "https://x.y")).toMatch(/^sms:/)
  })
})

describe("support reports", () => {
  it("saves reports newest first with a ticket id", () => {
    const first = saveReport({ category: "network", details: "Slow at home", contact: "sms", attachSnapshot: false })
    const second = saveReport({ category: "billing", details: "Charged twice", contact: "call", attachSnapshot: true })
    expect(first.id).toMatch(/^RW-\d{6}$/)
    expect(loadReports().map((r) => r.id)).toEqual([second.id, first.id])
  })

  it("survives corrupt storage", () => {
    localStorage.setItem("airtel-rewind:reports", "{not json")
    expect(loadReports()).toEqual([])
  })
})
