import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import App from "./App"
import { rewind } from "./data/rewind"

vi.mock("html-to-image", () => ({
  toPng: vi.fn(async () => "data:image/png;base64,AAAA"),
  toBlob: vi.fn(async () => new Blob(["png"], { type: "image/png" })),
}))

const next = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole("button", { name: "Next slide" }))

describe("Airtel Rewind app", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/")
  })

  it("walks the annual summary and lands on Invite Friends", async () => {
    const user = userEvent.setup()
    render(<App autoAdvanceMs={0} />)
    expect(screen.getByRole("heading", { name: /hey aarav/i })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /start my rewind/i }))
    expect(screen.getByText("486")).toBeInTheDocument()
    for (let i = 0; i < 6; i++) await next(user)
    expect(screen.getByRole("heading", { name: rewind.persona.title })).toBeInTheDocument()

    await next(user)
    expect(screen.getByRole("heading", { name: /bring your people along/i })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /replay/i }))
    expect(screen.getByRole("heading", { name: /hey aarav/i })).toBeInTheDocument()
  })

  it("shows the support report and validates a new problem report", async () => {
    const user = userEvent.setup()
    window.history.replaceState(null, "", "/?slide=6")
    render(<App autoAdvanceMs={0} />)

    await user.click(screen.getByRole("button", { name: /see my support report/i }))
    const sheet = await screen.findByRole("dialog")
    const tickets = within(sheet).getByRole("list", { name: "Support tickets" })
    expect(within(tickets).getAllByRole("listitem")).toHaveLength(rewind.support.tickets.length)

    await user.click(within(sheet).getByRole("tab", { name: "Report a problem" }))
    await user.click(within(sheet).getByRole("button", { name: "Submit report" }))
    expect(within(sheet).getByText("Choose what the problem is about.")).toBeInTheDocument()
    expect(within(sheet).getByText(/tell us a little more/i)).toBeInTheDocument()

    await user.click(within(sheet).getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "My Rewind stats look wrong" }))
    await user.type(within(sheet).getByLabelText("Details"), "Data total is lower than my app shows")
    await user.click(within(sheet).getByLabelText("Email"))
    await user.click(within(sheet).getByRole("button", { name: "Submit report" }))

    const status = await within(sheet).findByRole("status")
    expect(status).toHaveTextContent(/Ticket RW-\d{6} is open/)
    expect(status).toHaveTextContent(/EMAIL/)
    expect(JSON.parse(localStorage.getItem("airtel-rewind:reports")!)).toHaveLength(1)
  })

  it("opens the share sheet, switches cards and downloads a PNG", async () => {
    const { toPng } = await import("html-to-image")
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
    const user = userEvent.setup()
    window.history.replaceState(null, "", "/?slide=1")
    render(<App autoAdvanceMs={0} />)

    await user.click(screen.getByRole("button", { name: "Share this" }))
    const sheet = await screen.findByRole("dialog")
    expect(within(sheet).getByTestId("share-card-data")).toBeInTheDocument()

    await user.click(within(sheet).getByRole("radio", { name: "Support" }))
    expect(within(sheet).getByTestId("share-card-support")).toBeInTheDocument()

    await user.click(within(sheet).getByRole("button", { name: /download png/i }))
    await waitFor(() => expect(toPng).toHaveBeenCalledTimes(1))
    const anchor = clickSpy.mock.contexts[0] as HTMLAnchorElement
    expect(anchor.download).toBe("airtel-rewind-2026-support.png")

    const whatsapp = within(sheet).getByRole("link", { name: /whatsapp/i })
    expect(whatsapp).toHaveAttribute("href", expect.stringContaining("https://wa.me/?text="))
    clickSpy.mockRestore()
  })

  it("lets you invite contacts and share an invite card", async () => {
    const user = userEvent.setup()
    window.history.replaceState(null, "", "/?screen=invite")
    render(<App autoAdvanceMs={0} />)

    expect(screen.getByLabelText("Referral code")).toHaveValue(rewind.referral.code)
    expect(screen.getByText(/3 invited/)).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Invite Priya Sharma" }))
    expect(screen.getByRole("button", { name: "Priya Sharma invited" })).toBeDisabled()
    expect(screen.getByText(/4 invited/)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /share invite card/i }))
    const sheet = await screen.findByRole("dialog")
    expect(within(sheet).getByTestId("share-card-invite")).toHaveTextContent(rewind.referral.code)
    expect(within(sheet).getByRole("link", { name: /whatsapp/i })).toHaveAttribute(
      "href",
      expect.stringContaining(`ref%3D${rewind.referral.code}`),
    )
  })
})
