// Hero banner display rules, shared by the home page window and the admin's live
// preview. A banner is a HeroBanner row (server/prisma/schema.prisma). Dates come
// from the API as timestamps and from the admin form as "YYYY-MM-DD"; both are
// read as calendar days in Dhaka, so a banner ends on the clinic's calendar.

import { getGDriveUrl } from "../../utils/gdrive"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const FALLBACK_BG = "#24407a"
const DEFAULT_SECONDS = 6
const MIN_SECONDS = 3
const MAX_SECONDS = 30
const DHAKA_DAY = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" })

export const dhakaDay = (value) => {
    if (!value) return ""
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const date = new Date(value)
    return isNaN(date.getTime()) ? "" : DHAKA_DAY.format(date)
}

export const todayInDhaka = () => DHAKA_DAY.format(new Date())

// What a visitor sees right now. The start date is the date shown on the banner
// (an event can be announced ahead), so a switched-on banner is live until it ends.
export const bannerStatus = (banner, today = todayInDhaka()) => {
    if (!banner.active) return "off"
    return dhakaDay(banner.endDate) < today ? "ended" : "live"
}

const day = (iso) => {
    const [, m, d] = iso.split("-").map(Number)
    return { d, m: MONTHS[m - 1] }
}

// "24 Oct · 10:00 – 17:00", "1 – 20 Oct", "25 Oct – 2 Nov"
export const bannerWhen = (banner) => {
    const start = dhakaDay(banner.startDate)
    const end = dhakaDay(banner.endDate)
    if (!start || !end) return ""
    const s = day(start)
    const e = day(end)
    const dates = start === end ? `${s.d} ${s.m}`
        : s.m === e.m ? `${s.d} – ${e.d} ${e.m}` : `${s.d} ${s.m} – ${e.d} ${e.m}`
    const times = [banner.startTime, banner.endTime].filter(Boolean).join(" – ")
    return [dates, times].filter(Boolean).join(" · ")
}

// Only web, phone, mail and in-site links survive; anything else (javascript:,
// "//host" and "/\host", which browsers open as another site) is dropped.
// In-site links come back as paths for the router.
export const safeLink = (url) => {
    if (!url) return null
    if (/^\/(?![/\\])/.test(url)) return { internal: true, href: url }
    try {
        const parsed = new URL(url)
        return ["http:", "https:", "tel:", "mailto:"].includes(parsed.protocol)
            ? { internal: false, href: parsed.href }
            : null
    } catch {
        return null
    }
}

// The photo to draw: a web or in-site image link, with Google Drive share links
// turned into image links. Anything else (half-typed, unsafe) draws no photo.
export const bannerImage = (banner) => {
    const link = safeLink(banner.imageUrl)
    if (!link || !(link.internal || /^https?:/.test(link.href))) return ""
    return getGDriveUrl(link.href)
}

export const validBg = (hex) => (/^#[0-9a-f]{6}$/i.test(hex || "") ? hex : FALLBACK_BG)

// Text colour follows the background: dark text on light colours, white on dark ones.
export const tone = (hex) => {
    const lin = (c) => {
        const v = c / 255
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    const bg = validBg(hex)
    const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(bg.slice(i, i + 2), 16)))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.32 ? "light" : "dark"
}

export const discount = (banner) => {
    const pct = Number(banner.discountPercent)
    return Number.isInteger(pct) && pct > 0 && pct < 100 ? pct : 0
}

export const displaySeconds = (banner) =>
    Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, Number(banner.displaySeconds) || DEFAULT_SECONDS))
