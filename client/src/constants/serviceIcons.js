import slugify from "slugify"

// A service's icon_key (set in the admin) → its sprite icon (components/ui/IconSprite.jsx).
export const SERVICE_ICON_MAP = {
    checkup: { icon: "stethoscope", label: "Health Check-up" },
    vaccination: { icon: "syringe", label: "Vaccinations" },
    surgery: { icon: "scissors", label: "Surgeries" },
    medicine: { icon: "pill", label: "Pet Medicines" },
    deworming: { icon: "bug", label: "Deworming" },
    accessories: { icon: "shopping-bag", label: "Pet Accessories" },
    grooming: { icon: "sparkle", label: "Grooming & Trimming" },
    diagnosis: { icon: "microscope", label: "Diagnosis" },
}

// Sprite icon name for a service's icon_key, with a safe fallback.
export function getServiceIcon(icon_key) {
    return SERVICE_ICON_MAP[icon_key]?.icon ?? "stethoscope"
}

// The id of a service's row on /services, so other pages can link straight to it
// ("Health Check-up" → "health-check-up").
export const serviceAnchor = (service) => slugify(service.title, { lower: true, strict: true })

export const findService = (services, iconKey) => services.find((s) => s.icon_key === iconKey)

// Booking link with that service pre-ticked on /appointment.
export const bookingHref = (service) =>
    service ? `/appointment?service=${encodeURIComponent(service.title)}` : "/appointment"
