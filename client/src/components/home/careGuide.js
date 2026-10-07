// Care planner ("What's due for your pet?"): the visits most pets need at each
// stage. Clinic guidance, as written for the design; the vet adjusts it at the
// first exam. Each row is [sprite icon, visit, when].

export const SPECIES = [
    { value: "dog", label: "Dog", icon: "dog" },
    { value: "cat", label: "Cat", icon: "cat" },
]

export const AGES = [
    { value: "baby", label: "0–2 mo" },
    { value: "young", label: "2–4 mo" },
    { value: "junior", label: "4–12 mo" },
    { value: "adult", label: "1–7 yr" },
    { value: "senior", label: "7+ yr" },
]

export const CARE = {
    dog: {
        baby: [["stethoscope", "First check-up", "At 6–8 weeks"], ["syringe", "First vaccine (DHPPi)", "At 6–8 weeks"], ["bug", "Deworming", "Every 2 weeks"]],
        young: [["syringe", "Vaccine booster (DHPPi)", "Every 3–4 weeks"], ["syringe", "Rabies vaccine", "From 12 weeks"], ["bug", "Deworming", "Monthly from 12 weeks"]],
        junior: [["syringe", "Final puppy booster", "At 16 weeks"], ["bug", "Deworming", "Monthly to 6 months"], ["scissors", "Neutering consult", "Around 6 months"]],
        adult: [["stethoscope", "Yearly check-up", "Once a year"], ["syringe", "Booster + rabies", "Once a year"], ["bug", "Deworming", "Every 3 months"]],
        senior: [["stethoscope", "Senior check-up", "Every 6 months"], ["microscope", "Blood work", "Once a year"], ["syringe", "Booster + rabies", "Once a year"]],
    },
    cat: {
        baby: [["stethoscope", "First check-up", "At 6–8 weeks"], ["syringe", "First vaccine (FVRCP)", "At 8–9 weeks"], ["bug", "Deworming", "Every 2 weeks"]],
        young: [["syringe", "FVRCP booster", "At 12 weeks"], ["syringe", "Rabies vaccine", "From 12 weeks"], ["bug", "Deworming", "Monthly"]],
        junior: [["syringe", "Final booster", "At 16 weeks"], ["scissors", "Spay / neuter consult", "Around 5–6 months"], ["bug", "Deworming", "Monthly to 6 months"]],
        adult: [["stethoscope", "Yearly check-up", "Once a year"], ["syringe", "Booster + rabies", "Once a year"], ["bug", "Deworming", "Every 3 months"]],
        senior: [["stethoscope", "Senior check-up", "Every 6 months"], ["microscope", "Kidney & thyroid tests", "Once a year"], ["stethoscope", "Dental check", "At every visit"]],
    },
}

// The service (by icon_key) that books each kind of visit.
const SERVICE_FOR_ICON = {
    stethoscope: "checkup",
    syringe: "vaccination",
    bug: "deworming",
    scissors: "surgery",
    microscope: "diagnosis",
}

// The booking link for a visit: that service ticked, or plain booking if the
// clinic has no matching service.
export function visitBookingHref(icon, services) {
    const service = services.find((s) => s.icon_key === SERVICE_FOR_ICON[icon])
    return service ? `/appointment?service=${encodeURIComponent(service.title)}` : "/appointment"
}

// The starting card, from ?pet=cat&age=adult when given.
export function initialCare(params) {
    const species = params.get("pet")
    const age = params.get("age")
    return {
        species: Object.hasOwn(CARE, species ?? "") ? species : "dog",
        age: Object.hasOwn(CARE.dog, age ?? "") ? age : "baby",
    }
}
