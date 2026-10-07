// Display and link helpers for the clinic profile (GET /api/clinic-profile).
// Phone numbers are stored in E.164 form, e.g. "+8801533829537".

// "+8801533829537" → "+880 1533 829537"; anything else is shown as stored.
export const formatPhone = (e164) => {
    const match = /^\+880(\d{4})(\d+)$/.exec(e164)
    return match ? `+880 ${match[1]} ${match[2]}` : e164
}

export const telHref = (e164) => `tel:${e164}`

export const whatsAppHref = (e164, message) => {
    const base = `https://wa.me/${e164.replace(/\D/g, "")}`
    return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

// "21:00" → "9:00 PM"
export const formatTime = (hhmm) => {
    const [hours, minutes] = hhmm.split(":").map(Number)
    const suffix = hours < 12 ? "AM" : "PM"
    return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`
}

// The clinic opens every day; the Bangladeshi week runs Saturday to Friday.
export const OPEN_DAYS = "Saturday – Friday"

export const openingHours = (profile) =>
    `${formatTime(profile.opensAt)} – ${formatTime(profile.closesAt)}`

export const shortAddress = (profile) =>
    `${profile.streetAddress}, ${profile.locality} ${profile.postalCode}`

export const DEFAULT_WHATSAPP_MESSAGE = "Hi! I would like to inquire about your veterinary services."
