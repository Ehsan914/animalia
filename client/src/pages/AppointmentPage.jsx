import { useLayoutEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { useSiteData, useClinicProfile } from "../context/SiteDataContext"
import { PageSEO } from "../components/SEO"
import PetStep from "../components/booking/PetStep"
import ServicesStep from "../components/booking/ServicesStep"
import WhenStep from "../components/booking/WhenStep"
import OwnerStep from "../components/booking/OwnerStep"
import AppointmentSlip from "../components/booking/AppointmentSlip"
import SubmitRow from "../components/booking/SubmitRow"
import BookingDone from "../components/booking/BookingDone"
import useBookingForm from "../components/booking/useBookingForm"
import { speciesLabel } from "../components/booking/bookingForm"
import { bookingDays, timeSlots } from "../components/booking/schedule"
import { skipMotion } from "../components/booking/motion"
import "../styles/book.css"

// Where to send focus for each validation error.
const ERROR_TARGETS = {
    petName: "#petName",
    speciesOther: "#speciesOther",
    services: "#services .chip",
    when: "#days .day",
    ownerName: "#ownerName",
    phone: "#phone",
    email: "#email",
    spam: "#spam",
}

const slipAddress = (profile) =>
    profile && [profile.streetAddress, profile.landmark].filter(Boolean).join(" · ")

const slipRows = (booking, services, days) => {
    const name = booking.petName.trim()
    const species = speciesLabel(booking).toLowerCase()
    const picked = new Set(booking.serviceIds)
    return [
        { label: "Pet", value: name && species ? `${name}, ${species}` : name, typed: true },
        { label: "For", value: services.filter((s) => picked.has(s.id)).map((s) => s.title).join(", ") },
        { label: "Day", value: days.find((d) => d.key === booking.day)?.label },
        { label: "Time", value: booking.time },
        { label: "Owner", value: booking.ownerName.trim(), typed: true },
    ]
}

// The first field that needs fixing takes focus and shakes once.
const flagFirstError = (root, errors, booking) => {
    const key = Object.keys(errors)[0]
    const selector = key === "when" && booking.day ? "#times .time:not(:disabled)" : ERROR_TARGETS[key]
    const target = root.querySelector(selector)
    if (!target) return
    target.focus()
    if (document.activeElement !== target) target.scrollIntoView({ block: "center" })
    if (!skipMotion()) {
        gsap.fromTo(target, { x: 0 }, { keyframes: { x: [0, -8, 7, -4, 0] }, duration: 0.36, ease: "none" })
    }
}

export default function AppointmentPage() {
    const { services } = useSiteData()
    const profile = useClinicProfile()
    const [now] = useState(() => new Date())
    const slots = useMemo(() => (profile ? timeSlots(profile.opensAt, profile.closesAt) : []), [profile])
    const days = useMemo(() => bookingDays(slots, now), [slots, now])

    const form = useBookingForm({ services, profile, days, now })
    const { booking, errors } = form
    const [result, setResult] = useState(null)

    const bookRef = useRef(null)
    const formRef = useRef(null)
    const submitRef = useRef(null)
    const doneRef = useRef(null)

    // Entrance: the title rises from its mask, then the steps, then the slip drops in.
    useLayoutEffect(() => {
        if (skipMotion()) return
        const ctx = gsap.context(() => {
            gsap.timeline({ defaults: { ease: "expo.out" } })
                .from(".book-title .line > span", { yPercent: 110, duration: 0.9 })
                .from(".book-head .lede", { y: 12, opacity: 0, duration: 0.6 }, 0.1)
                .from(".step", { y: 18, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.16)
                .from(".slip", { y: -36, rotation: -4, opacity: 0, duration: 0.9, ease: "back.out(1.3)" }, 0.2)
        }, bookRef)
        return () => ctx.revert()
    }, [])

    // Confirmation: bring it (and, on phones, the slip under it) into view as it rises.
    useLayoutEffect(() => {
        if (!result || skipMotion()) return
        const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0
        const top = doneRef.current.getBoundingClientRect().top + window.scrollY - navHeight - 24
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
        const tween = gsap.from(doneRef.current.children, { y: 16, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.06 })
        return () => tween.revert()
    }, [result])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.submitting) return
        const outcome = await form.submit()
        if (outcome.errors) flagFirstError(bookRef.current, outcome.errors, booking)
        if (!outcome.result) return
        if (skipMotion()) {
            setResult(outcome.result)
            return
        }
        gsap.to([formRef.current, submitRef.current], {
            opacity: 0,
            y: -12,
            duration: 0.22,
            ease: "power2.in",
            onComplete: () => setResult(outcome.result),
        })
    }

    return (
        <div className={`book wrap${result ? " is-done" : ""}`} id="book" ref={bookRef}>
            <PageSEO page="appointment" />
            {!result && (
                <>
                    <div className="book-head">
                        <h1 className="display book-title"><span className="line"><span>Book a visit</span></span></h1>
                        <p className="lede">
                            Tell us about your pet and pick a time.{" "}
                            {profile ? "The clinic confirms your slot on WhatsApp." : "The clinic confirms your slot with you."}
                        </p>
                    </div>

                    <form className="book-form" id="booking" ref={formRef} onSubmit={handleSubmit} noValidate>
                        <PetStep booking={booking} errors={errors} onField={form.setField} />
                        <ServicesStep
                            services={services}
                            selected={booking.serviceIds}
                            error={errors.services}
                            onToggle={form.toggleService}
                        />
                        <WhenStep
                            days={days}
                            slots={slots}
                            day={booking.day}
                            time={booking.time}
                            error={errors.when}
                            now={now}
                            onDay={form.pickDay}
                            onTime={form.pickTime}
                        />
                        <OwnerStep booking={booking} errors={errors} onField={form.setField} />
                    </form>
                </>
            )}

            <AppointmentSlip rows={slipRows(booking, services, days)} address={slipAddress(profile)} stamped={Boolean(result)} />

            {result ? (
                <BookingDone ref={doneRef} result={result} profile={profile} />
            ) : (
                <SubmitRow
                    ref={submitRef}
                    spamWidget={form.spamWidget}
                    spamError={errors.spam}
                    submitting={form.submitting}
                    hasWhatsApp={Boolean(profile)}
                />
            )}
        </div>
    )
}
