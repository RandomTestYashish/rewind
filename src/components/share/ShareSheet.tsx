import { useRef, useState, type ReactNode } from "react"
import { Download, Link2, Loader2, MessageCircle, Send, Share2, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { channelUrl, copyText, downloadNodeAsPng, shareNodeAsImage, slugify, type ShareChannel } from "@/lib/share"

export interface ShareItem {
  id: string
  label: string
  /** The visual that is previewed and exported as a PNG. */
  node: ReactNode
}

export interface ShareSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  items: ShareItem[]
  initialItemId?: string
  shareText: string
  shareUrl: string
  /** Prefix for downloaded file names, e.g. "airtel-rewind-2026". */
  fileNamePrefix: string
}

const CHANNELS: { id: ShareChannel; label: string; icon: typeof Send }[] = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "x", label: "X", icon: Send },
  { id: "telegram", label: "Telegram", icon: Send },
  { id: "sms", label: "SMS", icon: Smartphone },
]

/**
 * Reusable share interface: pick one of several visuals, then download it as a
 * PNG, hand it to the native share sheet, copy a link or open a share channel.
 */
export function ShareSheet({
  open,
  onOpenChange,
  title,
  description,
  items,
  initialItemId,
  shareText,
  shareUrl,
  fileNamePrefix,
}: ShareSheetProps) {
  const [selectedId, setSelectedId] = useState(initialItemId ?? items[0]?.id)
  const [busy, setBusy] = useState<"download" | "share" | null>(null)
  const captureRef = useRef<HTMLDivElement>(null)

  // Start from the requested card each time the sheet opens
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setSelectedId(initialItemId ?? items[0]?.id)
  }

  const selected = items.find((item) => item.id === selectedId) ?? items[0]
  const fileName = `${fileNamePrefix}-${slugify(selected?.label ?? "card")}`

  async function handleDownload() {
    if (!captureRef.current) return
    setBusy("download")
    try {
      await downloadNodeAsPng(captureRef.current, fileName)
      toast.success("Card downloaded", { description: `${fileName}.png` })
    } catch {
      toast.error("Couldn't create the image. Please try again.")
    } finally {
      setBusy(null)
    }
  }

  async function handleNativeShare() {
    if (!captureRef.current) return
    setBusy("share")
    try {
      const shared = await shareNodeAsImage(captureRef.current, fileName, `${shareText} ${shareUrl}`)
      if (!shared) {
        await downloadNodeAsPng(captureRef.current, fileName)
        toast.info("Sharing images isn't supported here, so we downloaded the card instead.")
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") toast.error("Sharing failed. Please try again.")
    } finally {
      setBusy(null)
    }
  }

  async function handleCopy() {
    try {
      await copyText(`${shareText} ${shareUrl}`)
      toast.success("Link copied")
    } catch {
      toast.error("Couldn't copy the link")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[94%] gap-3 overflow-y-auto rounded-none pb-5">
        <SheetHeader className="pb-0">
          <SheetTitle className="font-serif text-2xl font-normal">{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        {items.length > 1 && (
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            value={selected?.id}
            onValueChange={(value) => value && setSelectedId(value)}
            className="mx-auto flex-wrap justify-center px-4"
            aria-label="Choose a card"
          >
            {items.map((item) => (
              <ToggleGroupItem key={item.id} value={item.id} aria-label={item.label}>
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}

        <div className="flex justify-center px-4">
          <div ref={captureRef} className="inline-block" data-testid="share-preview">
            {selected?.node}
          </div>
        </div>

        <SheetFooter className="gap-4 px-5 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Button size="lg" variant="pixel" className="h-12" onClick={handleDownload} disabled={busy !== null}>
              {busy === "download" ? <Loader2 className="animate-spin" /> : <Download />}
              Download PNG
            </Button>
            <Button size="lg" variant="pixel-outline" className="h-12 font-serif text-base" onClick={handleNativeShare} disabled={busy !== null}>
              {busy === "share" ? <Loader2 className="animate-spin" /> : <Share2 />}
              Share image
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {CHANNELS.map(({ id, label, icon: Icon }) => (
              <Button key={id} variant="pixel-outline" className="font-pixel-label h-14 flex-col gap-1 text-[10px]" asChild>
                <a href={channelUrl(id, shareText, shareUrl)} target="_blank" rel="noreferrer">
                  <Icon className="size-4" />
                  {label}
                </a>
              </Button>
            ))}
            <Button variant="pixel-outline" className="font-pixel-label h-14 flex-col gap-1 text-[10px]" onClick={handleCopy}>
              <Link2 className="size-4" />
              Copy link
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
