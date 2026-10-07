import { describe, expect, test } from "vitest"
import { AGES, CARE, SPECIES, initialCare, visitBookingHref } from "./careGuide"

const services = [
    { title: "Health Check-up", icon_key: "checkup" },
    { title: "Grooming & Trimming", icon_key: "grooming" },
    { title: "Vaccinations", icon_key: "vaccination" },
]

describe("initialCare", () => {
    test("starts on a newborn dog without parameters", () => {
        expect(initialCare(new URLSearchParams())).toEqual({ species: "dog", age: "baby" })
    })

    test("takes the pet and age from the address", () => {
        expect(initialCare(new URLSearchParams("pet=cat&age=senior"))).toEqual({ species: "cat", age: "senior" })
    })

    test("ignores unknown values, including inherited object keys", () => {
        expect(initialCare(new URLSearchParams("pet=constructor&age=toString"))).toEqual({ species: "dog", age: "baby" })
    })
})

describe("visitBookingHref", () => {
    test("ticks the matching service on the booking page", () => {
        expect(visitBookingHref("stethoscope", services)).toBe("/appointment?service=Health%20Check-up")
    })

    test("falls back to plain booking when the clinic has no matching service", () => {
        expect(visitBookingHref("bug", services)).toBe("/appointment")
    })
})

describe("CARE", () => {
    test("has three visits for every pet and age the controls offer", () => {
        for (const { value: species } of SPECIES) {
            for (const { value: age } of AGES) {
                expect(CARE[species][age]).toHaveLength(3)
            }
        }
    })
})
