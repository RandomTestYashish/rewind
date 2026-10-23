import type { ReactNode } from "react"
import { ArrowRight, Clapperboard, Gift, Headphones, MapPin, PhoneCall, Share2, Sparkles, Wifi } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ShareCardVariant } from "@/components/share/ShareCard"
import type { RewindData } from "@/data/rewind"
import { formatHours, formatINR, formatNumber } from "@/lib/format"
import type { StorySlide } from "./StoryViewer"

export interface SlideActions {
  onShare: (variant: ShareCardVariant) => void
  onOpenSupport: (tab: "overview" | "report") => void
  onFinish: () => void
}

const RED = "radial-gradient(120% 80% at 20% 0%,#ff3b3b 0%,#e40000 40%,#5c0010 100%)"

function Eyebrow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-white/80 [&_svg]:size-5">
      {icon}
      {children}
    </div>
  )
}

function BigNumber({ value, unit }: { value: string; unit?: string }) {
  return (
    <p className="mt-3 text-7xl leading-none font-black tracking-tight">
      {value}
      {unit && <span className="ml-1 text-3xl font-bold">{unit}</span>}
    </p>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/12 p-4 backdrop-blur-sm">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-white/75">{label}</div>
    </div>
  )
}

function ShareButton({ onClick, label = "Share this" }: { onClick: () => void; label?: string }) {
  return (
    <Button
      variant="secondary"
      size="lg"
      className="pointer-events-auto h-11 rounded-full bg-white text-neutral-900 hover:bg-white/90"
      onClick={onClick}
    >
      <Share2 /> {label}
    </Button>
  )
}

export function buildSlides(data: RewindData, actions: SlideActions): StorySlide[] {
  const maxMonth = Math.max(...data.data.monthly.map((m) => m.dataGb))
  const callDays = (data.calls.minutes / 60 / 24).toFixed(1)

  return [
    {
      id: "intro",
      label: "Intro",
      background: RED,
      content: (
        <div className="flex flex-1 flex-col">
          <Badge className="w-fit bg-white/15 text-white">{data.year} Rewind</Badge>
          <h1 className="mt-6 text-5xl leading-[0.95] font-black">
            Hey {data.user.name},<br />what a year.
          </h1>
          <p className="mt-4 text-lg text-white/85">
            You've been with Airtel since {data.user.memberSince}. Here's how {data.year} looked on your number {data.user.number}.
          </p>
          <p className="mt-auto text-sm text-white/70">Tap the right side to continue, or hold to pause.</p>
        </div>
      ),
    },
    {
      id: "data",
      label: "Data",
      background: "linear-gradient(170deg,#ff6a3d 0%,#e40000 50%,#3b0010 100%)",
      content: (
        <div className="flex flex-1 flex-col">
          <Eyebrow icon={<Wifi />}>Data you used</Eyebrow>
          <BigNumber value={String(data.data.totalGb)} unit="GB" />
          <p className="mt-3 text-white/85">
            That puts you in the top {data.data.percentileRank}% of Airtel users. Your biggest day was {data.data.peakDay}.
          </p>
          <div className="mt-8 flex h-40 items-end gap-1.5" role="img" aria-label={`Monthly data use, peak in ${data.data.peakMonth}`}>
            {data.data.monthly.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md"
                  style={{ height: `${(m.dataGb / maxMonth) * 128}px`, background: m.dataGb === maxMonth ? "#fff" : "rgba(255,255,255,0.35)" }}
                />
                <span className="text-[9px] text-white/70">{m.month[0]}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <ShareButton onClick={() => actions.onShare("data")} />
          </div>
        </div>
      ),
    },
    {
      id: "calls",
      label: "Calls",
      background: "linear-gradient(170deg,#1e3a8a 0%,#7f1d1d 70%,#1a0006 100%)",
      content: (
        <div className="flex flex-1 flex-col">
          <Eyebrow icon={<PhoneCall />}>Time on calls</Eyebrow>
          <BigNumber value={formatNumber(data.calls.minutes)} unit="min" />
          <p className="mt-3 text-white/85">That's {callDays} days of talking, with {data.calls.uniqueContacts} different people.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Fact label="called most" value={data.calls.topContactLabel} />
            <Fact label="longest call" value={`${data.calls.longestCallMins} min`} />
          </div>
        </div>
      ),
    },
    {
      id: "entertainment",
      label: "Entertainment",
      background: "linear-gradient(170deg,#6d28d9 0%,#be123c 60%,#1a0006 100%)",
      content: (
        <div className="flex flex-1 flex-col">
          <Eyebrow icon={<Clapperboard />}>Shows, films and music</Eyebrow>
          <BigNumber value={formatNumber(data.entertainment.streamingHours)} unit="hrs" />
          <p className="mt-3 text-white/85">streamed, mostly on {data.entertainment.topApp}. Your go-to genre: {data.entertainment.topGenre}.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Fact label="songs played" value={formatNumber(data.entertainment.songsPlayed)} />
            <Fact label="top genre" value={data.entertainment.topGenre} />
          </div>
        </div>
      ),
    },
    {
      id: "value",
      label: "Recharges and rewards",
      background: "linear-gradient(170deg,#b45309 0%,#e40000 55%,#3b0010 100%)",
      content: (
        <div className="flex flex-1 flex-col">
          <Eyebrow icon={<Gift />}>Recharges and rewards</Eyebrow>
          <BigNumber value={formatINR(data.recharges.saved)} />
          <p className="mt-3 text-white/85">
            saved across {data.recharges.count} recharges. Favourite pack: {data.recharges.favouritePack}.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Fact label="Thanks points earned" value={formatNumber(data.rewards.thanksPoints)} />
            <Fact label="coupons redeemed" value={String(data.rewards.couponsRedeemed)} />
            <Fact label="total spent" value={formatINR(data.recharges.totalSpend)} />
            <Fact label="Thanks tier" value={data.rewards.tier} />
          </div>
        </div>
      ),
    },
    {
      id: "network",
      label: "Network",
      background: "linear-gradient(170deg,#0e7490 0%,#1e3a8a 60%,#0b1020 100%)",
      content: (
        <div className="flex flex-1 flex-col">
          <Eyebrow icon={<MapPin />}>Where we kept you connected</Eyebrow>
          <BigNumber value={String(data.network.citiesConnected)} unit="cities" />
          <p className="mt-3 text-white/85">and {data.network.roamingCountries} countries on roaming.</p>
          <div className="mt-8 rounded-2xl bg-white/12 p-4">
            <div className="flex justify-between text-sm">
              <span>Time on 5G</span>
              <span className="font-bold">{data.network.fiveGSharePct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${data.network.fiveGSharePct}%` }} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "support",
      label: "Support",
      background: "linear-gradient(170deg,#0f766e 0%,#115e59 50%,#04201d 100%)",
      content: (
        <div className="flex flex-1 flex-col">
          <Eyebrow icon={<Headphones />}>When you needed us</Eyebrow>
          <BigNumber value={String(data.support.avgResolutionHours)} unit="hrs" />
          <p className="mt-3 text-white/85">
            was the average time to fix your {data.support.tickets.length} requests. {data.support.firstContactResolutionPct}% were fixed on the first try.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Fact label="your average rating" value={`${data.support.csat} ★`} />
            <Fact label="fastest fix" value={formatHours(Math.min(...data.support.tickets.map((t) => t.resolvedInHours)))} />
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-6">
            <Button
              size="lg"
              className="pointer-events-auto h-11 rounded-full bg-white text-teal-900 hover:bg-white/90"
              onClick={() => actions.onOpenSupport("overview")}
            >
              See my support report <ArrowRight />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="pointer-events-auto h-11 rounded-full text-white hover:bg-white/10 hover:text-white"
              onClick={() => actions.onOpenSupport("report")}
            >
              Something not right? Report it
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "summary",
      label: "Your year",
      background: RED,
      content: (
        <div className="flex flex-1 flex-col">
          <Eyebrow icon={<Sparkles />}>Your {data.year} persona</Eyebrow>
          <h2 className="mt-3 text-5xl leading-[0.95] font-black">{data.persona.title}</h2>
          <p className="mt-3 text-white/85">{data.persona.tagline}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Fact label="data used" value={`${data.data.totalGb} GB`} />
            <Fact label="minutes talked" value={formatNumber(data.calls.minutes)} />
            <Fact label="hours streamed" value={formatNumber(data.entertainment.streamingHours)} />
            <Fact label="saved" value={formatINR(data.recharges.saved)} />
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-6">
            <ShareButton onClick={() => actions.onShare("summary")} label="Share my Rewind" />
            <Button
              variant="ghost"
              size="lg"
              className="pointer-events-auto h-11 rounded-full text-white hover:bg-white/10 hover:text-white"
              onClick={actions.onFinish}
            >
              Invite friends <ArrowRight />
            </Button>
          </div>
        </div>
      ),
    },
  ]
}
