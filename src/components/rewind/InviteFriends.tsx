import { useState } from "react"
import { Check, Copy, RotateCcw, Share2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Callout } from "@/components/theme/Callout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { RewindData } from "@/data/rewind"
import { copyText } from "@/lib/share"

export const SUGGESTED_CONTACTS = [
  { id: "c1", name: "Priya Sharma", network: "Jio", calls: 214 },
  { id: "c2", name: "Rohan Mehta", network: "Vi", calls: 168 },
  { id: "c3", name: "Neha Gupta", network: "Jio", calls: 97 },
  { id: "c4", name: "Kabir Singh", network: "BSNL", calls: 64 },
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
  const [copied, setCopied] = useState(false)
  const invitedTotal = referral.invitedCount + invited.size

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

  function invite(contact: (typeof SUGGESTED_CONTACTS)[number]) {
    setInvited((current) => new Set(current).add(contact.id))
    toast.success(`Invite sent to ${contact.name.split(" ")[0]}`)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background">
      <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-3">
        <span className="font-pixel-label text-[13px]">
          <span className="font-semibold">airtel</span> rewind <span className="text-muted-foreground">· invite</span>
        </span>
        <Button variant="pixel-outline" size="sm" className="font-pixel-label h-8 px-3 text-xs" onClick={onReplay}>
          <RotateCcw /> Replay
        </Button>
      </div>

      <div className="flex shrink-0 flex-col gap-5 px-4 pb-8">
        <section className="flex flex-col items-center bg-white px-6 pt-8 pb-6 text-center px-box">
          <p className="font-pixel-label text-xs text-muted-foreground uppercase">Invite friends</p>
          <h1 className="mt-2 font-serif text-[44px] leading-[1.02]">Bring your people along</h1>
          <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-muted-foreground">
            Friends get {referral.rewardPerFriend} when they join with your code. You get the same for each one.
          </p>

          <div className="mt-6 flex w-full items-center gap-2">
            <Input
              readOnly
              value={referral.code}
              aria-label="Referral code"
              className="h-12 border-2 border-[var(--ink)] bg-white text-center font-serif text-2xl tracking-[0.25em]"
            />
            <Button size="icon-lg" variant="pixel-outline" className="size-12 shrink-0" onClick={handleCopy} aria-label="Copy referral code">
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
          <Button size="lg" variant="pixel" className="mt-5 h-12 w-full" onClick={onShareInvite}>
            <Share2 /> Share invite card
          </Button>
          <p className="font-pixel-label mt-4 text-[11px] text-muted-foreground">Rewards land within 7 days of your friend's first recharge.</p>
        </section>

        <section className="bg-white p-5 px-box">
          <div>
            <h2 className="font-serif text-2xl">Your progress</h2>
            <p className="font-pixel-label mt-1 text-xs text-muted-foreground">
              {referral.joinedCount} of {referral.goal} friends joined · {invitedTotal} invited
            </p>
          </div>
          <div className="mt-3 flex gap-1.5" role="img" aria-label={`${referral.joinedCount} of ${referral.goal} friends joined`}>
            {Array.from({ length: referral.goal }, (_, i) => (
              <span key={i} className="h-4 flex-1 border-2 border-[var(--ink)]" style={{ background: i < referral.joinedCount ? "#e40000" : "#fff" }} />
            ))}
          </div>
          <Callout className="mt-5 text-[15px]">
            {referral.goal - referral.joinedCount} more and you unlock a free month of Xstream Play Premium.
          </Callout>
        </section>

        <section className="bg-white p-5 px-box">
          <h2 className="font-serif text-2xl">People you talk to most</h2>
          <p className="font-pixel-label mt-1 text-xs text-muted-foreground">From your {data.year} Rewind. Not on Airtel yet.</p>
          <ul className="mt-4 flex flex-col" aria-label="Suggested contacts">
            {SUGGESTED_CONTACTS.map((contact, i) => {
              const done = invited.has(contact.id)
              return (
                <li key={contact.id} className={i > 0 ? "border-t-2 border-dashed border-[var(--border)] pt-3 mt-3" : undefined}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center border-2 border-[var(--ink)] bg-[var(--paper-2)] font-serif text-lg">
                      {initials(contact.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-lg leading-tight">{contact.name}</p>
                      <p className="font-pixel-label truncate text-[11px] text-muted-foreground">
                        on {contact.network} · called {contact.calls} times
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={done ? "pixel-outline" : "pixel"}
                      className="h-9 shrink-0 px-3 text-sm"
                      disabled={done}
                      onClick={() => invite(contact)}
                      aria-label={done ? `${contact.name} invited` : `Invite ${contact.name}`}
                    >
                      {done ? <><Check /> Invited</> : <><UserPlus /> Invite</>}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
