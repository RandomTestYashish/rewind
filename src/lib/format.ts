const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
const num = new Intl.NumberFormat("en-IN")

export const formatINR = (value: number) => inr.format(value)
export const formatNumber = (value: number) => num.format(value)

export function formatHours(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)} min`
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr`
}
