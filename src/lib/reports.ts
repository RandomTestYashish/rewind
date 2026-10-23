export interface SupportReport {
  id: string
  category: string
  details: string
  contact: string
  attachSnapshot: boolean
  createdAt: string
}

const STORAGE_KEY = "airtel-rewind:reports"

// Reports only live in this browser. A real build would POST them to the support API.
export function loadReports(): SupportReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SupportReport[]) : []
  } catch {
    return []
  }
}

export function saveReport(input: Omit<SupportReport, "id" | "createdAt">): SupportReport {
  const report: SupportReport = {
    ...input,
    id: `RW-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([report, ...loadReports()].slice(0, 10)))
  } catch {
    // Storage can be blocked (private mode); the ticket still shows for this session
  }
  return report
}
