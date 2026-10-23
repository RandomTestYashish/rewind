import { useState, type FormEvent } from "react"
import { CheckCircle2, Clock, MessageSquare, Phone, Star, Store, Mail } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { RewindData, SupportChannel } from "@/data/rewind"
import { formatHours } from "@/lib/format"
import { loadReports, saveReport, type SupportReport } from "@/lib/reports"

export const ISSUE_CATEGORIES = [
  { value: "wrong-stats", label: "My Rewind stats look wrong" },
  { value: "network", label: "Network or speed issue" },
  { value: "billing", label: "Billing or recharge issue" },
  { value: "share", label: "Problem sharing or downloading" },
  { value: "other", label: "Something else" },
] as const

const CHANNEL_ICONS: Record<SupportChannel, typeof Phone> = {
  Chat: MessageSquare,
  Call: Phone,
  Store: Store,
  Email: Mail,
}

const MIN_DETAILS = 10

interface SupportReportSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: RewindData
  defaultTab?: "overview" | "report"
}

export function SupportReportSheet({ open, onOpenChange, data, defaultTab = "overview" }: SupportReportSheetProps) {
  const [tab, setTab] = useState<string>(defaultTab)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setTab(defaultTab)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92%] gap-0 overflow-y-auto rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Your {data.year} support report</SheetTitle>
          <SheetDescription>Every request you raised this year, and a quick way to report a new one.</SheetDescription>
        </SheetHeader>
        <Tabs value={tab} onValueChange={setTab} className="px-4 pb-4">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="report">Report a problem</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <SupportOverview data={data} />
          </TabsContent>
          <TabsContent value="report">
            <ReportForm />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

function SupportOverview({ data }: { data: RewindData }) {
  const { support } = data
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="grid grid-cols-3 gap-2">
        <Metric label="Requests" value={String(support.tickets.length)} />
        <Metric label="Avg. fix time" value={formatHours(support.avgResolutionHours)} />
        <Metric label="Your rating" value={`${support.csat}★`} />
      </div>
      <Card size="sm">
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Fixed on first contact</span>
            <span className="font-semibold">{support.firstContactResolutionPct}%</span>
          </div>
          <Progress value={support.firstContactResolutionPct} aria-label="First contact resolution" />
        </CardContent>
      </Card>
      <ul className="flex flex-col gap-2" aria-label="Support tickets">
        {support.tickets.map((ticket) => {
          const Icon = CHANNEL_ICONS[ticket.channel]
          return (
            <li key={ticket.id}>
              <Card size="sm">
                <CardContent className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium">{ticket.title}</p>
                      <Badge variant="secondary" className="shrink-0">
                        <CheckCircle2 /> Resolved
                      </Badge>
                    </div>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      <span>{ticket.id}</span>
                      <span>{ticket.openedOn} · {ticket.channel}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="size-3" />{formatHours(ticket.resolvedInHours)}</span>
                      <span className="inline-flex items-center gap-1"><Star className="size-3" />{ticket.rating}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3 text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  )
}

function ReportForm() {
  const [category, setCategory] = useState("")
  const [details, setDetails] = useState("")
  const [contact, setContact] = useState("sms")
  const [attachSnapshot, setAttachSnapshot] = useState(true)
  const [errors, setErrors] = useState<{ category?: string; details?: string }>({})
  const [submitted, setSubmitted] = useState<SupportReport | null>(null)
  const [history, setHistory] = useState<SupportReport[]>(() => loadReports())

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!category) nextErrors.category = "Choose what the problem is about."
    if (details.trim().length < MIN_DETAILS) nextErrors.details = `Tell us a little more (at least ${MIN_DETAILS} characters).`
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const report = saveReport({ category, details: details.trim(), contact, attachSnapshot })
    setSubmitted(report)
    setHistory(loadReports())
    toast.success("Report submitted", { description: `Ticket ${report.id}` })
  }

  function reset() {
    setSubmitted(null)
    setCategory("")
    setDetails("")
    setContact("sms")
    setAttachSnapshot(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center" role="status">
        <CheckCircle2 className="size-12 text-green-600" />
        <div>
          <p className="text-base font-semibold">We've got it</p>
          <p className="text-sm text-muted-foreground">
            Ticket <span className="font-mono font-semibold text-foreground">{submitted.id}</span> is open. We'll reply by{" "}
            {submitted.contact.toUpperCase()} within 24 hours.
          </p>
        </div>
        <Button variant="outline" onClick={reset}>Report another problem</Button>
        <ReportHistory reports={history} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="issue-category">What's the problem about?</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="issue-category" className="w-full" aria-invalid={!!errors.category}>
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {ISSUE_CATEGORIES.map((item) => (
              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="issue-details">Details</Label>
        <Textarea
          id="issue-details"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="e.g. My data total shows 486 GB but my app says 512 GB"
          rows={4}
          aria-invalid={!!errors.details}
        />
        {errors.details && <p className="text-xs text-destructive">{errors.details}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label>How should we reach you?</Label>
        <RadioGroup value={contact} onValueChange={setContact} className="flex gap-4">
          {[
            { value: "sms", label: "SMS" },
            { value: "call", label: "Call" },
            { value: "email", label: "Email" },
          ].map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={`contact-${option.value}`} />
              <Label htmlFor={`contact-${option.value}`} className="font-normal">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="attach-snapshot" checked={attachSnapshot} onCheckedChange={(value) => setAttachSnapshot(value === true)} />
        <Label htmlFor="attach-snapshot" className="font-normal">Attach my Rewind summary so the team can check it</Label>
      </div>

      <Button type="submit" size="lg" className="h-11">Submit report</Button>
      {history.length > 0 && <ReportHistory reports={history} />}
    </form>
  )
}

function ReportHistory({ reports }: { reports: SupportReport[] }) {
  return (
    <div className="w-full text-left">
      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Reported from Rewind</p>
      <ul className="flex flex-col gap-1.5">
        {reports.map((report) => (
          <li key={report.id} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-xs">
            <span className="truncate">{ISSUE_CATEGORIES.find((c) => c.value === report.category)?.label ?? report.category}</span>
            <Badge variant="outline" className="font-mono">{report.id}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}
