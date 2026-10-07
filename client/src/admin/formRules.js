// Field checks for the admin forms. The server validates every write too; these
// catch mistakes before a request and say what to write instead.

export const PHONE = /^\+[1-9]\d{7,14}$/
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// A web address, or a path on this site ("/services").
export const isWebLink = (value) => {
    if (/^\/(?![/\\])/.test(value)) return true
    try {
        return ["http:", "https:"].includes(new URL(value).protocol)
    } catch {
        return false
    }
}

// What the banner and announcement buttons may link to: web, phone, mail or a site path.
export const isButtonLink = (value) => isWebLink(value) || /^(tel|mailto):\S+$/i.test(value)

export const isMapEmbed = (value) => {
    try {
        const url = new URL(value)
        return url.protocol === "https:" && url.hostname === "www.google.com" && url.pathname.startsWith("/maps/embed")
    } catch {
        return false
    }
}

const isEmpty = (value) => value === null || value === undefined || value === "" || (Array.isArray(value) && !value.length)

// "Service Name" → "Add service name."; "Price (৳)" → "Add price."
const missing = (label) => `Add ${label.toLowerCase().replace(/ \(.*\)$/, "")}.`

function fieldError(field, value) {
    if (isEmpty(value)) return field.required ? missing(field.label) : ""
    if (field.type === "url" && !(field.links === "button" ? isButtonLink(value) : isWebLink(value))) {
        return field.links === "button"
            ? "Use a link starting with https://, or a page on this site like /services."
            : "Use a web link starting with https://"
    }
    if (field.type === "image" && !isWebLink(value)) return "Use a web link starting with https://"
    if (field.type === "email" && !EMAIL.test(value)) return "Use an email address like name@example.com."
    if (field.type === "number") {
        const n = Number(value)
        if (field.min !== undefined && n < field.min) return `Use ${field.min} or more.`
        if (field.maxNum !== undefined && n > field.maxNum) return `Use a number from ${field.min ?? 0} to ${field.maxNum}.`
    }
    return ""
}

/**
 * Errors by field name, in form order: the generic checks from each field's config,
 * then `extra(values)` for rules that need several fields (dates, phone formats).
 */
export function validate(fields, values, extra) {
    const errors = {}
    for (const field of fields) {
        if (field.section) continue
        const message = fieldError(field, values[field.name])
        if (message) errors[field.name] = message
    }
    return { ...errors, ...(extra ? extra(values) : {}) }
}

// The next free position for an ordered list (services, vets, FAQs).
export const nextOrder = (rows) => Math.max(0, ...rows.map((row) => Number(row.order) || 0)) + 1
