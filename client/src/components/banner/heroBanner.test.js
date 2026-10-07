// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { dhakaDay, bannerWhen, bannerStatus, bannerImage, safeLink, tone, validBg, discount, displaySeconds } from "./heroBanner"

describe("hero banner helpers", () => {
    it("reads stored timestamps and plain days as Dhaka calendar days", () => {
        // Stored start of 1 Oct in Dhaka is 30 Sep 18:00 UTC.
        expect(dhakaDay("2026-09-30T18:00:00.000Z")).toBe("2026-10-01")
        expect(dhakaDay("2026-10-24")).toBe("2026-10-24")
        expect(dhakaDay("")).toBe("")
    })

    it("writes the date line compactly", () => {
        expect(bannerWhen({ startDate: "2026-10-24", endDate: "2026-10-24", startTime: "10:00", endTime: "17:00" }))
            .toBe("24 Oct · 10:00 – 17:00")
        expect(bannerWhen({ startDate: "2026-10-01", endDate: "2026-10-20" })).toBe("1 – 20 Oct")
        expect(bannerWhen({ startDate: "2026-10-25", endDate: "2026-11-02" })).toBe("25 Oct – 2 Nov")
        expect(bannerWhen({ startDate: "", endDate: "" })).toBe("")
    })

    it("tells the admin what a visitor sees today", () => {
        const today = "2026-10-08"
        expect(bannerStatus({ active: false, endDate: "2026-10-20" }, today)).toBe("off")
        expect(bannerStatus({ active: true, endDate: "2026-10-07" }, today)).toBe("ended")
        expect(bannerStatus({ active: true, endDate: "2026-10-08" }, today)).toBe("live")
    })

    it("keeps only web, phone, mail and in-site links", () => {
        expect(safeLink("javascript:alert(1)")).toBeNull()
        expect(safeLink("")).toBeNull()
        // Browsers read "//host" and "/\host" as another site, not a page here.
        expect(safeLink("//evil.example")).toBeNull()
        expect(safeLink("/\\evil.example")).toBeNull()
        expect(safeLink("/appointment?service=Vaccinations")).toEqual({ internal: true, href: "/appointment?service=Vaccinations" })
        expect(safeLink("https://wa.me/8801879388068")).toEqual({ internal: false, href: "https://wa.me/8801879388068" })
        expect(safeLink("tel:+8801879388068")).toEqual({ internal: false, href: "tel:+8801879388068" })
    })

    it("turns Drive share links into image links and drops half-typed or unsafe ones", () => {
        expect(bannerImage({ imageUrl: "https://drive.google.com/file/d/abc_123/view?usp=sharing" }))
            .toBe("https://drive.google.com/thumbnail?id=abc_123&sz=w1000")
        expect(bannerImage({ imageUrl: "https://example.com/flu-day.jpg" })).toBe("https://example.com/flu-day.jpg")
        expect(bannerImage({ imageUrl: "/images/vets.jpg" })).toBe("/images/vets.jpg")
        expect(bannerImage({ imageUrl: "https://drive.goo" })).toBe("https://drive.goo/")
        expect(bannerImage({ imageUrl: "drive.google" })).toBe("")
        expect(bannerImage({ imageUrl: "javascript:alert(1)" })).toBe("")
        expect(bannerImage({ imageUrl: "" })).toBe("")
    })

    it("picks text tone from the background and falls back to navy", () => {
        expect(tone("#f1e3c8")).toBe("light")
        expect(tone("#b8392a")).toBe("dark")
        expect(validBg("red")).toBe("#24407a")
        expect(validBg("#2F5D4F")).toBe("#2F5D4F")
    })

    it("only shows whole discounts between 1 and 99, and clamps the seconds", () => {
        expect(discount({ discountPercent: 30 })).toBe(30)
        expect(discount({ discountPercent: 100 })).toBe(0)
        expect(discount({ discountPercent: null })).toBe(0)
        expect(displaySeconds({ displaySeconds: 1 })).toBe(3)
        expect(displaySeconds({ displaySeconds: 90 })).toBe(30)
        expect(displaySeconds({})).toBe(6)
    })
})
