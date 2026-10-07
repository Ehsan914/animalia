// Booking calendar: the days and time slots a visitor can pick, always in Dhaka
// time whatever the visitor's own time zone. Hours come from the clinic profile.
import { dhakaMinutes, toMinutes } from "../../utils/clinicProfile"

const SLOT_MINUTES = 60
const DAYS_AHEAD = 7
// Bangladesh has no daylight saving time, so Dhaka is always UTC+6.
const DHAKA_OFFSET = "+06:00"
// The clinic stops for lunch at 13:00. The profile has no field for breaks yet.
export const BREAK_SLOTS = ["13:00"]

const toHHMM = (minutes) =>
    `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`

// Hourly start times from opening until the last one that ends by closing.
// "10:00"–"21:00" → 10:00, 11:00, 12:00, 14:00 … 20:00.
export const timeSlots = (opensAt, closesAt) => {
    const slots = []
    for (let start = toMinutes(opensAt); start + SLOT_MINUTES <= toMinutes(closesAt); start += SLOT_MINUTES) {
        const slot = toHHMM(start)
        if (!BREAK_SLOTS.includes(slot)) slots.push(slot)
    }
    return slots
}

// Today's date in Dhaka, as UTC midnight of that calendar day.
const dhakaToday = (now) => {
    const key = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(now)
    return new Date(`${key}T00:00:00Z`)
}

const format = (date, options) => date.toLocaleDateString("en-GB", { timeZone: "UTC", ...options })

// The next seven bookable days. Once today's last slot has started, the strip
// starts from tomorrow.
export const bookingDays = (slots, now = new Date()) => {
    const today = dhakaToday(now)
    const minutesNow = dhakaMinutes(now)
    const skipToday = !slots.some((slot) => toMinutes(slot) > minutesNow)

    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
        const offset = i + (skipToday ? 1 : 0)
        const date = new Date(today)
        date.setUTCDate(date.getUTCDate() + offset)
        return {
            key: date.toISOString().slice(0, 10),
            isToday: offset === 0,
            weekday: format(date, { weekday: "short" }),
            dayOfMonth: format(date, { day: "numeric" }),
            label: format(date, { weekday: "long", day: "numeric", month: "long" }),
        }
    })
}

// A slot that has already started today can't be picked.
export const isSlotPast = (slot, day, now = new Date()) =>
    Boolean(day?.isToday) && toMinutes(slot) <= dhakaMinutes(now)

// "2026-10-10" + "11:00" (Dhaka) → "2026-10-10T05:00:00.000Z"
export const dhakaDateTime = (dayKey, slot) => new Date(`${dayKey}T${slot}:00${DHAKA_OFFSET}`).toISOString()
