import { describe, expect, it } from "vitest"
import { formatPhone, telHref, whatsAppHref, formatTime } from "./clinicProfile"
import { getLocalBusinessSchema, getCanonicalUrl } from "./seo"

const profile = {
    phone: "+8801533829537",
    email: "clinic@example.com",
    emergencyPhone: "+8801879388068",
    emergency24h: true,
    whatsappNumber: "+8801879388068",
    streetAddress: "Ekushey Vobon, 677 West Shewrapara",
    locality: "Mirpur, Dhaka",
    postalCode: "1216",
    opensAt: "10:00",
    closesAt: "21:00",
    facebookUrl: "https://www.facebook.com/animalia",
}

describe("clinic profile helpers", () => {
    it("formats Bangladeshi numbers for reading and leaves others alone", () => {
        expect(formatPhone("+8801533829537")).toBe("+880 1533 829537")
        expect(formatPhone("+15551234567")).toBe("+15551234567")
    })

    it("dials the stored number", () => {
        expect(telHref("+8801533829537")).toBe("tel:+8801533829537")
    })

    it("builds WhatsApp links with the country code and an encoded message", () => {
        expect(whatsAppHref("+8801879388068")).toBe("https://wa.me/8801879388068")
        expect(whatsAppHref("+8801879388068", "Hi & hello")).toBe("https://wa.me/8801879388068?text=Hi%20%26%20hello")
    })

    it.each([
        ["00:00", "12:00 AM"],
        ["09:05", "9:05 AM"],
        ["12:30", "12:30 PM"],
        ["21:00", "9:00 PM"],
    ])("shows %s as %s", (input, expected) => {
        expect(formatTime(input)).toBe(expected)
    })
})

describe("SEO", () => {
    it("builds the LocalBusiness schema from the profile", () => {
        const schema = getLocalBusinessSchema(profile)

        expect(schema.telephone).toBe("+880 1533 829537")
        expect(schema.address.postalCode).toBe("1216")
        expect(schema.sameAs).toEqual(["https://www.facebook.com/animalia"])
        expect(schema.openingHoursSpecification).toHaveLength(2)
        expect(schema.openingHoursSpecification[0]).toMatchObject({ opens: "10:00", closes: "21:00" })
    })

    it("drops the 24/7 hours and the social link when the profile has none", () => {
        const schema = getLocalBusinessSchema({ ...profile, emergency24h: false, facebookUrl: "" })

        expect(schema.openingHoursSpecification).toHaveLength(1)
        expect(schema.sameAs).toEqual([])
    })

    it("builds canonical URLs from route paths", () => {
        expect(getCanonicalUrl("/")).toBe("https://www.animaliavetcare.com/")
        expect(getCanonicalUrl("/contact")).toBe("https://www.animaliavetcare.com/contact")
    })
})

describe("local phone and open status", () => {
    it("writes Bangladeshi mobile numbers the way people dial them locally", async () => {
        const { localPhone } = await import("./clinicProfile")
        expect(localPhone("+8801533829537")).toBe("01533-829537")
        expect(localPhone("+15551234567")).toBe("+15551234567")
    })

    it("reads the clock in Dhaka, whatever the visitor's zone", async () => {
        const { dhakaMinutes } = await import("./clinicProfile")
        // 04:30 UTC is 10:30 in Dhaka (UTC+6, no daylight saving).
        expect(dhakaMinutes(new Date("2026-10-08T04:30:00Z"))).toBe(10 * 60 + 30)
    })

    it("says whether the clinic is open, using the profile's hours", async () => {
        const { openStatus } = await import("./clinicProfile")
        expect(openStatus(profile, 9 * 60)).toEqual({ open: false, text: "Opens today at 10:00" })
        expect(openStatus(profile, 10 * 60)).toEqual({ open: true, text: "Open now · until 21:00" })
        expect(openStatus(profile, 21 * 60)).toEqual({ open: false, text: "Closed now · opens 10:00" })
    })
})
