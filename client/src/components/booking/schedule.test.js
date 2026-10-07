import { describe, expect, it } from "vitest"
import { bookingDays, dhakaDateTime, isSlotPast, timeSlots } from "./schedule"

// 2026-10-08 in Dhaka (UTC+6) at the given local time.
const dhaka = (hhmm) => new Date(`2026-10-08T${hhmm}:00+06:00`)
const SLOTS = timeSlots("10:00", "21:00")

describe("timeSlots", () => {
    it("gives hourly starts that end by closing, skipping the lunch break", () => {
        expect(SLOTS).toEqual(["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"])
    })

    it("follows the profile's hours, including half-hour openings", () => {
        expect(timeSlots("09:30", "12:30")).toEqual(["09:30", "10:30", "11:30"])
        expect(timeSlots("10:00", "10:30")).toEqual([])
    })
})

describe("bookingDays", () => {
    it("starts today while a slot is still ahead", () => {
        const days = bookingDays(SLOTS, dhaka("19:59"))
        expect(days).toHaveLength(7)
        expect(days[0]).toMatchObject({ key: "2026-10-08", isToday: true, weekday: "Thu", dayOfMonth: "8" })
        expect(days[6].key).toBe("2026-10-14")
    })

    it("starts tomorrow once the last slot has started", () => {
        const days = bookingDays(SLOTS, dhaka("20:00"))
        expect(days[0]).toMatchObject({ key: "2026-10-09", isToday: false })
        expect(days[0].label).toMatch(/Friday,? 9 October/)
    })

    it("uses the Dhaka date, not the visitor's", () => {
        // 23:30 UTC on the 7th is already 05:30 on the 8th in Dhaka.
        expect(bookingDays(SLOTS, new Date("2026-10-07T23:30:00Z"))[0].key).toBe("2026-10-08")
    })
})

describe("isSlotPast", () => {
    const [today] = bookingDays(SLOTS, dhaka("11:30"))
    const tomorrow = { key: "2026-10-09", isToday: false }

    it("blocks today's slots that have started", () => {
        expect(isSlotPast("11:00", today, dhaka("11:30"))).toBe(true)
        expect(isSlotPast("12:00", today, dhaka("11:30"))).toBe(false)
    })

    it("never blocks another day", () => {
        expect(isSlotPast("10:00", tomorrow, dhaka("11:30"))).toBe(false)
    })
})

describe("dhakaDateTime", () => {
    it("reads the slot as Dhaka time", () => {
        expect(dhakaDateTime("2026-10-10", "11:00")).toBe("2026-10-10T05:00:00.000Z")
    })
})
