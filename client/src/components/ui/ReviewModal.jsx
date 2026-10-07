import { useEffect, useId, useRef, useState } from "react"
import toast from "react-hot-toast"
import Icon from "./Icon"
import { reviews } from "../../api/resources"
import { useSpamCheck } from "./SpamCheck"
import "../../styles/home.css"

const SPECIES_OPTIONS = ["Dog", "Cat", "Rabbit", "Bird", "Other"]
const SPECIES_ICON = { Dog: "dog", Cat: "cat" }
const STARS = [1, 2, 3, 4, 5]
const TEXT_MAX = 1000

const initialForm = {
    author: "",
    pet_name: "",
    species: "",
    species_other: "",
    text: "",
    rating: 0,
}

const initialErrors = {
    author: "",
    pet_name: "",
    species: "",
    text: "",
    rating: "",
}

// "Leave a review": a native modal dialog (focus stays inside, Escape closes). The
// review goes to the clinic for approval; Turnstile must pass before it can be sent.
export function ReviewModal({ isOpen, onClose, onSuccess }) {
    const dialogRef = useRef(null)
    const [formData, setFormData] = useState(initialForm)
    const [errors, setErrors] = useState(initialErrors)
    const [loading, setLoading] = useState(false)
    const spamCheck = useSpamCheck()
    const id = useId()

    // Open and close the dialog with the prop, and keep the page behind it still.
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (isOpen && !dialog.open) dialog.showModal()
        if (!isOpen && dialog.open) dialog.close()
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    const handleClose = () => {
        setFormData(initialForm)
        setErrors(initialErrors)
        spamCheck.reset()
        onClose()
    }

    const onChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear the error for the field being edited
        setErrors(prev => ({ ...prev, [name]: "" }))
    }

    const resolvedSpecies =
        formData.species === "Other"
            ? formData.species_other.trim()
            : formData.species

    const validate = () => {
        const next = { ...initialErrors }
        let valid = true

        if (!formData.author.trim()) {
            next.author = "Please enter your name."
            valid = false
        }
        if (!formData.pet_name.trim()) {
            next.pet_name = "Please enter your pet's name."
            valid = false
        }
        if (!resolvedSpecies) {
            next.species = formData.species === "Other"
                ? "Please specify your pet's species."
                : "Please select a species."
            valid = false
        }
        if (!formData.rating) {
            next.rating = "Please give a rating."
            valid = false
        }
        if (!formData.text.trim()) {
            next.text = "Please write a review."
            valid = false
        }

        setErrors(next)
        return valid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await reviews.submit({
                author: formData.author.trim(),
                pet_name: formData.pet_name.trim(),
                species: resolvedSpecies,
                text: formData.text.trim(),
                rating: formData.rating,
                turnstileToken: spamCheck.token,
            })
            onSuccess?.()
            toast.success("Thank you. Your review will appear once the clinic approves it.")
            handleClose()
        } catch (err) {
            toast.error(err.message)
            spamCheck.reset()
        } finally {
            setLoading(false)
        }
    }

    const field = (name) => ({
        id: `${id}-${name}`,
        "aria-invalid": errors[name] ? "true" : undefined,
        "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    })

    return (
        <dialog
            ref={dialogRef}
            className="review-dialog"
            aria-labelledby={`${id}-title`}
            data-lenis-prevent=""
            onCancel={(e) => { e.preventDefault(); handleClose() }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
            {isOpen && (
                <form onSubmit={handleSubmit} noValidate>
                    <div className="rd-head">
                        <h2 id={`${id}-title`}>Leave a review</h2>
                        <button type="button" className="rd-close" onClick={handleClose} aria-label="Close">
                            <Icon name="x" />
                        </button>
                    </div>

                    <div className="rd-body">
                        <div className="rd-pair">
                            <Field id={id} name="author" label="Your name" error={errors.author}>
                                <input
                                    type="text"
                                    {...field("author")}
                                    placeholder="e.g. Amanda Peterson"
                                    value={formData.author}
                                    onChange={e => onChange("author", e.target.value)}
                                    maxLength={80}
                                    autoComplete="name"
                                />
                            </Field>
                            <Field id={id} name="pet_name" label="Pet's name" error={errors.pet_name}>
                                <input
                                    type="text"
                                    {...field("pet_name")}
                                    placeholder="e.g. Max"
                                    value={formData.pet_name}
                                    onChange={e => onChange("pet_name", e.target.value)}
                                    maxLength={60}
                                />
                            </Field>
                        </div>

                        <Field id={id} name="species" label="Species" error={errors.species} group>
                            <div className="rd-chips" role="radiogroup" aria-labelledby={`${id}-species-label`}>
                                {SPECIES_OPTIONS.map(species => (
                                    <button
                                        key={species}
                                        type="button"
                                        role="radio"
                                        aria-checked={formData.species === species}
                                        className="rd-chip"
                                        onClick={() => onChange("species", species)}
                                    >
                                        {SPECIES_ICON[species] && <Icon name={SPECIES_ICON[species]} />}
                                        {species}
                                    </button>
                                ))}
                            </div>
                            {formData.species === "Other" && (
                                <input
                                    type="text"
                                    className="rd-other"
                                    {...field("species")}
                                    aria-label="Your pet's species"
                                    placeholder="e.g. Hamster"
                                    value={formData.species_other}
                                    onChange={e => onChange("species_other", e.target.value)}
                                    maxLength={60}
                                    autoFocus
                                />
                            )}
                        </Field>

                        <Field id={id} name="rating" label="Rating" error={errors.rating} group>
                            <div className="rd-stars" role="radiogroup" aria-labelledby={`${id}-rating-label`}>
                                {STARS.map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        role="radio"
                                        aria-checked={formData.rating === n}
                                        aria-label={`${n} out of 5`}
                                        className={n <= formData.rating ? "is-on" : ""}
                                        onClick={() => onChange("rating", n)}
                                    >
                                        <Icon name="star" />
                                    </button>
                                ))}
                            </div>
                        </Field>

                        <Field id={id} name="text" label="Your review" error={errors.text}>
                            <textarea
                                {...field("text")}
                                placeholder="Tell us about your visit"
                                value={formData.text}
                                onChange={e => onChange("text", e.target.value)}
                                rows={4}
                                maxLength={TEXT_MAX}
                            />
                            <p className="rd-count">{formData.text.length}/{TEXT_MAX}</p>
                        </Field>

                        {spamCheck.widget}
                    </div>

                    <div className="rd-foot">
                        <button className="btn" type="submit" disabled={loading || !spamCheck.token}>
                            {loading ? "Sending…" : "Send review"}
                        </button>
                    </div>
                </form>
            )}
        </dialog>
    )
}

// A labelled field with its error line. Groups (chips, stars) are labelled by id
// instead of a <label for>.
function Field({ id, name, label, error, group = false, children }) {
    return (
        <div className="rd-field">
            {group ? (
                <span className="rd-label" id={`${id}-${name}-label`}>{label}</span>
            ) : (
                <label className="rd-label" htmlFor={`${id}-${name}`}>{label}</label>
            )}
            {children}
            {error && <p className="rd-error" id={`${id}-${name}-error`}>{error}</p>}
        </div>
    )
}
