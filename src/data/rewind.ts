export type SupportChannel = "Chat" | "Call" | "Store" | "Email"

export interface SupportTicket {
  id: string
  title: string
  channel: SupportChannel
  openedOn: string
  resolvedInHours: number
  rating: number
}

export interface MonthlyUsage {
  month: string
  dataGb: number
}

export interface RewindData {
  year: number
  user: { name: string; number: string; memberSince: number; plan: string }
  data: { totalGb: number; peakMonth: string; peakDay: string; monthly: MonthlyUsage[]; percentileRank: number }
  calls: { minutes: number; topContactLabel: string; longestCallMins: number; uniqueContacts: number }
  recharges: { count: number; totalSpend: number; saved: number; favouritePack: string }
  entertainment: { streamingHours: number; topApp: string; topGenre: string; songsPlayed: number }
  network: { citiesConnected: number; fiveGSharePct: number; roamingCountries: number }
  rewards: { thanksPoints: number; couponsRedeemed: number; tier: string }
  support: {
    tickets: SupportTicket[]
    avgResolutionHours: number
    firstContactResolutionPct: number
    csat: number
  }
  persona: { title: string; tagline: string }
  referral: { code: string; rewardPerFriend: string; invitedCount: number; joinedCount: number; goal: number }
}

export const rewind: RewindData = {
  year: 2026,
  user: { name: "Aarav", number: "98xxxxxx21", memberSince: 2019, plan: "Airtel Black ₹1,099" },
  data: {
    totalGb: 486,
    peakMonth: "October",
    peakDay: "Sat, 18 Oct",
    percentileRank: 8,
    monthly: [
      { month: "Jan", dataGb: 31 },
      { month: "Feb", dataGb: 28 },
      { month: "Mar", dataGb: 36 },
      { month: "Apr", dataGb: 39 },
      { month: "May", dataGb: 44 },
      { month: "Jun", dataGb: 41 },
      { month: "Jul", dataGb: 38 },
      { month: "Aug", dataGb: 42 },
      { month: "Sep", dataGb: 47 },
      { month: "Oct", dataGb: 58 },
      { month: "Nov", dataGb: 43 },
      { month: "Dec", dataGb: 39 },
    ],
  },
  calls: { minutes: 14820, topContactLabel: "Maa", longestCallMins: 142, uniqueContacts: 213 },
  recharges: { count: 12, totalSpend: 13188, saved: 2140, favouritePack: "Unlimited 5G + OTT" },
  entertainment: { streamingHours: 612, topApp: "Airtel Xstream Play", topGenre: "Thriller", songsPlayed: 4380 },
  network: { citiesConnected: 14, fiveGSharePct: 72, roamingCountries: 2 },
  rewards: { thanksPoints: 3450, couponsRedeemed: 9, tier: "Platinum" },
  support: {
    avgResolutionHours: 6.5,
    firstContactResolutionPct: 75,
    csat: 4.6,
    tickets: [
      { id: "AT-26-0412", title: "Recharge not reflected", channel: "Chat", openedOn: "12 Feb", resolvedInHours: 0.5, rating: 5 },
      { id: "AT-26-1187", title: "Slow speed at home", channel: "Call", openedOn: "03 May", resolvedInHours: 18, rating: 4 },
      { id: "AT-26-2290", title: "International roaming activation", channel: "Chat", openedOn: "21 Jul", resolvedInHours: 1, rating: 5 },
      { id: "AT-26-3051", title: "SIM swap for new phone", channel: "Store", openedOn: "09 Sep", resolvedInHours: 6.5, rating: 4.5 },
    ],
  },
  persona: { title: "The Night Streamer", tagline: "Your data peaked after 10 PM — 41% of all usage." },
  referral: { code: "AARAV26", rewardPerFriend: "₹100 Thanks cash", invitedCount: 3, joinedCount: 2, goal: 5 },
}
