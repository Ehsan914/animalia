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


// "+8801533829537" → "01533-829537", how the number is written and dialled in
// Bangladesh; anything else is shown as stored.
export const localPhone = (e164) => {
    const match = /^\+880(\d{4})(\d+)$/.exec(e164)
    return match ? `0${match[1]}-${match[2]}` : e164
}

export const toMinutes = (hhmm) => {
    const [hours, minutes] = hhmm.split(":").map(Number)
    return hours * 60 + minutes
}

// Minutes since midnight in Dhaka, regardless of the visitor's own time zone.
export const dhakaMinutes = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date)
    const get = (type) => Number(parts.find((p) => p.type === type).value)
    return get("hour") * 60 + get("minute")
}

// Live open/closed line for the header, hero and contact pages.
export const openStatus = (profile, now = dhakaMinutes()) => {
    const opens = toMinutes(profile.opensAt)
    const closes = toMinutes(profile.closesAt)
    if (now >= opens && now < closes) return { open: true, text: `Open now · until ${profile.closesAt}` }
    if (now < opens) return { open: false, text: `Opens today at ${profile.opensAt}` }
    return { open: false, text: `Closed now · opens ${profile.opensAt}` }
}
