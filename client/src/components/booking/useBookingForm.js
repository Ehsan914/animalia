import { useState } from "react"
import { useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { appointments } from "../../api/resources"
import { useSpamCheck } from "../ui/SpamCheck"
import { whatsAppHref } from "../../utils/clinicProfile"
import { appointmentPayload, bookingFromQuery, validateBooking, whatsAppMessage } from "./bookingForm"
import { isSlotPast } from "./schedule"

// Opens WhatsApp in a new tab; false when the browser blocked the pop-up.
const openTab = (url) => {
    const tab = window.open(url, "_blank")
    if (tab) tab.opener = null
    return Boolean(tab)
}

const withoutKey = (object, key) => {
    if (!(key in object)) return object
    const { [key]: _removed, ...rest } = object
    return rest
}

/**
 * Booking form state. `submit()` validates, saves the request through the API
 * (the clinic sees it as pending), then opens WhatsApp with the request filled
 * in so the visitor can send it. It resolves to { errors } when something needs
 * fixing, { result } once saved, or {} when the server refused it (toasted).
 */
export default function useBookingForm({ services, profile, days, now }) {
    const { search } = useLocation()
    const [booking, setBooking] = useState(() => bookingFromQuery(search, services))
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const spamCheck = useSpamCheck()

    const clearError = (key) => setErrors((current) => withoutKey(current, key))

    const setField = (key, value) => {
        setBooking((current) => ({ ...current, [key]: value }))
        clearError(key === "species" ? "speciesOther" : key)
    }

    const toggleService = (id) => {
        setBooking((current) => ({
            ...current,
            serviceIds: current.serviceIds.includes(id)
                ? current.serviceIds.filter((picked) => picked !== id)
                : [...current.serviceIds, id],
        }))
        clearError("services")
    }

    const pickDay = (key) => {
        const day = days.find((d) => d.key === key)
        setBooking((current) => ({
            ...current,
            day: key,
            time: current.time && isSlotPast(current.time, day, now) ? null : current.time,
        }))
        clearError("when")
    }

    const pickTime = (time) => {
        setBooking((current) => ({ ...current, time }))
        clearError("when")
    }

    const handOff = () => {
        const picked = new Set(booking.serviceIds)
        const dayLabel = days.find((d) => d.key === booking.day).label
        const whatsAppUrl = profile
            ? whatsAppHref(profile.whatsappNumber, whatsAppMessage(booking, {
                serviceTitles: services.filter((s) => picked.has(s.id)).map((s) => s.title),
                dayLabel,
            }))
            : null
        return {
            petName: booking.petName.trim(),
            dayLabel,
            time: booking.time,
            whatsAppUrl,
            whatsAppOpened: whatsAppUrl ? openTab(whatsAppUrl) : false,
        }
    }

    const submit = async () => {
        const found = validateBooking(booking, { hasSpamToken: Boolean(spamCheck.token) })
        setErrors(found)
        if (Object.keys(found).length > 0) return { errors: found }

        setSubmitting(true)
        try {
            await appointments.submit(appointmentPayload(booking, spamCheck.token))
        } catch (err) {
            toast.error(err.message)
            return {}
        } finally {
            setSubmitting(false)
            spamCheck.reset()
        }
        return { result: handOff() }
    }

    return {
        booking,
        errors,
        submitting,
        spamWidget: spamCheck.widget,
        setField,
        toggleService,
        pickDay,
        pickTime,
        submit,
    }
}
