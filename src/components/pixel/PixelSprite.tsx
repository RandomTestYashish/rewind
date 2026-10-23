import { PALETTE, type Sprite } from "./sprites"
import { cn } from "@/lib/utils"

interface PixelSpriteProps {
  sprite: Sprite
  /** Size of one sprite pixel in CSS px. */
  scale?: number
  className?: string
  title?: string
}

export function PixelSprite({ sprite, scale = 4, className, title }: PixelSpriteProps) {
  const width = sprite[0]?.length ?? 0
  const height = sprite.length
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width * scale}
      height={height * scale}
      className={cn("pixelated shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {sprite.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PALETTE[cell]} />,
        ),
      )}
    </svg>
  )
}
