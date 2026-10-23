# Airtel Rewind 2026

**Preview:** https://randomtestyashish.github.io/rewind/

A clickable prototype of a year-in-review ("Rewind") for Airtel customers. It covers a story-style annual summary, a customer support report, a reusable share sheet with downloadable share cards, and a final Invite Friends screen.

On desktop it shows a 390×844 phone frame. On a phone it runs full screen.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm test` | Run the Vitest + Testing Library suite once |
| `npm run test:watch` | Run the tests in watch mode |
| `npm run lint` | ESLint |
| `npm run build` | Type-check and build to `dist/` (relative paths, so it works on GitHub Pages) |
| `npm run preview` | Serve the built `dist/` |
| `npm run deploy` | Test, build and publish `dist/` to the `gh-pages` branch, which updates the preview link |

### URL parameters for review

- `?autoplay=0` turns off auto-advance (each slide normally lasts 7 s)
- `?slide=6` opens a given slide (0 = intro … 7 = summary)
- `?screen=invite` opens the Invite Friends screen

## How it works

Use the story like Instagram stories: tap the right side (or press →/Space) to go forward, tap the left side (or press ←) to go back, and hold to pause. Opening a sheet also pauses it.

| Slide | Content |
|---|---|
| Intro | Greeting, member since |
| Data | Total GB, percentile, monthly bar chart, **Share this** |
| Calls | Minutes, top contact, longest call |
| Entertainment | Streaming hours, top app and genre |
| Recharges & rewards | Savings, Thanks points, tier |
| Network | Cities, roaming, time on 5G |
| Support | Avg. fix time, first-contact fix rate, CSAT → **support report** / **report a problem** |
| Summary | Persona + key stats → **Share my Rewind**, **Invite friends** |

**Customer support reporting** (`SupportReportSheet`): an *Overview* tab lists every 2026 ticket with its channel, fix time and rating, plus headline metrics. A *Report a problem* tab has a validated form (category, details, contact method, attach snapshot). Submitting gives a ticket ID and a toast. Reports are kept in `localStorage` and listed under "Reported from Rewind". You can also open the form from the flag icon in the header.

**Reusable share interface** (`src/components/share/ShareSheet.tsx`): it doesn't know about Rewind. It takes any list of `{ id, label, node }` items, shows a card picker and a preview, and offers:
- **Download PNG**: the preview is rendered with `html-to-image` at 4× (1080×1920)
- **Share image**: Web Share API with the PNG as a file; downloads instead where that isn't supported
- WhatsApp, X, Telegram and SMS deep links, and **Copy link**

```tsx
<ShareSheet
  open={open}
  onOpenChange={setOpen}
  title="Share your Rewind"
  items={[{ id: "summary", label: "Year summary", node: <ShareCard variant="summary" data={data} /> }]}
  shareText="My 2026 on Airtel…"
  shareUrl="https://www.airtel.in/rewind"
  fileNamePrefix="airtel-rewind-2026"
/>
```

**Share cards** (`ShareCard.tsx`): five 9:16 templates: `summary`, `data`, `persona`, `support`, `invite`.

**Invite Friends** (`InviteFriends.tsx`): referral code with copy, an invite-card share, progress toward a reward goal, and suggested contacts with one-tap invites.

## Project layout

```
src/
  App.tsx                         screen state, share/support sheets, phone frame
  data/rewind.ts                  types + mock data for one customer
  lib/format.ts | share.ts | reports.ts
  components/
    rewind/StoryViewer.tsx        generic story player (progress, tap zones, keys, timer)
    rewind/slides.tsx             the Rewind slides
    rewind/SupportReportSheet.tsx
    rewind/InviteFriends.tsx
    share/ShareSheet.tsx          reusable share interface
    share/ShareCard.tsx           downloadable card templates
    portal-container.tsx          keeps sheets inside the phone frame
    ui/                           shadcn/ui components
```

## Stack

Vite 6, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix, "Nova" preset) with lucide-react icons, Sonner toasts, html-to-image, and Vitest + Testing Library + jsdom.

shadcn/ui components used: Button, Card, Badge, Progress, Tabs, Sheet, Select, RadioGroup, Checkbox, Input, Textarea, Label, Avatar, Separator, ToggleGroup, Sonner. `ui/sheet.tsx` has one local change: it portals into the phone frame through `PortalContainerContext`.

## Limitations

- All data is mock data in `src/data/rewind.ts`; there is no API or login.
- Support reports are saved only in the browser's `localStorage`, not sent anywhere.
- Contacts and referral counts are static. Invites only update the UI.
- The share links point at `airtel.in/rewind`, which is a placeholder.
