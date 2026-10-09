import { describe, expect, it } from "vitest"
import { appointmentPayload, bookingFromQuery, EMPTY_BOOKING, validateBooking, whatsAppMessage } from "./bookingForm"

const SERVICES = [
    { id: 1, title: "Health Check-up" },
    { id: 2, title: "Vaccinations" },
    { id: 7, title: "Grooming & Trimming" },
    { id: 8, title: "Diagnosis" },
]

const FILLED = {
    ...EMPTY_BOOKING,
    petName: " Bruno ",
    serviceIds: [2],
    day: "2026-10-10",
    time: "11:00",
    ownerName: "Tanvir Hasan",
    phone: "01712-345678",
    email: "tanvir@example.com",
}

describe("bookingFromQuery", () => {
    it("ticks the service named in ?service=, as the service rows link it", () => {
        const search = `?service=${encodeURIComponent("Grooming & Trimming")}`
        expect(bookingFromQuery(search, SERVICES).serviceIds).toEqual([7])
    })

    it("ignores a service the clinic does not offer", () => {
        expect(bookingFromQuery("?service=Surgery", SERVICES).serviceIds).toEqual([])
    })

    it("carries a care-planner visit into the species, service and notes", () => {
        const booking = bookingFromQuery("?pet=cat&visit=Rabies%20booster", SERVICES)
        expect(booking).toMatchObject({ species: "Cat", serviceIds: [2], notes: "From the care planner: Rabies booster" })
    })

    it("starts empty with no query", () => {
        expect(bookingFromQuery("", SERVICES)).toEqual(EMPTY_BOOKING)
    })
})

describe("validateBooking", () => {
    it("lists every missing field in form order", () => {
        expect(Object.keys(validateBooking(EMPTY_BOOKING, { hasSpamToken: false }))).toEqual([
            "petName", "services", "when", "ownerName", "phone", "spam",
        ])
    })

    it("accepts a complete booking", () => {
        expect(validateBooking(FILLED, { hasSpamToken: true })).toEqual({})
    })

    it("treats the email as optional but checks it when given", () => {
        expect(validateBooking({ ...FILLED, email: " " }, { hasSpamToken: true })).toEqual({})
        expect(validateBooking({ ...FILLED, email: "nope" }, { hasSpamToken: true }).email).toMatch(/name@example\.com/)
    })

    it("asks for the animal when Other is picked", () => {
        const errors = validateBooking({ ...FILLED, species: "Other", speciesOther: " " }, { hasSpamToken: true })
        expect(errors).toEqual({ speciesOther: "Tell us which animal." })
    })

    it("asks for a time once a day is picked", () => {
        expect(validateBooking({ ...FILLED, time: null }, { hasSpamToken: true }).when).toBe("Pick a time.")
    })

    it("accepts Bangladeshi mobiles with or without the country code", () => {
        for (const phone of ["01712345678", "+880 1712-345678", "8801712345678"]) {
            expect(validateBooking({ ...FILLED, phone }, { hasSpamToken: true })).toEqual({})
        }
        expect(validateBooking({ ...FILLED, phone: "0212345678" }, { hasSpamToken: true }).phone).toMatch(/Bangladeshi/)
    })
})

describe("appointmentPayload", () => {
    it("matches the API's field names and sends the slot in Dhaka time", () => {
        expect(appointmentPayload({ ...FILLED, species: "Other", speciesOther: "Rabbit" }, "token")).toEqual({
            name: "Tanvir Hasan",
            phone: "01712345678",
            email: "tanvir@example.com",
            pet_name: "Bruno",
            species: "Rabbit",
            serviceIds: [2],
            date: "2026-10-10T05:00:00.000Z",
            message: "",
            turnstileToken: "token",
        })
    })
})

describe("whatsAppMessage", () => {
    it("spells out the request, with notes only when given", () => {
        const context = { serviceTitles: ["Vaccinations"], dayLabel: "Saturday 10 October" }
        const message = whatsAppMessage(FILLED, context)
        expect(message).toContain("*Pet Name:* Bruno")
        expect(message).toContain("*Preferred Date:* Saturday 10 October")
        expect(message).toContain("*Preferred Time:* 11:00 AM")
        expect(message).not.toContain("Additional Notes")
        expect(whatsAppMessage({ ...FILLED, notes: "Shy" }, context)).toMatch(/\*Additional Notes:\* Shy$/)
    })

    it("leaves out the email line when none was given", () => {
        const context = { serviceTitles: ["Vaccinations"], dayLabel: "Saturday 10 October" }
        expect(whatsAppMessage(FILLED, context)).toContain("*Email:* tanvir@example.com")
        expect(whatsAppMessage({ ...FILLED, email: "" }, context)).not.toContain("Email")
    })
})
