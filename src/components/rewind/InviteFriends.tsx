import { useState } from "react"
import { Check, Copy, Gift, RotateCcw, Share2, UserPlus, Users } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { RewindData } from "@/data/rewind"
import { copyText } from "@/lib/share"

export const SUGGESTED_CONTACTS = [
  { id: "c1", name: "Priya Sharma", detail: "On Jio · called 214 times" },
  { id: "c2", name: "Rohan Mehta", detail: "On Vi · called 168 times" },
  { id: "c3", name: "Neha Gupta", detail: "On Jio · called 97 times" },
  { id: "c4", name: "Kabir Singh", detail: "On BSNL · called 64 times" },
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
      <div
        className="relative shrink-0 overflow-hidden px-6 pt-8 pb-10 text-white"
        style={{ background: "radial-gradient(120% 90% at 20% 0%,#ff3b3b 0%,#e40000 45%,#5c0010 100%)" }}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">airtel <span className="font-normal opacity-80">rewind</span></span>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white" onClick={onReplay}>
            <RotateCcw /> Replay
          </Button>
        </div>
        <Gift className="mt-6 size-9" />
        <h1 className="mt-3 text-4xl leading-none font-black">Bring your people along</h1>
        <p className="mt-3 text-white/85">
          Give friends {referral.rewardPerFriend} when they join Airtel with your code, and get the same for each one who does.
        </p>
      </div>

      <div className="relative -mt-6 flex shrink-0 flex-col gap-4 px-4 pb-8">
        <Card>
          <CardHeader>
            <CardDescription>Your referral code</CardDescription>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={referral.code}
                aria-label="Referral code"
                className="h-11 font-mono text-lg font-bold tracking-[0.25em]"
              />
              <Button size="icon-lg" variant="outline" className="size-11" onClick={handleCopy} aria-label="Copy referral code">
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button size="lg" className="h-11" onClick={onShareInvite}>
              <Share2 /> Share invite card
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="size-4" /> Your progress</CardTitle>
            <CardDescription>
              {referral.joinedCount} of {referral.goal} friends joined · {invitedTotal} invited
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Progress value={(referral.joinedCount / referral.goal) * 100} aria-label="Friends joined" />
            <p className="text-xs text-muted-foreground">
              Get {referral.goal - referral.joinedCount} more friends to join and unlock a free month of Airtel Xstream Play Premium.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>People you talk to most</CardTitle>
            <CardDescription>From your {data.year} Rewind. They're not on Airtel yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col" aria-label="Suggested contacts">
              {SUGGESTED_CONTACTS.map((contact, i) => {
                const done = invited.has(contact.id)
                return (
                  <li key={contact.id}>
                    {i > 0 && <Separator className="my-2" />}
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials(contact.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{contact.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{contact.detail}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={done ? "secondary" : "outline"}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
