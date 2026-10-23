import { useMemo, useState } from "react"
import { Flag, Share2, X } from "lucide-react"
import { PortalContainerContext } from "@/components/portal-container"
import { InviteFriends } from "@/components/rewind/InviteFriends"
import { buildSlides } from "@/components/rewind/slides"
import { StoryViewer } from "@/components/rewind/StoryViewer"
import { SupportReportSheet } from "@/components/rewind/SupportReportSheet"
import { SHARE_CARD_LABELS, ShareCard, type ShareCardVariant } from "@/components/share/ShareCard"
import { ShareSheet, type ShareItem } from "@/components/share/ShareSheet"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { rewind, type RewindData } from "@/data/rewind"

type Screen = "story" | "invite"

const SHARE_URL = "https://www.airtel.in/rewind"
const STORY_CARDS: ShareCardVariant[] = ["summary", "data", "persona", "support"]

interface AppProps {
  data?: RewindData
  /** Milliseconds per story slide; 0 disables auto-advance. */
  autoAdvanceMs?: number
}

function readParams() {
  const params = new URLSearchParams(window.location.search)
  const slide = Number(params.get("slide") ?? 0)
  return {
    screen: (params.get("screen") === "invite" ? "invite" : "story") as Screen,
    slide: Number.isFinite(slide) ? Math.max(0, slide) : 0,
    autoplay: params.get("autoplay") !== "0",
  }
}

export default function App({ data = rewind, autoAdvanceMs }: AppProps) {
  const initial = useMemo(readParams, [])
  const [frame, setFrame] = useState<HTMLDivElement | null>(null)
  const [screen, setScreen] = useState<Screen>(initial.screen)
  const [slideIndex, setSlideIndex] = useState(initial.slide)
  const [share, setShare] = useState<{ open: boolean; kind: "story" | "invite"; variant: ShareCardVariant }>({
    open: false,
    kind: "story",
    variant: "summary",
  })
  const [support, setSupport] = useState<{ open: boolean; tab: "overview" | "report" }>({ open: false, tab: "overview" })

  const openShare = (variant: ShareCardVariant) => setShare({ open: true, kind: "story", variant })
  const openSupport = (tab: "overview" | "report") => setSupport({ open: true, tab })
  const finish = () => setScreen("invite")

  const slides = useMemo(
    () => buildSlides(data, { onShare: openShare, onOpenSupport: openSupport, onFinish: finish }),
    [data],
  )
  const safeIndex = Math.min(slideIndex, slides.length - 1)

  const shareItems = useMemo<ShareItem[]>(() => {
    const variants: ShareCardVariant[] = share.kind === "invite" ? ["invite", "summary"] : STORY_CARDS
    return variants.map((variant) => ({
      id: variant,
      label: SHARE_CARD_LABELS[variant],
      node: <ShareCard variant={variant} data={data} />,
    }))
  }, [share.kind, data])

  const overlayOpen = share.open || support.open
  const headerButton = "pointer-events-auto text-white hover:bg-white/15 hover:text-white"

  return (
    <main className="grid min-h-dvh place-items-center bg-neutral-950 sm:p-6">
      <div
        ref={setFrame}
        className="relative h-dvh w-full overflow-hidden bg-background [transform:translateZ(0)] sm:h-[844px] sm:w-[390px] sm:rounded-[48px] sm:border-[10px] sm:border-neutral-800 sm:shadow-2xl"
      >
        <PortalContainerContext.Provider value={frame}>
          {screen === "story" ? (
            <StoryViewer
              slides={slides}
              index={safeIndex}
              onIndexChange={setSlideIndex}
              onComplete={finish}
              autoAdvanceMs={autoAdvanceMs ?? (initial.autoplay ? 7000 : 0)}
              paused={overlayOpen}
              headerActions={
                <>
                  <Button size="icon-sm" variant="ghost" className={headerButton} aria-label="Share" onClick={() => openShare("summary")}>
                    <Share2 />
                  </Button>
                  <Button size="icon-sm" variant="ghost" className={headerButton} aria-label="Report a problem" onClick={() => openSupport("report")}>
                    <Flag />
                  </Button>
                  <Button size="icon-sm" variant="ghost" className={headerButton} aria-label="Skip to invite friends" onClick={finish}>
                    <X />
                  </Button>
                </>
              }
            />
          ) : (
            <InviteFriends
              data={data}
              onShareInvite={() => setShare({ open: true, kind: "invite", variant: "invite" })}
              onReplay={() => {
                setSlideIndex(0)
                setScreen("story")
              }}
            />
          )}

          <ShareSheet
            open={share.open}
            onOpenChange={(open) => setShare((current) => ({ ...current, open }))}
            title={share.kind === "invite" ? "Share your invite" : "Share your Rewind"}
            description="Pick a card, then download it or send it straight to your friends."
            items={shareItems}
            initialItemId={share.variant}
            shareText={
              share.kind === "invite"
                ? `Switch to Airtel with my code ${data.referral.code} and we both get ${data.referral.rewardPerFriend}!`
                : `My ${data.year} on Airtel: ${data.data.totalGb} GB, ${data.entertainment.streamingHours} hrs streamed. I'm "${data.persona.title}" #AirtelRewind`
            }
            shareUrl={share.kind === "invite" ? `${SHARE_URL}?ref=${data.referral.code}` : SHARE_URL}
            fileNamePrefix={`airtel-rewind-${data.year}`}
          />
          <SupportReportSheet
            open={support.open}
            onOpenChange={(open) => setSupport((current) => ({ ...current, open }))}
            data={data}
            defaultTab={support.tab}
          />
          <Toaster position="top-center" richColors />
        </PortalContainerContext.Provider>
      </div>
    </main>
  )
}
