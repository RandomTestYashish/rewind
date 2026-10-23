import { describe, expect, it } from "vitest"
import { ICONS, MASCOT, PALETTE } from "./sprites"

describe("pixel sprites", () => {
  const all = { MASCOT, ...ICONS }

  it.each(Object.entries(all))("%s is a rectangle using known colours", (_, sprite) => {
    const width = sprite[0].length
    for (const row of sprite) {
      expect(row).toHaveLength(width)
      for (const cell of row) if (cell !== ".") expect(PALETTE).toHaveProperty(cell)
    }
  })
})
