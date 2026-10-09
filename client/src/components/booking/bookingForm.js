// Booking form rules: what the query string pre-fills, what counts as valid,
// what the API receives and what the WhatsApp message says.
import { formatTime } from "../../utils/clinicProfile"
import { dhakaDateTime } from "./schedule"

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const SPECIES = ["Dog", "Cat", "Other"]

export const EMPTY_BOOKING = {
    petName: "",
    species: "Dog",
    speciesOther: "",
    serviceIds: [],
    day: null,
    time: null,
    ownerName: "",
    phone: "",
    email: "",
    notes: "",
}

// Care-planner visits ("Rabies booster") → the service that covers them.
const VISIT_SERVICES = [
    [/vaccine|booster/i, /vaccin/i],
    [/check/i, /check/i],
    [/deworm/i, /deworm/i],
    [/neuter|spay/i, /surger/i],
    [/blood|tests/i, /diagnos/i],
]

const sameTitle = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// /appointment?service=<title> (service rows), ?pet=dog&visit=<visit> (care planner).
export const bookingFromQuery = (search, services) => {
    const params = new URLSearchParams(search)
    const service = params.get("service")
    const visit = params.get("visit")
    const species = { dog: "Dog", cat: "Cat" }[params.get("pet")?.toLowerCase()]

    const picked = new Set()
    if (service) services.filter((s) => sameTitle(s.title, service)).forEach((s) => picked.add(s.id))
    const visitMatch = visit && VISIT_SERVICES.find(([visitRe]) => visitRe.test(visit))
    if (visitMatch) {
        const match = services.find((s) => visitMatch[1].test(s.title))
        if (match) picked.add(match.id)
    }

    return {
        ...EMPTY_BOOKING,
        species: species ?? EMPTY_BOOKING.species,
        serviceIds: [...picked],
        notes: visit ? `From the care planner: ${visit}` : "",
    }
}

export const speciesLabel = ({ species, speciesOther }) =>
    species === "Other" ? speciesOther.trim() : species

const compactPhone = (phone) => phone.replace(/[\s-]/g, "")

// Field → message, in form order, so the first key is the first thing to fix.
export const validateBooking = (booking, { hasSpamToken }) => {
    const errors = {}
    const phone = compactPhone(booking.phone)
    if (!booking.petName.trim()) errors.petName = "Add your pet's name."
    if (!speciesLabel(booking)) errors.speciesOther = "Tell us which animal."
    if (booking.serviceIds.length === 0) errors.services = "Pick at least one service."
    if (!booking.day || !booking.time) errors.when = booking.day ? "Pick a time." : "Pick a day and a time."
    if (!booking.ownerName.trim()) errors.ownerName = "Add your name."
    if (!BD_PHONE.test(phone)) {
        errors.phone = phone ? "Use a Bangladeshi mobile number, e.g. 01712-345678." : "Add a phone number for WhatsApp."
    }
    const email = booking.email.trim()
    if (email && !EMAIL.test(email)) errors.email = "Use an email like name@example.com."
    if (!hasSpamToken) errors.spam = "Wait for the spam check to finish, then send again."
    return errors
}

// Body for POST /api/appointment (server/routes/appointmentRoutes.js).
export const appointmentPayload = (booking, turnstileToken) => ({
    name: booking.ownerName.trim(),
    phone: compactPhone(booking.phone),
    email: booking.email.trim(),
    pet_name: booking.petName.trim(),
    species: speciesLabel(booking),
    serviceIds: booking.serviceIds,
    date: dhakaDateTime(booking.day, booking.time),
    message: booking.notes.trim(),
    turnstileToken,
})

// The message pre-filled in WhatsApp; the visitor taps Send to deliver it.
export const whatsAppMessage = (booking, { serviceTitles, dayLabel }) =>
    [
        "🐾 *New Appointment Request*",
        "",
        `*Pet Name:* ${booking.petName.trim()}`,
        `*Species:* ${speciesLabel(booking)}`,
        "",
        `*Owner Name:* ${booking.ownerName.trim()}`,
        `*Phone:* ${booking.phone.trim()}`,
        ...(booking.email.trim() ? [`*Email:* ${booking.email.trim()}`] : []),
        "",
        `*Services Requested:* ${serviceTitles.join(", ")}`,
        `*Preferred Date:* ${dayLabel}`,
        `*Preferred Time:* ${formatTime(booking.time)}`,
        ...(booking.notes.trim() ? ["", `*Additional Notes:* ${booking.notes.trim()}`] : []),
    ].join("\n")
