import {
    Stethoscope,
    Syringe,
    Scissors,
    Pill,
    Bug,
    ShoppingBag,
    Sparkles,
    Microscope,
} from "lucide-react"

export const SERVICE_ICON_MAP = {
    checkup: {
        Icon: Stethoscope,
        label: "Health Check-up",
    },
    vaccination: {
        Icon: Syringe,
        label: "Vaccinations",
    },
    surgery: {
        Icon: Scissors,
        label: "Surgeries",
    },
    medicine: {
        Icon: Pill,
        label: "Pet Medicines",
    },
    deworming: {
        Icon: Bug,
        label: "Deworming",
    },
    accessories: {
        Icon: ShoppingBag,
        label: "Pet Accessories",
    },
    grooming: {
        Icon: Sparkles,
        label: "Grooming & Trimming",
    },
    diagnosis: {
        Icon: Microscope,
        label: "Diagnosis",
    },
}

// Helper: resolve icon component from a key, with a safe fallback
export function getServiceIcon(icon_key) {
    return SERVICE_ICON_MAP[icon_key]?.Icon ?? Stethoscope
}