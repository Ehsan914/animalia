import { describe, expect, it } from "vitest"
import { PUBLIC_ROUTES, STATIC_ROUTES, routeFor } from "./publicRoutes"
import { toDateTimeInputs, statusOptions, APPOINTMENT_STATUS_LABEL } from "../admin/records"

describe("public route manifest", () => {
    it("prerenders and lists only fixed URLs", () => {
        expect(STATIC_ROUTES.map((r) => r.path)).not.toContain("/blogs/:slug")
        expect(STATIC_ROUTES).toHaveLength(PUBLIC_ROUTES.length - 1)
    })

    it("gives every static page its SEO copy and sitemap settings", () => {
        for (const route of STATIC_ROUTES) {
            expect(route).toMatchObject({
                title: expect.any(String),
                description: expect.any(String),
                changefreq: expect.any(String),
                priority: expect.any(String),
            })
        }
    })

    it("fails loudly for an unknown page", () => {
        expect(routeFor("contact").path).toBe("/contact")
        expect(() => routeFor("nope")).toThrow('Unknown public page "nope"')
    })
})

describe("admin record helpers", () => {
    it("splits an instant into local date and time inputs that rebuild the same instant", () => {
        const iso = new Date(2026, 10, 2, 9, 5).toISOString()
        const { date, time } = toDateTimeInputs(iso)

        expect(new Date(`${date}T${time}`).toISOString()).toBe(iso)
    })

    it("offers every moderation status with screen-specific labels", () => {
        expect(statusOptions(APPOINTMENT_STATUS_LABEL)).toEqual([
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Confirmed" },
            { value: "rejected", label: "Cancelled" },
        ])
    })
})
