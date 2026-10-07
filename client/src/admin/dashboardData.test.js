import { describe, expect, it } from "vitest"
import {
    addDays, appointmentDays, countThisMonth, ratingAverage, ratingCounts, serviceCounts, statusParts,
} from "./dashboardData"

const appt = (date, status, titles = []) => ({
    date, status, createdAt: date, services: titles.map((title) => ({ service: { title } })),
})

describe("dashboard data", () => {
    it("adds calendar days across a month end", () => {
        expect(addDays("2026-10-30", 3)).toBe("2026-11-02")
        expect(addDays("2026-10-02", -6)).toBe("2026-09-26")
    })

    it("counts appointments by Dhaka day and status, a week back and a week ahead", () => {
        const days = appointmentDays([
            // 20:00 UTC on the 7th is 02:00 on the 8th in Dhaka.
            appt("2026-10-07T20:00:00.000Z", "approved"),
            appt("2026-10-08T04:00:00.000Z", "pending"),
            appt("2026-10-15T04:00:00.000Z", "rejected"),
            appt("2026-10-30T04:00:00.000Z", "approved"), // outside the window
        ], "2026-10-08")

        expect(days).toHaveLength(14)
        expect(days[0].day).toBe("2026-10-02")
        expect(days[6]).toMatchObject({ day: "2026-10-08", label: "Today", isToday: true, parts: { approved: 1, pending: 1 } })
        expect(days[13]).toMatchObject({ day: "2026-10-15", label: "Thu", sub: "15", long: "Thu 15 Oct", parts: { rejected: 1 } })
    })

    it("totals each status for the donut", () => {
        const parts = statusParts([appt("2026-10-08", "approved"), appt("2026-10-08", "approved"), appt("2026-10-08", "pending")])
        expect(parts.map((p) => [p.key, p.value])).toEqual([["approved", 2], ["pending", 1], ["rejected", 0]])
    })

    it("ranks the most booked services", () => {
        const rows = serviceCounts([
            appt("2026-10-08", "approved", ["Vaccinations", "Deworming"]),
            appt("2026-10-08", "pending", ["Vaccinations"]),
        ])
        expect(rows).toEqual([{ label: "Vaccinations", value: 2 }, { label: "Deworming", value: 1 }])
    })

    it("counts ratings and averages them", () => {
        const reviews = [{ rating: 5 }, { rating: 5 }, { rating: 2 }]
        expect(ratingCounts(reviews).map((r) => r.value)).toEqual([2, 0, 0, 1, 0])
        expect(ratingAverage(reviews)).toBe("4.0")
        expect(ratingAverage([])).toBe("0.0")
    })

    it("counts records created this month", () => {
        const now = new Date(2026, 9, 8)
        const items = [{ createdAt: new Date(2026, 9, 1).toISOString() }, { createdAt: new Date(2026, 8, 30).toISOString() }]
        expect(countThisMonth(items, now)).toBe(1)
    })
})
