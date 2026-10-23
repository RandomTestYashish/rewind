/**
 * Pixel sprites as rows of characters. Each character maps to a colour in
 * PALETTE; "." is transparent. Every row in a sprite must be the same width.
 */
export const PALETTE: Record<string, string> = {
  K: "#1f1b16", // ink outline
  R: "#e40000", // Airtel red
  D: "#a30000", // shade red
  L: "#ff6b5b", // highlight red
  W: "#ffffff",
  P: "#ff9fb0", // cheek
  Y: "#ffc93c",
  O: "#e8902a",
  B: "#5aa9e6",
  N: "#2f6f9f",
  G: "#7fbf6a",
  S: "#c9bb9c", // stone
  T: "#8a5a2b", // wood
}

export type Sprite = readonly string[]

/** Ping, the Rewind mascot: a little red signal bot. */
export const MASCOT: Sprite = [
  ".......YY.......",
  ".......KK.......",
  "......KRRK......",
  "...KKKKKKKKKK...",
  "..KLLRRRRRRRRK..",
  "..KLWWRRRRWWRK..",
  "..KRWKRRRRWKRK..",
  "..KRRRRRRRRRRK..",
  "..KPPRKRRKRPPK..",
  "..KRRRRKKRRRRK..",
  "..KDRRRRRRRRDK..",
  "..KDDRRRRRRDDK..",
  "...KKKKKKKKKK...",
  "....KDK..KDK....",
  "....KKK..KKK....",
]

const bars = (): string[] => {
  const heights = [3, 5, 7, 9]
  return Array.from({ length: 9 }, (_, row) =>
    heights
      .map((h) => (row >= 9 - h ? "RR" : ".."))
      .join(".")
      .padEnd(11, "."),
  )
}

export const ICONS = {
  data: bars(),
  phone: [
    "KK.......",
    "KRK......",
    "KRRK.....",
    ".KRK.....",
    "..KRK....",
    "...KRK.KK",
    "....KRKRK",
    ".....KRRK",
    "......KK.",
  ],
  tv: [
    "..K.....K..",
    "...K...K...",
    "KKKKKKKKKKK",
    "KBBBBBBBBBK",
    "KBWBBBBBBBK",
    "KBBBBBBNNBK",
    "KBBBBBBNNBK",
    "KKKKKKKKKKK",
    "..KK...KK..",
  ],
  gift: [
    "..KK.KK..",
    ".KRRKRRK.",
    "KKKKKKKKK",
    "KRRRYRRRK",
    "KKKKYKKKK",
    ".KRRYRRK.",
    ".KRRYRRK.",
    ".KRRYRRK.",
    ".KKKKKKK.",
  ],
  pin: [
    "..KKK..",
    ".KRRRK.",
    "KRRWRRK",
    "KRWWWRK",
    "KRRWRRK",
    ".KRRRK.",
    ".KRRRK.",
    "..KRK..",
    "..KRK..",
    "...K...",
  ],
  headset: [
    "...KKKKK...",
    "..K.....K..",
    ".K.......K.",
    ".K.......K.",
    "KRK.....KRK",
    "KRK.....KRK",
    "KRK.....KRK",
    ".K.....KK..",
    ".......KK..",
  ],
  star: [
    "....K....",
    "...KYK...",
    "KKKKYKKKK",
    "KYYYYYYYK",
    ".KYYYYYK.",
    "..KYYYK..",
    ".KYYKYYK.",
    ".KYK.KYK.",
    ".KK...KK.",
  ],
  heart: [
    ".KK...KK.",
    "KRRK.KRRK",
    "KRWRKRRRK",
    "KRRRRRRRK",
    ".KRRRRRK.",
    "..KRRRK..",
    "...KRK...",
    "....K....",
  ],
} satisfies Record<string, Sprite>

export type IconName = keyof typeof ICONS
