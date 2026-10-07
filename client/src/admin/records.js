// Labels and formatting for moderated records (reviews, appointments). The
// status values mirror the server's ModerationStatus enum.

export const REVIEW_STATUS_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected" }
export const APPOINTMENT_STATUS_LABEL = { pending: "Pending", approved: "Confirmed", rejected: "Cancelled" }

export const statusOptions = (labels) =>
    ["pending", "approved", "rejected"].map((value) => ({ value, label: labels[value] }))

export const serviceTitles = (appointment) =>
    appointment.services.map((link) => link.service.title).join(", ") || "—"

// Appointment instants shown and edited in the admin's local time.
export const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })

export const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

// ISO instant → { date: "YYYY-MM-DD", time: "HH:MM" } for date and time inputs.
export const toDateTimeInputs = (iso) => {
    const d = new Date(iso)
    const pad = (n) => String(n).padStart(2, "0")
    return {
        date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    }
}
