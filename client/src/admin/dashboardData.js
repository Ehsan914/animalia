// The dashboard's numbers, worked out from the admin lists (Prisma rows): appointments
// by day and status, the most booked services, ratings. Days are the clinic's (Dhaka).
import { dhakaDay, todayInDhaka } from "../components/banner/heroBanner"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Bottom of each stack first: confirmed, then waiting, then cancelled.
export const STATUS_SERIES = [
    { key: "approved", label: "Confirmed", color: "var(--navy)" },
    { key: "pending", label: "Pending", color: "#e2b04a" },
    { key: "rejected", label: "Cancelled", color: "#c9ceda" },
]

// "2026-10-08" + 3 → "2026-10-11", counted in whole calendar days.
export const addDays = (iso, n) => {
    const [y, m, d] = iso.split("-").map(Number)
    return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

const weekday = (iso) => new Date(`${iso}T00:00:00Z`).getUTCDay()

// Records created in the current calendar month.
export const countThisMonth = (items, now = new Date()) =>
    items.filter((item) => {
        const d = new Date(item.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

/**
 * Seven days back to seven ahead, counted by status in one pass:
 * [{ day, label, sub, long, isToday, parts: { approved, pending, rejected } }].
 */
export function appointmentDays(appointments, today = todayInDhaka()) {
    const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 6))
    const counts = new Map(days.map((day) => [day, {}]))
    appointments.forEach((a) => {
        const parts = counts.get(dhakaDay(a.date))
        if (parts) parts[a.status] = (parts[a.status] || 0) + 1
    })
    return days.map((day) => {
        const [, m, d] = day.split("-").map(Number)
        return {
            day,
            label: day === today ? "Today" : DAYS[weekday(day)],
            sub: String(d),
            long: `${DAYS[weekday(day)]} ${d} ${MONTHS[m - 1]}`,
            isToday: day === today,
            parts: counts.get(day),
        }
    })
}

export const statusParts = (appointments) =>
    STATUS_SERIES.map((series) => ({ ...series, value: appointments.filter((a) => a.status === series.key).length }))

// The six most booked services, most first.
export function serviceCounts(appointments, limit = 6) {
    const counts = new Map()
    appointments.forEach((a) => a.services.forEach((link) => {
        const title = link.service.title
        counts.set(title, (counts.get(title) || 0) + 1)
    }))
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([label, value]) => ({ label, value }))
}

// Reviews per star, five stars first.
export const ratingCounts = (reviews) =>
    [5, 4, 3, 2, 1].map((stars) => ({ stars, value: reviews.filter((r) => r.rating === stars).length }))

export const ratingAverage = (reviews) =>
    (reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1)

const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
export const newest = (items, n = 5) => [...items].sort(newestFirst).slice(0, n)
