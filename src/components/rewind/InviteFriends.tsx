import { useState } from "react"
import { Check, ChevronLeft, ChevronRight, Copy, RotateCcw, Share2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { PixelScene } from "@/components/pixel/PixelScene"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { RewindData } from "@/data/rewind"
import { copyText } from "@/lib/share"
import { cn } from "@/lib/utils"

export const SUGGESTED_CONTACTS = [
  { id: "c1", name: "Priya Sharma", network: "Jio", calls: 214, tint: "#f7c6c0" },
  { id: "c2", name: "Rohan Mehta", network: "Vi", calls: 168, tint: "#c9dcf0" },
  { id: "c3", name: "Neha Gupta", network: "Jio", calls: 97, tint: "#d9ccef" },
  { id: "c4", name: "Kabir Singh", network: "BSNL", calls: 64, tint: "#cfe5c4" },
  { id: "c5", name: "Ananya Rao", network: "Vi", calls: 51, tint: "#f5dfae" },
]

const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2)

interface InviteFriendsProps {
  data: RewindData
  onShareInvite: () => void
  onReplay: () => void
}

export function InviteFriends({ data, onShareInvite, onReplay }: InviteFriendsProps) {
  const { referral } = data
  const [invited, setInvited] = useState<Set<string>>(new Set())
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const invitedTotal = referral.invitedCount + invited.size
  const contact = SUGGESTED_CONTACTS[selectedIndex]
  const first = contact.name.split(" ")[0]
  const done = invited.has(contact.id)

  async function handleCopy() {
    try {
      await copyText(referral.code)
      setCopied(true)
      toast.success("Code copied", { description: referral.code })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Couldn't copy the code")
    }
  }

  function invite() {
    setInvited((current) => new Set(current).add(contact.id))
    toast.success(`Invite sent to ${first}`)
  }

  const step = (delta: number) =>
    setSelectedIndex((i) => (i + delta + SUGGESTED_CONTACTS.length) % SUGGESTED_CONTACTS.length)

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background">
      <div className="flex shrink-0 items-center justify-between px-4 pt-4">
        <span className="font-pixel-label text-[13px]">
          <span className="font-semibold">airtel</span> rewind <span className="text-muted-foreground">· invite</span>
        </span>
        <Button variant="pixel-outline" size="sm" className="font-pixel-label h-8 px-3 text-xs" onClick={onReplay}>
          <RotateCcw /> Replay
        </Button>
      </div>

      <div className="shrink-0 px-6 pt-5 pb-4">
        <h1 className="font-serif text-[40px] leading-[1.02]">Bring your people along</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Friends get {referral.rewardPerFriend} when they join with your code. You get the same for each one.
        </p>
      </div>

      {/* "Meet the team"-style picker */}
      <div className="shrink-0 border-t-[3px] border-[var(--ink)] bg-[var(--paper-2)] px-3 pt-3 pb-4">
        <p className="font-pixel-label px-1 text-xs">People you talk to most</p>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="pixel-outline" size="icon-sm" className="size-8 shrink-0" aria-label="Previous contact" onClick={() => step(-1)}>
            <ChevronLeft />
          </Button>
          <ul className="flex flex-1 justify-between gap-1.5" aria-label="Suggested contacts">
            {SUGGESTED_CONTACTS.map((c, i) => {
              const active = i === selectedIndex
              return (
                <li key={c.id} className="relative flex flex-col items-center">
                  {active && <span aria-hidden className="absolute -top-2 size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-primary" />}
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    aria-pressed={active}
                    aria-label={`Select ${c.name}`}
                    className={cn(
                      "relative grid size-12 place-items-center border-[3px] font-serif text-lg transition-transform active:translate-y-px",
                      active ? "border-primary shadow-[3px_3px_0_0_#a30000]" : "border-[#c9bb9c]",
                    )}
                    style={{ backgroundColor: c.tint }}
                  >
                    {initials(c.name)}
                    {invited.has(c.id) && (
                      <span className="absolute -right-1.5 -bottom-1.5 grid size-4 place-items-center bg-[var(--ink)] text-white">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                  <span className={cn("font-pixel-label mt-1 text-[10px]", active ? "font-semibold" : "text-muted-foreground")}>
                    {c.name.split(" ")[0]}
                  </span>
                </li>
              )
            })}
          </ul>
          <Button variant="pixel-outline" size="icon-sm" className="size-8 shrink-0" aria-label="Next contact" onClick={() => step(1)}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <PixelScene
        scene="gold"
        prop="heart"
        quip={done ? <>invite sent to {first}. fingers crossed.</> : <>{first} is still on {contact.network}. bring them over?</>}
        className="shrink-0"
      />

      <div className="flex shrink-0 flex-col gap-5 px-5 pt-5 pb-8">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-serif text-[28px] leading-tight">{contact.name}</p>
            <p className="font-pixel-label text-xs text-muted-foreground">
              on {contact.network} · called {contact.calls} times
            </p>
          </div>
          <Button
            variant={done ? "pixel-outline" : "pixel"}
            size="lg"
            className="h-11 shrink-0 px-4 text-base"
            disabled={done}
            onClick={invite}
            aria-label={done ? `${contact.name} invited` : `Invite ${contact.name}`}
          >
            {done ? <><Check /> Invited</> : <><UserPlus /> Invite</>}
          </Button>
        </div>

        <div className="bg-card p-4 px-box">
          <p className="font-pixel-label text-xs text-muted-foreground">Your referral code</p>
          <div className="mt-2 flex items-center gap-2">
            <Input
              readOnly
              value={referral.code}
              aria-label="Referral code"
              className="h-11 border-2 border-[var(--ink)] bg-white font-serif text-xl tracking-[0.25em]"
            />
            <Button size="icon-lg" variant="pixel-outline" className="size-11 shrink-0" onClick={handleCopy} aria-label="Copy referral code">
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
          <Button size="lg" variant="pixel" className="mt-5 h-12 w-full" onClick={onShareInvite}>
            <Share2 /> Share invite card
          </Button>
        </div>

        <div className="bg-card p-4 px-box">
          <div className="flex items-baseline justify-between">
            <p className="font-serif text-xl">Your progress</p>
            <p className="font-pixel-label text-xs text-muted-foreground">
              {referral.joinedCount} of {referral.goal} friends joined · {invitedTotal} invited
            </p>
          </div>
          <div className="mt-3 flex gap-1.5" role="img" aria-label={`${referral.joinedCount} of ${referral.goal} friends joined`}>
            {Array.from({ length: referral.goal }, (_, i) => (
              <span
                key={i}
                className="h-4 flex-1 border-2 border-[var(--ink)]"
                style={{ background: i < referral.joinedCount ? "#e40000" : "#fffaf0" }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {referral.goal - referral.joinedCount} more and you unlock a free month of Airtel Xstream Play Premium.
          </p>
        </div>
      </div>
    </div>
  )
}
