import { forwardRef } from "react"
import { Link } from "react-router-dom"
import Icon from "../ui/Icon"
import { telHref } from "../../utils/clinicProfile"

// What happens next, depending on whether WhatsApp opened by itself.
const nextStep = ({ profile, whatsAppOpened }) => {
    if (!profile) return "The clinic will contact you to confirm."
    const hours = `${profile.opensAt} – ${profile.closesAt}`
    const send = whatsAppOpened
        ? "Last step: tap Send in WhatsApp."
        : "Last step: open WhatsApp below and tap Send."
    return `${send} The clinic confirms there during opening hours, ${hours}.`
}

// The confirmation takes the place of the page heading: one headline at a time.
const BookingDone = forwardRef(function BookingDone({ result, profile }, ref) {
    return (
        <section className="done" ref={ref} aria-live="polite">
            <Icon name="check" className="done-icon" />
            <h2 className="h2">Request saved for {result.petName}.</h2>
            <p className="lede">
                {result.dayLabel} at {result.time}. {nextStep({ profile, ...result })}
            </p>
            <div className="done-actions">
                {result.whatsAppUrl && (
                    <a className="btn" href={result.whatsAppUrl} target="_blank" rel="noopener noreferrer">
                        <Icon name="whatsapp-logo" />
                        Open WhatsApp
                    </a>
                )}
                <Link className={result.whatsAppUrl ? "btn btn--line" : "btn"} to="/">Back to home</Link>
                {profile && <a className="btn btn--line" href={telHref(profile.phone)}>Call the clinic</a>}
            </div>
        </section>
    )
})

export default BookingDone
