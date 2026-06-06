"use client"

import { useState, useEffect } from "react"
import { PixelPaw, PixelMedical, WhatsApp } from "../components/icons/pixel-icons"
import Button from "../components/ui/Button"
import { LucidePhone } from "lucide-react"
import { getServices } from "../api/services"
import { createAppointment } from "../api/appointments"
import toast from "react-hot-toast"

const SPECIES_PRESETS = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish", "Reptile"]
const WHATSAPP_NUMBER = "8801879388068"

// ─── Skeleton for service buttons ────────────────────────────────────────────
function ServicesSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
            <div
            key={i}
            className="h-10 border-4 border-mc-primary bg-gray-100 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
            />
        ))}
        </div>
    )
}

export default function AppointmentPage() {
    const [formData, setFormData] = useState({
        petName: "",
        ownerName: "",
        phone: "",
        email: "",
        selectedServices: [], // stores service IDs
        date: "",
        time: "",
        notes: "",
    })

    // Species: preset chip or free-text
    const [speciesMode, setSpeciesMode] = useState("preset")
    const [speciesPreset, setSpeciesPreset] = useState("")
    const [speciesCustom, setSpeciesCustom] = useState("")

    // Services from API
    const [availableServices, setAvailableServices] = useState([])
    const [servicesLoading, setServicesLoading] = useState(true)
    const [servicesError, setServicesError] = useState(null)

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [submitError, setSubmitError] = useState(null)

    useEffect(() => {
        getServices()
        .then((data) => {
            setAvailableServices(data)
            setServicesLoading(false)
        })
        .catch((err) => {
            setServicesError(err)
            setServicesLoading(false)
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Toggle by service ID
    const toggleService = (serviceId) => {
        setFormData((prev) => {
        const already = prev.selectedServices.includes(serviceId)
        return {
            ...prev,
            selectedServices: already
            ? prev.selectedServices.filter((id) => id !== serviceId)
            : [...prev.selectedServices, serviceId],
        }
        })
    }

    const resolvedSpecies = speciesMode === "custom" ? speciesCustom : speciesPreset

    // Label for WhatsApp message (titles, not IDs)
    const selectedServiceTitles = availableServices
        .filter((s) => formData.selectedServices.includes(s.id))
        .map((s) => s.title)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!resolvedSpecies.trim()) return

        setIsSubmitting(true)
        setSubmitError(null)

        const dateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString()

        const timeLabel = formData.time
        ? new Date(`1970-01-01T${formData.time}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            })
        : formData.time

        const whatsappMessage = [
        `🐾 *New Appointment Request*`,
        ``,
        `*Pet Name:* ${formData.petName}`,
        `*Species:* ${resolvedSpecies}`,
        ``,
        `*Owner Name:* ${formData.ownerName}`,
        `*Phone:* ${formData.phone}`,
        `*Email:* ${formData.email}`,
        ``,
        `*Services Requested:* ${selectedServiceTitles.join(", ") || "N/A"}`,
        `*Preferred Date:* ${formData.date}`,
        `*Preferred Time:* ${timeLabel}`,
        ``,
        formData.notes ? `*Additional Notes:* ${formData.notes}` : null,
        ]
        .filter((line) => line !== null)
        .join("\n")

        try {
            await createAppointment({
                name: formData.ownerName,
                phone: formData.phone,
                email: formData.email,
                pet_name: formData.petName,
                species: resolvedSpecies,
                serviceIds: formData.selectedServices,
                date: dateTime,
                message: formData.notes,
            })

            toast.success("Appointment booked! Redirecting to WhatsApp…")

            // Reset all form fields
            setFormData({
                petName: "",
                ownerName: "",
                phone: "",
                email: "",
                selectedServices: [],
                date: "",
                time: "",
                notes: "",
            })
            setSpeciesMode("preset")
            setSpeciesPreset("")
            setSpeciesCustom("")

            const encoded = encodeURIComponent(whatsappMessage)
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank")
            } catch (err) {
            toast.error("Something went wrong. Please try again.")
            setSubmitError(err)
            } finally {
            setIsSubmitting(false)
            }
    }

    return (
        <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-mc-green-light py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-6 mx-auto">
                <PixelMedical className="w-4 h-4 text-mc-grass" />
                <span className="text-sm font-medium">Book Appointment</span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl text-black mb-4">
                Schedule Your Visit
            </h1>
            <p className="text-black">
                Fill out the form below to request an appointment. We'll contact you
                to confirm the date and time that works best for you and your pet.
            </p>
            </div>
        </section>

        {/* Booking Form */}
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Pet Information */}
                <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-6">
                <h2 className="font-pixel text-xs text-black mb-4 flex items-center gap-2">
                    <PixelPaw className="w-4 h-4 text-mc-grass" />
                    Pet Information
                </h2>
                <div className="space-y-4">
                    <div>
                    <label htmlFor="petName" className="block text-sm font-medium text-black mb-2">
                        Pet Name *
                    </label>
                    <input
                        type="text"
                        id="petName"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white text-black border-4 border-mc-primary focus:border-mc-primary focus:outline-none"
                        placeholder="Enter your pet's name"
                    />
                    </div>

                    {/* Species */}
                    <div>
                    <label className="block text-sm font-medium text-black mb-2">
                        Species *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {SPECIES_PRESETS.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => {
                            setSpeciesMode("preset")
                            setSpeciesPreset(s)
                            setSpeciesCustom("")
                            }}
                            className={`px-3 py-1.5 text-sm border-4 border-mc-primary transition-all
                            ${speciesMode === "preset" && speciesPreset === s
                                ? "bg-mc-grass text-white shadow-none translate-x-0.5 translate-y-0.5"
                                : "bg-white text-black shadow-mc-sharp hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                            }`}
                        >
                            {s}
                        </button>
                        ))}
                        <button
                        type="button"
                        onClick={() => {
                            setSpeciesMode("custom")
                            setSpeciesPreset("")
                        }}
                        className={`px-3 py-1.5 text-sm border-4 border-mc-primary transition-all
                            ${speciesMode === "custom"
                            ? "bg-mc-grass text-white shadow-none translate-x-0.5 translate-y-0.5"
                            : "bg-white text-black shadow-mc-sharp hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                            }`}
                        >
                        Other…
                        </button>
                    </div>
                    {speciesMode === "custom" && (
                        <input
                        type="text"
                        value={speciesCustom}
                        onChange={(e) => setSpeciesCustom(e.target.value)}
                        required
                        autoFocus
                        className="w-full px-4 py-3 bg-white text-black border-4 border-mc-primary focus:border-mc-primary focus:outline-none"
                        placeholder="e.g. Guinea Pig, Turtle…"
                        />
                    )}
                    {speciesMode === "preset" && (
                        <input
                        type="text"
                        required
                        value={speciesPreset}
                        onChange={() => {}}
                        className="sr-only"
                        aria-hidden="true"
                        tabIndex={-1}
                        />
                    )}
                    </div>
                </div>
                </div>

                {/* Owner Information */}
                <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-6">
                <h2 className="font-pixel text-xs text-black mb-4">
                    Owner Information
                </h2>
                <div className="space-y-4">
                    <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-black mb-2">
                        Your Name *
                    </label>
                    <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white text-black border-4 border-mc-primary focus:border-mc-primary focus:outline-none"
                        placeholder="Enter your full name"
                    />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                        Phone Number *
                        </label>
                        <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white text-black border-4 border-mc-primary focus:border-mc-primary focus:outline-none"
                        placeholder="(+880) 1234-5678"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                        Email Address *
                        </label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white text-black border-4 border-mc-primary focus:border-mc-primary focus:outline-none"
                        placeholder="you@example.com"
                        />
                    </div>
                    </div>
                </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-6">
                <h2 className="font-pixel text-xs text-black mb-4">
                    Appointment Details
                </h2>
                <div className="space-y-4">

                    {/* Services multi-select */}
                    <div>
                    <label className="block text-sm font-medium text-black mb-2">
                        Service(s) *
                    </label>
                    {servicesLoading && <ServicesSkeleton />}
                    {servicesError && (
                        <p className="text-sm text-mc-emergency">
                        Failed to load services. Please try again later.
                        </p>
                    )}
                    {!servicesLoading && !servicesError && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableServices.map((service) => {
                            const selected = formData.selectedServices.includes(service.id)
                            return (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => toggleService(service.id)}
                                className={`px-3 py-2 text-sm font-medium border-4 border-mc-primary transition-all text-left
                                ${selected
                                    ? "bg-mc-grass text-white shadow-none translate-x-0.5 translate-y-0.5"
                                    : "bg-white text-black shadow-mc-sharp hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                                }`}
                            >
                                {selected ? "✓ " : ""}{service.title}
                            </button>
                            )
                        })}
                        </div>
                    )}
                    {/* Hidden required guard */}
                    <input
                        type="text"
                        required
                        value={formData.selectedServices.length > 0 ? "ok" : ""}
                        onChange={() => {}}
                        className="sr-only"
                        aria-hidden="true"
                        tabIndex={-1}
                    />
                    {!servicesLoading && formData.selectedServices.length === 0 && (
                        <p className="text-xs text-mc-emergency mt-1">
                        Please select at least one service.
                        </p>
                    )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-black mb-2">
                        Preferred Date *
                        </label>
                        <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 bg-white text-black border-4 border-mc-primary focus:border-mc-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-black mb-2">
                        Preferred Time *
                        </label>
                        <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white text-black border-4 border-mc-primary focus:border-mc-primary focus:outline-none appearance-none"
                        >
                        <option value="">Select a time</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                        </select>
                    </div>
                    </div>

                    <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-black mb-2">
                        Additional Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-white text-black border-4 border-mc-primary focus:border-mc-primary focus:outline-none resize-none"
                        placeholder="Tell us about any concerns or special requirements..."
                    />
                    </div>
                </div>
                </div>

                {/* Submit */}
                <Button
                type="submit"
                disabled={formData.selectedServices.length === 0 || !resolvedSpecies.trim() || isSubmitting}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                <WhatsApp className="w-5 h-5" />
                {isSubmitting ? "Booking…" : "Request Appointment"}
                </Button>
                
                <p className="text-center text-xs text-black/60">
                Tapping submit will save your appointment and open WhatsApp with your details pre-filled.
                </p>
            </form>
            </div>
        </section>

        {/* Contact Info */}
        <section className="py-12 bg-mc-creeper">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h2 className="font-pixel text-base text-black mb-2">
                Need Immediate Help?
                </h2>
                <p className="text-black">For emergencies, please call us directly.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                href="tel:+8801879388068"
                className="flex items-center justify-center gap-3 p-4 bg-white border-4 border-mc-primary shadow-mc-sharp hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                <LucidePhone className="w-6 h-6 text-mc-grass" />
                <div>
                    <p className="text-xs text-black">Call Us</p>
                    <p className="font-medium text-black">(+880) 1879-388068</p>
                </div>
                </a>
                <a
                href="https://wa.me/8801879388068"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-mc-grass border-4 border-mc-primary shadow-mc-sharp hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                <WhatsApp className="w-6 h-6 text-white" />
                <div>
                    <p className="text-xs text-white/80">WhatsApp</p>
                    <p className="font-medium text-white">Chat with Us</p>
                </div>
                </a>
            </div>
            </div>
        </section>

        {/* Operating Hours */}
        <section className="py-12 bg-mc-green-light">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-pixel text-base text-black mb-6">
                Operating Hours
            </h2>
            <div className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 inline-block">
                <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-8">
                    <span className="text-black font-bold">Saturday - Friday</span>
                    <span className="font-bold text-black">10:00 AM - 9:00 PM</span>
                </div>
                <div className="pt-4 border-t-2 border-mc-primary mt-4">
                    <span className="text-mc-emergency font-bold">Emergency: 24/7</span>
                </div>
                </div>
            </div>
            </div>
        </section>
        </div>
    )
}