import { forwardRef } from "react"
import { Gauge, Headphones, Phone, Sparkles, Wifi } from "lucide-react"
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

const BACKGROUNDS: Record<ShareCardVariant, string> = {
  summary: "linear-gradient(160deg,#e40000 0%,#8a0012 55%,#1a0006 100%)",
  data: "linear-gradient(160deg,#ff5a36 0%,#e40000 45%,#3b0010 100%)",
  persona: "linear-gradient(160deg,#6d28d9 0%,#be123c 60%,#1a0006 100%)",
  support: "linear-gradient(160deg,#0f766e 0%,#115e59 45%,#04201d 100%)",
  invite: "linear-gradient(160deg,#f59e0b 0%,#e40000 55%,#3b0010 100%)",
}

interface ShareCardProps {
  variant: ShareCardVariant
  data: RewindData
  className?: string
}

/** A 9:16 story card. 270×480 on screen, exported at 4× (1080×1920). */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { variant, data, className },
  ref,
) {
  return (
    <div
      ref={ref}
      data-testid={`share-card-${variant}`}
      className={cn("relative flex h-[480px] w-[270px] shrink-0 flex-col overflow-hidden rounded-3xl p-6 text-white", className)}
      style={{ background: BACKGROUNDS[variant] }}
    >
      <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/5" />
      <header className="relative flex items-center justify-between text-xs font-semibold tracking-wide">
        <span>airtel</span>
        <span className="rounded-full bg-white/15 px-2 py-0.5">Rewind {data.year}</span>
      </header>
      <div className="relative mt-6 flex flex-1 flex-col">
        <CardBody variant={variant} data={data} />
      </div>
      <footer className="relative mt-4 text-[10px] text-white/70">#AirtelRewind · airtel.in/rewind</footer>
    </div>
  )
})

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.12)" }}>
      <div className="text-lg leading-tight font-bold">{value}</div>
      <div className="text-[10px] text-white/75">{label}</div>
    </div>
  )
}

function CardBody({ variant, data }: { variant: ShareCardVariant; data: RewindData }) {
  switch (variant) {
    case "summary":
      return (
        <>
          <p className="text-sm text-white/80">{data.user.name}'s year on Airtel</p>
          <h3 className="mt-1 text-3xl leading-none font-black">{data.persona.title}</h3>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <Stat label="data used" value={`${data.data.totalGb} GB`} />
            <Stat label="minutes talked" value={formatNumber(data.calls.minutes)} />
            <Stat label="hours streamed" value={formatNumber(data.entertainment.streamingHours)} />
            <Stat label="saved on packs" value={formatINR(data.recharges.saved)} />
          </div>
        </>
      )
    case "data": {
      const max = Math.max(...data.data.monthly.map((m) => m.dataGb))
      return (
        <>
          <Wifi className="size-7" />
          <p className="mt-3 text-sm text-white/80">I used</p>
          <h3 className="text-6xl leading-none font-black">{data.data.totalGb}<span className="text-2xl"> GB</span></h3>
          <p className="mt-2 text-sm text-white/80">Top {data.data.percentileRank}% of Airtel users. Peak month: {data.data.peakMonth}.</p>
          <div className="mt-auto flex h-24 items-end gap-1">
            {data.data.monthly.map((m) => (
              <div
                key={m.month}
                className="flex-1 rounded-t"
                style={{ height: `${(m.dataGb / max) * 100}%`, background: m.dataGb === max ? "#fff" : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        </>
      )
    }
    case "persona":
      return (
        <>
          <Sparkles className="size-7" />
          <p className="mt-3 text-sm text-white/80">My 2026 Airtel persona</p>
          <h3 className="mt-1 text-4xl leading-none font-black">{data.persona.title}</h3>
          <p className="mt-3 text-sm text-white/85">{data.persona.tagline}</p>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <Stat label="top app" value={data.entertainment.topApp.replace("Airtel ", "")} />
            <Stat label="top genre" value={data.entertainment.topGenre} />
          </div>
        </>
      )
    case "support":
      return (
        <>
          <Headphones className="size-7" />
          <p className="mt-3 text-sm text-white/80">Airtel had my back</p>
          <h3 className="text-5xl leading-none font-black">{data.support.avgResolutionHours} hr</h3>
          <p className="mt-2 text-sm text-white/80">average time to fix my {data.support.tickets.length} requests this year</p>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <Stat label="fixed first time" value={`${data.support.firstContactResolutionPct}%`} />
            <Stat label="my avg rating" value={`${data.support.csat} ★`} />
          </div>
        </>
      )
    case "invite":
      return (
        <>
          <div className="flex gap-2">
            <Phone className="size-6" />
            <Gauge className="size-6" />
          </div>
          <p className="mt-3 text-sm text-white/80">Join me on Airtel</p>
          <h3 className="mt-1 text-4xl leading-none font-black">Get {data.referral.rewardPerFriend}</h3>
          <p className="mt-3 text-sm text-white/85">Use my code when you switch and we both get rewarded.</p>
          <div className="mt-auto rounded-2xl border border-dashed border-white/60 p-3 text-center">
            <div className="text-[10px] tracking-widest text-white/70 uppercase">Referral code</div>
            <div className="text-2xl font-black tracking-[0.2em]">{data.referral.code}</div>
          </div>
        </>
      )
  }
}
