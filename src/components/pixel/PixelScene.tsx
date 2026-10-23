import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { PixelSprite } from "./PixelSprite"
import { ICONS, MASCOT, type IconName } from "./sprites"
import { SpeechBubble } from "./SpeechBubble"

export interface SceneTheme {
  wall: string
  floor: string
}

export const SCENES = {
  night: { wall: "#454a5a", floor: "#7a6047" },
  ember: { wall: "#6a3b35", floor: "#7a5a3c" },
  plum: { wall: "#4f3f5f", floor: "#6f5641" },
  teal: { wall: "#2f5753", floor: "#6f5a42" },
  sky: { wall: "#3c5675", floor: "#735b43" },
  gold: { wall: "#6b5532", floor: "#7d5e3e" },
} satisfies Record<string, SceneTheme>

export type SceneName = keyof typeof SCENES

interface PixelSceneProps {
  scene?: SceneName
  prop?: IconName
  quip?: ReactNode
  size?: "md" | "sm"
  className?: string
}

/**
 * A little pixel room: brick wall, night window, desk with a prop, lamp, rug,
 * and Ping the mascot with an optional speech bubble.
 */
export function PixelScene({ scene = "night", prop, quip, size = "md", className }: PixelSceneProps) {
  const theme = SCENES[scene]
  const sm = size === "sm"
  return (
    <div
      className={cn("relative w-full overflow-hidden border-y-[3px] border-[var(--ink)]", sm ? "h-[170px]" : "h-[clamp(170px,calc(100cqh-480px),320px)]", className)}
      style={{
        backgroundColor: theme.wall,
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.16) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,.12) 2px, transparent 2px)",
        backgroundSize: "48px 24px, 48px 48px",
      }}
    >
      {/* window */}
      <div
        className={cn("absolute left-1/2 -translate-x-1/2 border-[3px] border-[#2a2620] bg-[#1d2333]", sm ? "top-6 h-16 w-28" : "top-[22%] h-[30%] w-[44%]")}
      >
        <span className="absolute top-[20%] left-[18%] size-[3px] bg-[#f3e9c6]" />
        <span className="absolute top-[45%] left-[60%] size-[3px] bg-[#f3e9c6]" />
        <span className="absolute top-[15%] right-[14%] h-[10px] w-[16px] bg-[#f3e9c6]" />
        <span className="absolute bottom-0 left-0 h-[30%] w-full bg-[#2b3247]" style={{ clipPath: "polygon(0 40%,15% 40%,15% 10%,30% 10%,30% 55%,48% 55%,48% 0,62% 0,62% 45%,80% 45%,80% 20%,100% 20%,100% 100%,0 100%)" }} />
        <span className="absolute -bottom-[9px] -left-[12px] h-[6px] w-[calc(100%+24px)] bg-[#8d6b45]" />
      </div>

      {/* desk + prop */}
      {prop && (
        <div className={cn("absolute flex flex-col items-center", sm ? "bottom-[30%] left-4" : "bottom-[31%] left-[7%]")}>
          <div className="mb-1 grid place-items-center border-[3px] border-[#2a2620] bg-[#f2ead6] p-1.5">
            <PixelSprite sprite={ICONS[prop]} scale={sm ? 2.5 : 3.5} />
          </div>
          <div className={cn("h-[6px] bg-[#8a5a2b] shadow-[0_3px_0_0_#5e3a17]", sm ? "w-14" : "w-20")} />
          <div className={cn("flex justify-between", sm ? "w-12" : "w-16")}>
            <span className="h-4 w-[5px] bg-[#5e3a17]" />
            <span className="h-4 w-[5px] bg-[#5e3a17]" />
          </div>
        </div>
      )}

      {/* lamp */}
      {!sm && (
        <div className="absolute right-[8%] bottom-[31%] flex flex-col items-center" aria-hidden>
          <div className="size-9 rounded-full border-[3px] border-[#7a4f1d] bg-[#ffe8a8] shadow-[0_0_24px_6px_rgba(255,220,140,.35)]" />
          <span className="h-10 w-[5px] bg-[#c08a3e]" />
          <span className="h-[5px] w-6 bg-[#7a4f1d]" />
        </div>
      )}

      {/* floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[31%] border-t-[3px] border-[#2a2620]"
        style={{
          backgroundColor: theme.floor,
          backgroundImage: "linear-gradient(rgba(0,0,0,.18) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,.14) 2px, transparent 2px)",
          backgroundSize: "64px 18px, 64px 36px",
        }}
      />
      {/* rug */}
      <div className={cn("absolute bottom-[12%] left-1/2 -translate-x-1/2 border-[3px] border-[#a5793f] bg-[#c9974f]", sm ? "h-3 w-24" : "h-4 w-36")} />

      {/* mascot */}
      <div className={cn("animate-px-bob absolute left-1/2 -translate-x-1/2", sm ? "bottom-[16%]" : "bottom-[15%]")}>
        <PixelSprite sprite={MASCOT} scale={sm ? 4 : 6} title="Ping, the Airtel Rewind mascot" />
      </div>

      {quip && (
        <SpeechBubble className={cn("absolute left-1/2 w-[86%] -translate-x-1/2", sm ? "top-2 py-1.5 text-[13px]" : "top-3")}>
          {quip}
        </SpeechBubble>
      )}
    </div>
  )
}
