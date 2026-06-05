import { useState, useEffect } from "react"
import { Heart, HeartOff, PixelPaw } from "../icons/pixel-icons"
import { X } from "lucide-react"
import { createReview } from "../../api/misc"
import toast from 'react-hot-toast'
import Button from "./Button"

const SPECIES_OPTIONS = ["Dog", "Cat", "Rabbit", "Bird", "Other"]

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
    submit: "",
}

export function ReviewModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState(initialForm)
    const [errors, setErrors] = useState(initialErrors)
    const [loading, setLoading] = useState(false)

    // Trap scroll — legitimately syncing with an external system
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden"
        else document.body.style.overflow = ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    if (!isOpen) return null

    const handleClose = () => {
        setFormData(initialForm)
        setErrors(initialErrors)
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

    const handleSubmit = async () => {
        if (!validate()) return

        setLoading(true)
        try {
            await createReview({
                author: formData.author.trim(),
                pet_name: formData.pet_name.trim(),
                species: resolvedSpecies,
                text: formData.text.trim(),
                rating: formData.rating,
            })
            onSuccess?.()
            toast.success("Review submitted successfully")
            handleClose()
        } catch (err) {
            toast.error("Error: " + err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

            {/* Modal Panel */}
            <div className="relative w-full max-w-lg bg-white border-4 border-mc-primary flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b-4 border-mc-primary bg-mc-grass">
                    <div className="flex items-center gap-3">
                        <PixelPaw className="w-6 h-6 text-white" />
                        <h2
                            id="review-modal-title"
                            className="font-pixel text-sm text-white"
                        >
                            Leave a Review
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center bg-white border-2 border-mc-primary text-mc-primary hover:bg-destructive hover:text-mc-heart hover:border-mc-heart transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-6 flex flex-col gap-5">

                    {/* Author */}
                    <Field label="Your Name" required error={errors.author}>
                        <input
                            type="text"
                            placeholder="e.g. Amanda Peterson"
                            value={formData.author}
                            onChange={e => onChange("author", e.target.value)}
                            className={`border-2 px-2 py-2 w-full ${errors.author ? "border-mc-heart" : "border-mc-primary"}`}
                            maxLength={80}
                        />
                    </Field>

                    {/* Pet Name */}
                    <Field label="Pet's Name" required error={errors.pet_name}>
                        <input
                            type="text"
                            placeholder="e.g. Max"
                            value={formData.pet_name}
                            onChange={e => onChange("pet_name", e.target.value)}
                            className={`border-2 px-2 py-2 w-full ${errors.pet_name ? "border-mc-heart" : "border-mc-primary"}`}
                            maxLength={60}
                        />
                    </Field>

                    {/* Species */}
                    <Field label="Species" required error={errors.species}>
                        <div className="flex flex-wrap gap-2">
                            {SPECIES_OPTIONS.map(species => {
                                const selected = formData.species === species
                                return (
                                    <button
                                        key={species}
                                        type="button"
                                        onClick={() => onChange("species", species)}
                                        className={`px-3 py-1.5 border-2 text-sm font-medium transition-colors cursor-pointer
                                            ${selected
                                                ? "bg-mc-primary border-mc-primary text-white"
                                                : "bg-white border-mc-primary text-mc-primary hover:bg-mc-green-light"
                                            }`}
                                    >
                                        {species}
                                    </button>
                                )
                            })}
                        </div>
                        {formData.species === "Other" && (
                            <input
                                type="text"
                                placeholder="Please specify species..."
                                value={formData.species_other}
                                onChange={e => onChange("species_other", e.target.value)}
                                className={`border-2 px-2 py-2 mt-2 w-full ${errors.species ? "border-mc-heart" : "border-mc-primary"}`}
                                maxLength={60}
                                autoFocus
                            />
                        )}
                    </Field>

                    {/* Rating */}
                    <Field label="Rating" required error={errors.rating}>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => onChange("rating", i)}
                                    className="cursor-pointer hover:scale-110 transition-transform"
                                    aria-label={`Rate ${i}`}
                                >
                                    {i <= (formData.rating || 0)
                                        ? <Heart className="w-6 h-6 text-mc-heart" />
                                        : <HeartOff className="w-6 h-6 text-muted-foreground" />
                                    }
                                </button>
                            ))}
                        </div>
                    </Field>

                    {/* Review Text */}
                    <Field label="Your Review" required error={errors.text}>
                        <textarea
                            placeholder="Tell us about your experience..."
                            value={formData.text}
                            onChange={e => onChange("text", e.target.value)}
                            className={`border-2 px-2 py-2 resize-none w-full ${errors.text ? "border-mc-heart" : "border-mc-primary"}`}
                            rows={4}
                            maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground text-right mt-1">
                            {formData.text.length}/400
                        </p>
                    </Field>

                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex justify-between">
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-5 py-2.5 border-2 text-black font-pixel text-[10px] bg-white hover:text-mc-heart hover:border-mc-heart hover:shadow-mc-emergency transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2.5 border-2 text-white font-pixel text-[10px] transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

function Field({ label, required, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
                {label}
                {required && <span className="text-mc-heart ml-1">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-xs text-mc-heart">{error}</p>
            )}
        </div>
    )
}