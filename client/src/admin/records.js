// Labels and formatting for moderated records (reviews, appointments). The
// status values mirror the server's ModerationStatus enum.

export const REVIEW_STATUS_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected" }
export const APPOINTMENT_STATUS_LABEL = { pending: "Pending", approved: "Confirmed", rejected: "Cancelled" }
// Chip tone for each status (Chip.jsx).
export const STATUS_TONE = { pending: "wait", approved: "live", rejected: "off" }

export const statusOptions = (labels) =>
    ["pending", "approved", "rejected"].map((value) => ({ value, label: labels[value] }))

// The same, for the form's option buttons: rejecting is drawn as the risky choice.
export const statusChoices = (labels) =>
    statusOptions(labels).map((o) => ({ ...o, danger: o.value === "rejected" }))

export const SPECIES_OPTIONS = ["Dog", "Cat", "Rabbit", "Bird", "Other"].map((s) => ({ value: s, label: s }))

export const serviceTitles = (appointment) =>
    appointment.services.map((link) => link.service.title).join(", ") || "—"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Instants are shown and edited in the admin's local time.
// "8 Oct 2026"
export const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// "Thu 8 Oct"
export const formatLongDay = (iso) => {
    const d = new Date(iso)
    return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

// "14:30"
export const formatTime = (iso) => {
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

// ISO instant → { date: "YYYY-MM-DD", time: "HH:MM" } for date and time inputs.
export const toDateTimeInputs = (iso) => {
    const d = new Date(iso)
    const pad = (n) => String(n).padStart(2, "0")
    return {
        date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    }
}
