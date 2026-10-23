import { toBlob, toPng } from "html-to-image"

const EXPORT_OPTIONS = { pixelRatio: 4, cacheBust: true }

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

/** Renders a DOM node to a PNG and triggers a browser download. */
export async function downloadNodeAsPng(node: HTMLElement, fileName: string) {
  const dataUrl = await toPng(node, EXPORT_OPTIONS)
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = fileName.endsWith(".png") ? fileName : `${fileName}.png`
  link.click()
  return dataUrl
}

/**
 * Shares a DOM node as an image through the Web Share API.
 * Returns false when the browser cannot share files, so callers can fall back.
 */
export async function shareNodeAsImage(node: HTMLElement, fileName: string, text: string) {
  if (typeof navigator.canShare !== "function") return false
  const blob = await toBlob(node, EXPORT_OPTIONS)
  if (!blob) return false
  const file = new File([blob], `${fileName}.png`, { type: "image/png" })
  if (!navigator.canShare({ files: [file] })) return false
  await navigator.share({ files: [file], text })
  return true
}

export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const area = document.createElement("textarea")
  area.value = text
  document.body.appendChild(area)
  area.select()
  document.execCommand("copy")
  area.remove()
}

export type ShareChannel = "whatsapp" | "x" | "telegram" | "sms"

export function channelUrl(channel: ShareChannel, text: string, url: string) {
  const message = encodeURIComponent(`${text} ${url}`)
  switch (channel) {
    case "whatsapp":
      return `https://wa.me/?text=${message}`
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    case "telegram":
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    case "sms":
      return `sms:?&body=${message}`
  }
}
