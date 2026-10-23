import { forwardRef, type ReactNode } from "react"
import { PixelScene, type SceneName } from "@/components/pixel/PixelScene"
import type { IconName } from "@/components/pixel/sprites"
import type { RewindData } from "@/data/rewind"
import { formatINR, formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export type ShareCardVariant = "summary" | "data" | "persona" | "support" | "invite"

export const SHARE_CARD_LABELS: Record<ShareCardVariant, string> = {
  summary: "Year summary",
  data: "Data",
  persona: "Persona",
  support: "Support",
  invite: "Invite",
}

interface ShareCardProps {
  variant: ShareCardVariant
  data: RewindData
  className?: string
}

interface CardContent {
  scene: SceneName
  prop: IconName
  quip: string
  eyebrow: string
  headline: ReactNode
  body?: string
  stats?: { label: string; value: string }[]
  footer?: ReactNode
}

function content(variant: ShareCardVariant, data: RewindData): CardContent {
  switch (variant) {
    case "summary":
      return {
        scene: "ember",
        prop: "star",
        quip: `${data.user.name.toLowerCase()}'s ${data.year}, rewound.`,
        eyebrow: "my year on airtel",
        headline: data.persona.title,
        stats: [
          { label: "data used", value: `${data.data.totalGb} GB` },
          { label: "minutes", value: formatNumber(data.calls.minutes) },
          { label: "hrs streamed", value: formatNumber(data.entertainment.streamingHours) },
          { label: "saved", value: formatINR(data.recharges.saved) },
        ],
      }
    case "data":
      return {
        scene: "ember",
        prop: "data",
        quip: "that's a lot of reels.",
        eyebrow: "data i used",
        headline: <>{data.data.totalGb}<span className="text-2xl"> GB</span></>,
        body: `Top ${data.data.percentileRank}% of Airtel users. Peak month: ${data.data.peakMonth}.`,
      }
    case "persona":
      return {
        scene: "plum",
        prop: "tv",
        quip: "popcorn budget: huge.",
        eyebrow: `my ${data.year} persona`,
        headline: data.persona.title,
        body: data.persona.tagline,
      }
    case "support":
      return {
        scene: "teal",
        prop: "headset",
        quip: "airtel had my back.",
        eyebrow: "avg. time to fix",
        headline: <>{data.support.avgResolutionHours}<span className="text-2xl"> hrs</span></>,
        stats: [
          { label: "fixed first time", value: `${data.support.firstContactResolutionPct}%` },
          { label: "my rating", value: `${data.support.csat} ★` },
        ],
      }
    case "invite":
      return {
        scene: "gold",
        prop: "heart",
        quip: "join me on airtel?",
        eyebrow: "switch with my code",
        headline: <>Get {data.referral.rewardPerFriend}</>,
        body: "Use my code when you switch to Airtel and we both get rewarded.",
        footer: (
          <div className="mt-3 border-2 border-dashed border-[var(--ink)] bg-white py-1.5 text-center">
            <div className="font-pixel-label text-[9px] text-muted-foreground uppercase">referral code</div>
            <div className="font-serif text-2xl tracking-[0.2em]">{data.referral.code}</div>
          </div>
        ),
      }
  }
}

/** A 9:16 story card. 270×480 on screen, exported at 4× (1080×1920). */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard({ variant, data, className }, ref) {
  const c = content(variant, data)
  return (
    <div
      ref={ref}
      data-testid={`share-card-${variant}`}
      className={cn("relative flex h-[480px] w-[270px] shrink-0 flex-col overflow-hidden bg-[var(--paper)] text-[var(--ink)]", className)}
      style={{ border: "6px solid #8a5a2b", outline: "2px solid #1f1b16", outlineOffset: "-2px" }}
    >
      <header className="flex items-baseline justify-between border-b-2 border-[var(--ink)] bg-[#efe6d2] px-3 py-1.5">
        <span className="font-serif text-lg leading-none">airtel rewind</span>
        <span className="font-pixel-label text-[11px] font-semibold">{data.year}</span>
      </header>
      <PixelScene size="sm" scene={c.scene} prop={c.prop} quip={c.quip} className="border-t-0" />
      <div className="flex flex-1 flex-col px-4 pt-3 pb-3">
        <p className="font-pixel-label text-[10px] text-muted-foreground uppercase">{c.eyebrow}</p>
        <h3 className="mt-0.5 font-serif text-[38px] leading-[1]">{c.headline}</h3>
        {c.body && <p className="mt-2 text-[12px] leading-snug text-muted-foreground">{c.body}</p>}
        {c.stats && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {c.stats.map((s) => (
              <div key={s.label} className="border-2 border-[var(--ink)] bg-white px-2 py-1.5">
                <div className="font-serif text-lg leading-tight">{s.value}</div>
                <div className="font-pixel-label text-[9px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {c.footer}
        <footer className="font-pixel-label mt-auto pt-2 text-[9px] text-muted-foreground">#AirtelRewind · airtel.in/rewind</footer>
      </div>
    </div>
  )
})
