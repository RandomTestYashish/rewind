import type { ReactNode } from "react"
import { ArrowRight, Share2 } from "lucide-react"
import { Callout } from "@/components/theme/Callout"
import { Button } from "@/components/ui/button"
import type { ShareCardVariant } from "@/components/share/ShareCard"
import type { RewindData } from "@/data/rewind"
import { formatHours, formatINR, formatNumber } from "@/lib/format"
import type { StorySlide } from "./StoryViewer"

export interface SlideActions {
  onStart: () => void
  onShare: (variant: ShareCardVariant) => void
  onOpenSupport: (tab: "overview" | "report") => void
  onFinish: () => void
}

interface SlideFrameProps {
  quip: ReactNode
  eyebrow: string
  children: ReactNode
  actions?: ReactNode
}

/** Every slide shares this layout: one bordered white panel, type centred, actions at the foot. */
function SlideFrame({ quip, eyebrow, children, actions }: SlideFrameProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-box">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-6 text-center">
          <p className="font-pixel-label text-xs text-muted-foreground uppercase">{eyebrow}</p>
          <div className="mt-2 flex w-full flex-col items-center">{children}</div>
          <Callout className="mt-7 w-full">{quip}</Callout>
        </div>
        {actions && <div className="flex flex-col gap-3 px-5 pt-2 pb-5">{actions}</div>}
      </div>
    </div>
  )
}

function BigNumber({ value, unit }: { value: string; unit?: string }) {
  return (
    <p className="font-serif text-[76px] leading-none tracking-tight">
      {value}
      {unit && <span className="ml-1.5 text-3xl">{unit}</span>}
    </p>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-muted-foreground">{children}</p>
}

function Facts({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="mt-6 grid w-full grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-card px-3 py-2.5 px-box">
          <div className="font-serif text-2xl leading-tight">{item.value}</div>
          <div className="font-pixel-label text-[11px] text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

function PrimaryAction({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Button variant="pixel" size="lg" className="pointer-events-auto h-12 w-full" onClick={onClick}>
      {children}
    </Button>
  )
}

function SecondaryAction({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Button variant="pixel-outline" size="lg" className="pointer-events-auto h-11 w-full font-serif text-base" onClick={onClick}>
      {children}
    </Button>
  )
}

function PixelBars({ months, peak }: { months: { month: string; dataGb: number }[]; peak: number }) {
  return (
    <div className="mt-6 flex h-24 w-full items-end gap-[5px]" role="img" aria-label="Monthly data use">
      {months.map((m) => (
        <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full"
            style={{
              height: `${Math.max(12, Math.round(((m.dataGb / peak) * 80) / 8) * 8)}px`,
              backgroundColor: m.dataGb === peak ? "#e40000" : "#c9bb9c",
              backgroundImage: "linear-gradient(transparent 6px, rgba(31,27,22,.25) 6px)",
              backgroundSize: "100% 8px",
              boxShadow: "0 0 0 2px #1f1b16",
            }}
          />
          <span className="font-pixel-label text-[9px] text-muted-foreground">{m.month[0]}</span>
        </div>
      ))}
    </div>
  )
}

export function buildSlides(data: RewindData, actions: SlideActions): StorySlide[] {
  const peak = Math.max(...data.data.monthly.map((m) => m.dataGb))
  const callDays = (data.calls.minutes / 60 / 24).toFixed(1)
  const fastest = Math.min(...data.support.tickets.map((t) => t.resolvedInHours))

  return [
    {
      id: "intro",
      label: "Intro",
      content: (
        <SlideFrame
          eyebrow={`${data.year} rewind`}
          quip={<>your {data.year}, rewound.</>}
          actions={<PrimaryAction onClick={actions.onStart}>Start my Rewind <ArrowRight /></PrimaryAction>}
        >
          <h1 className="font-serif text-[48px] leading-[1.02]">Hey {data.user.name},<br />what a year.</h1>
          <Lead>
            With Airtel since {data.user.memberSince}. Here's how {data.year} looked on {data.user.number}.
          </Lead>
          <p className="font-pixel-label mt-4 text-xs text-muted-foreground">tap right to continue · hold to pause</p>
        </SlideFrame>
      ),
    },
    {
      id: "data",
      label: "Data",
      content: (
        <SlideFrame
          eyebrow="Data you used"
          quip={<>{data.data.totalGb} GB?! that's a lot of reels.</>}
          actions={<PrimaryAction onClick={() => actions.onShare("data")}><Share2 /> Share this</PrimaryAction>}
        >
          <BigNumber value={String(data.data.totalGb)} unit="GB" />
          <Lead>Top {data.data.percentileRank}% of Airtel users. Biggest day: {data.data.peakDay}.</Lead>
          <PixelBars months={data.data.monthly} peak={peak} />
        </SlideFrame>
      ),
    },
    {
      id: "calls",
      label: "Calls",
      content: (
        <SlideFrame eyebrow="Time on calls" quip={<>you called {data.calls.topContactLabel} the most. good kid.</>}>
          <BigNumber value={formatNumber(data.calls.minutes)} unit="min" />
          <Lead>That's {callDays} days of talking, with {data.calls.uniqueContacts} different people.</Lead>
          <Facts
            items={[
              { label: "called most", value: data.calls.topContactLabel },
              { label: "longest call", value: `${data.calls.longestCallMins} min` },
            ]}
          />
        </SlideFrame>
      ),
    },
    {
      id: "entertainment",
      label: "Entertainment",
      content: (
        <SlideFrame eyebrow="Shows, films and music" quip={<>{formatNumber(data.entertainment.streamingHours)} hours of shows. popcorn budget: huge.</>}>
          <BigNumber value={formatNumber(data.entertainment.streamingHours)} unit="hrs" />
          <Lead>streamed, mostly on {data.entertainment.topApp}.</Lead>
          <Facts
            items={[
              { label: "songs played", value: formatNumber(data.entertainment.songsPlayed) },
              { label: "top genre", value: data.entertainment.topGenre },
            ]}
          />
        </SlideFrame>
      ),
    },
    {
      id: "value",
      label: "Recharges and rewards",
      content: (
        <SlideFrame eyebrow="Recharges and rewards" quip={<>you saved {formatINR(data.recharges.saved)}. treat yourself.</>}>
          <BigNumber value={formatINR(data.recharges.saved)} />
          <Lead>saved across {data.recharges.count} recharges on {data.recharges.favouritePack}.</Lead>
          <Facts
            items={[
              { label: "Thanks points", value: formatNumber(data.rewards.thanksPoints) },
              { label: "Thanks tier", value: data.rewards.tier },
            ]}
          />
        </SlideFrame>
      ),
    },
    {
      id: "network",
      label: "Network",
      content: (
        <SlideFrame eyebrow="Where we kept you connected" quip={<>{data.network.citiesConnected} cities. i followed you everywhere.</>}>
          <BigNumber value={String(data.network.citiesConnected)} unit="cities" />
          <Lead>and {data.network.roamingCountries} countries on roaming.</Lead>
          <div className="mt-6 w-full bg-card p-3 text-left px-box">
            <div className="flex justify-between">
              <span className="font-pixel-label text-xs">time on 5G</span>
              <span className="font-serif text-lg leading-none">{data.network.fiveGSharePct}%</span>
            </div>
            <div className="mt-2 flex gap-[3px]" aria-hidden>
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className="h-3 flex-1" style={{ background: i < Math.round(data.network.fiveGSharePct / 5) ? "#e40000" : "#e2d7bf" }} />
              ))}
            </div>
          </div>
        </SlideFrame>
      ),
    },
    {
      id: "support",
      label: "Support",
      content: (
        <SlideFrame
          eyebrow="When you needed us"
          quip={<>{data.support.tickets.length} hiccups, all fixed. we had your back.</>}
          actions={
            <>
              <PrimaryAction onClick={() => actions.onOpenSupport("overview")}>
                See my support report <ArrowRight />
              </PrimaryAction>
              <SecondaryAction onClick={() => actions.onOpenSupport("report")}>Something not right? Report it</SecondaryAction>
            </>
          }
        >
          <BigNumber value={String(data.support.avgResolutionHours)} unit="hrs" />
          <Lead>
            average time to fix your {data.support.tickets.length} requests. {data.support.firstContactResolutionPct}% fixed on the first try.
          </Lead>
          <Facts
            items={[
              { label: "your avg rating", value: `${data.support.csat} ★` },
              { label: "fastest fix", value: formatHours(fastest) },
            ]}
          />
        </SlideFrame>
      ),
    },
    {
      id: "summary",
      label: "Your year",
      content: (
        <SlideFrame
          eyebrow={`Your ${data.year} persona`}
          quip={data.persona.tagline}
          actions={
            <>
              <PrimaryAction onClick={() => actions.onShare("summary")}><Share2 /> Share my Rewind</PrimaryAction>
              <SecondaryAction onClick={actions.onFinish}>Invite friends <ArrowRight /></SecondaryAction>
            </>
          }
        >
          <h2 className="font-serif text-[46px] leading-[1.02]">{data.persona.title}</h2>
          <div className="mt-6 grid w-full grid-cols-4 gap-2">
            {[
              { label: "data", value: `${data.data.totalGb}GB` },
              { label: "minutes", value: `${(data.calls.minutes / 1000).toFixed(1)}k` },
              { label: "hours", value: String(data.entertainment.streamingHours) },
              { label: "saved", value: `₹${(data.recharges.saved / 1000).toFixed(1)}k` },
            ].map((item) => (
              <div key={item.label} className="bg-card px-1.5 py-2 text-center px-box">
                <div className="font-serif text-lg leading-tight">{item.value}</div>
                <div className="font-pixel-label text-[10px] text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </SlideFrame>
      ),
    },
  ]
}
