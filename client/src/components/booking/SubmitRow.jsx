import { forwardRef } from "react"
import Icon from "../ui/Icon"

const SubmitRow = forwardRef(function SubmitRow({ spamWidget, spamError, submitting, hasWhatsApp }, ref) {
    return (
        <div className="submit-row" ref={ref}>
            <button className="btn btn--big" type="submit" form="booking" disabled={submitting}>
                {submitting ? "Sending…" : "Send request"}
                <Icon name="arrow-right" className="icon-arrow" />
            </button>
            <p className="submit-note">
                {hasWhatsApp
                    ? "Saved for the clinic, then WhatsApp opens so you can send it."
                    : "Saved for the clinic, who will contact you to confirm."}
            </p>
            <div className="submit-spam" id="spam">
                {spamWidget}
                <p className="field-error" id="spam-error">{spamError}</p>
            </div>
        </div>
    )
})

export default SubmitRow
