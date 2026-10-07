// The hero banner editor's fields and the conversions between a HeroBanner row
// (server/prisma/schema.prisma) and the form.
import { dhakaDay, todayInDhaka } from "../components/banner/heroBanner"

export const BANNER_FIELDS = [
    { section: "Words" },
    { name: "title",       label: "Headline", required: true, max: 200 },
    { name: "description", label: "Text", type: "textarea", rows: 3, required: true, max: 2000, hint: "One or two short sentences. Phones show the first two lines." },
    { name: "ctaLabel",    label: "Button text", max: 60, half: true, placeholder: "Book a visit" },
    { name: "ctaUrl",      label: "Button link", type: "url", links: "button", max: 2000, half: true, placeholder: "/appointment or https://…" },
    { section: "Look" },
    { name: "imageUrl",    label: "Photo link", type: "image", max: 2000, hint: "Paste a Google Drive share link. Leave empty for a colour-only banner." },
    { name: "bgColor",     label: "Background colour", type: "color", hint: "Text turns dark or light by itself so it stays readable." },
    { name: "discountPercent", label: "Discount stamp (%)", type: "number", min: 0, maxNum: 99, half: true, hint: "Shows a “30% OFF” stamp. 0 for none." },
    { section: "When" },
    { name: "startDate",   label: "Starts", type: "date", required: true, half: true, hint: "The date shown on the banner." },
    { name: "endDate",     label: "Ends", type: "date", required: true, half: true, hint: "Leaves the site by itself after this day." },
    { name: "startTime",   label: "From (time)", type: "time", half: true },
    { name: "endTime",     label: "Until (time)", type: "time", half: true },
    { name: "displaySeconds", label: "Seconds on screen", type: "range", min: 3, max: 30, unit: "seconds", hint: "How long it stays before the next banner." },
    { name: "location",    label: "Place", max: 300, half: true },
    { name: "mapUrl",      label: "Map link", type: "url", max: 2000, half: true },
    { name: "active",      label: "Show on the website", type: "toggle", hint: "Turn off to keep it as a draft." },
]

export const emptyBanner = () => {
    const today = todayInDhaka()
    return {
        title: "", description: "", ctaLabel: "", ctaUrl: "", imageUrl: "", bgColor: "#192f5a",
        discountPercent: 0, startDate: today, endDate: today, startTime: "", endTime: "",
        displaySeconds: 6, location: "", mapUrl: "", active: true, partnerLogos: [],
    }
}

export const bannerToForm = (banner) => ({
    title:           banner.title,
    description:     banner.description,
    ctaLabel:        banner.ctaLabel ?? "",
    ctaUrl:          banner.ctaUrl ?? "",
    imageUrl:        banner.imageUrl,
    bgColor:         banner.bgColor ?? "",
    discountPercent: banner.discountPercent ?? 0,
    // Calendar days in the clinic's timezone, as the server stores them.
    startDate:       dhakaDay(banner.startDate),
    endDate:         dhakaDay(banner.endDate),
    startTime:       banner.startTime,
    endTime:         banner.endTime,
    displaySeconds:  banner.displaySeconds ?? 6,
    location:        banner.location,
    mapUrl:          banner.mapUrl,
    active:          banner.active,
    // Not edited here (the new banner design has no partner logos); sent back as stored.
    partnerLogos:    banner.partnerLogos ?? [],
})

// 0 or empty means no discount stamp.
export const bannerPayload = (form) => ({ ...form, discountPercent: Number(form.discountPercent) || null })

export const checkBanner = (form) => ({
    ...(form.startDate && form.endDate && form.endDate < form.startDate ? { endDate: "End on or after the start date." } : {}),
    ...(form.ctaLabel && !form.ctaUrl ? { ctaUrl: "Add where the button goes." } : {}),
    ...(form.ctaUrl && !form.ctaLabel ? { ctaLabel: "Add the button text." } : {}),
})

// Chip for each bannerStatus().
export const BANNER_STATUS = {
    live: { tone: "live", label: "Live" },
    off: { tone: "off", label: "Off" },
    ended: { tone: "muted", label: "Ended" },
}
