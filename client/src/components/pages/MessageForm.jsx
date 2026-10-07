import { useEffect, useRef, useState } from "react"
import Icon from "../ui/Icon"
import { whatsAppHref } from "../../utils/clinicProfile"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { name: "", email: "", subject: "", message: "" }

const validate = (v) => ({
    name: v.name ? "" : "Add your name.",
    email: EMAIL.test(v.email) ? "" : "Add an email like name@example.com.",
    subject: v.subject ? "" : "Add a subject.",
    message: v.message ? "" : "Write your message.",
})

const messageText = (v) =>
    `Hello! I contacted you via the website form.\n\n*Name:* ${v.name}\n*Email:* ${v.email}\n*Subject:* ${v.subject}\n*Message:* ${v.message}`

const Field = ({ id, label, error, multiline, ...props }) => {
    const Control = multiline ? "textarea" : "input"
    return (
        <div className="form-field">
            <label htmlFor={id}>{label}</label>
            <Control
                id={id}
                name={id}
                required
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
            />
            <p className="field-error" id={`${id}-error`}>{error}</p>
        </div>
    )
}

// "Send a message": nothing is sent from the page. A valid form prepares the
// message and the visitor sends it in WhatsApp, to the clinic's WhatsApp number.
export default function MessageForm({ whatsappNumber }) {
    const [values, setValues] = useState(EMPTY)
    const [errors, setErrors] = useState(EMPTY)
    const [sentText, setSentText] = useState(null)
    const formRef = useRef(null)
    const waRef = useRef(null)
    const wasDone = useRef(false)

    // Focus follows the step: the WhatsApp link once ready, the name field on "write another".
    useEffect(() => {
        if (sentText) waRef.current?.focus()
        else if (wasDone.current) formRef.current?.elements.name.focus()
        wasDone.current = Boolean(sentText)
    }, [sentText])

    const onChange = (e) => {
        const { name, value } = e.target
        setValues((v) => ({ ...v, [name]: value }))
        setErrors((er) => ({ ...er, [name]: "" }))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]))
        const found = validate(trimmed)
        setErrors(found)
        const firstInvalid = Object.keys(found).find((k) => found[k])
        if (firstInvalid) {
            formRef.current.elements[firstInvalid].focus()
            return
        }
        setSentText(messageText(trimmed))
    }

    const writeAnother = () => {
        setValues(EMPTY)
        setSentText(null)
    }

    if (sentText) {
        return (
            <div className="message-done" aria-live="polite">
                <Icon name="check" className="done-icon" />
                <h2 className="h2">One more step.</h2>
                <p>Your message is ready. Open WhatsApp and tap Send; we reply during opening hours.</p>
                <div className="cta-actions">
                    <a ref={waRef} className="btn" href={whatsAppHref(whatsappNumber, sentText)} target="_blank" rel="noopener noreferrer">
                        <Icon name="whatsapp-logo" />Open WhatsApp
                    </a>
                    <button className="text-link link-button" type="button" onClick={writeAnother}>Write another message</button>
                </div>
            </div>
        )
    }

    return (
        <form ref={formRef} noValidate onSubmit={onSubmit}>
            <h2 className="h2">Send a message</h2>
            <p className="muted message-intro">For questions that aren&apos;t urgent. We reply on WhatsApp during opening hours.</p>
            <div className="form-pair">
                <Field id="name" label="Your name" autoComplete="name" value={values.name} onChange={onChange} error={errors.name} />
                <Field id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={onChange} error={errors.email} />
            </div>
            <Field id="subject" label="Subject" placeholder="e.g. Question about vaccines" value={values.subject} onChange={onChange} error={errors.subject} />
            <Field id="message" label="Message" multiline rows={5} value={values.message} onChange={onChange} error={errors.message} />
            <button className="btn" type="submit" disabled={!whatsappNumber}>
                <Icon name="whatsapp-logo" />Continue in WhatsApp
            </button>
            {!whatsappNumber && (
                <p className="form-unavailable">Messaging is unavailable right now. Please call or visit the clinic.</p>
            )}
        </form>
    )
}
