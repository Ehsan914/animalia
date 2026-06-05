import { useState, useEffect, useRef } from "react"
import { ReviewModal } from "../ui/ReviewModal"
import { Heart, PixelPaw } from "../icons/pixel-icons"
import Button from "../ui/Button"

function TestimonialSkeleton() {
    return (
        <div className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 flex flex-col min-w-75 w-75in-w-[360px] md:w-90 animate-pulse">
            {/* Rating shimmer */}
            <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded-sm" />
                ))}
            </div>
            {/* Text shimmer */}
            <div className="grow space-y-2 mb-6">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
            </div>
            {/* Author shimmer */}
            <div className="flex items-center gap-3 pt-4 border-t-2 border-mc-primary">
                <div className="w-10 h-10 bg-gray-200" />
                <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-2 bg-gray-200 rounded w-16" />
                </div>
            </div>
        </div>
    )
}

function TestimonialCard({ testimonial }) {
    return (
        <div className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 flex flex-col min-w-75 w-75 md:min-w-90 md:w-90">
            <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Heart key={i} className="w-4 h-4 text-destructive" />
                ))}
            </div>
            <p className="text-foreground mb-6 grow">"{testimonial.text}"</p>
            <div className="flex items-center gap-3 pt-4 border-t-2 border-mc-primary">
                <div className="w-10 h-10 bg-mc-grass flex items-center justify-center">
                <PixelPaw className="w-6 h-6 text-white" />
                </div>
                <div>
                <p className="font-medium text-foreground text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.pet_name} ({testimonial.species})</p>
                </div>
            </div>
        </div>
    )
}

export function TestimonialsSection({ testimonials = [], loading = false }) {
    const [modalOpen, setModalOpen] = useState(false)
    const trackRef = useRef(null)
    const animFrameRef = useRef(null)
    const posRef = useRef(0)
    const isPausedRef = useRef(false)

  // Auto-scroll: continuously move left, loop seamlessly
    useEffect(() => {
        if (loading || testimonials.length === 0) return
        const track = trackRef.current
        if (!track) return

        const SPEED = 0.6 // px per frame — tweak to taste

        const step = () => {
        if (!isPausedRef.current) {
            posRef.current += SPEED
            // The track contains items duplicated once; reset at halfway point
            const halfWidth = track.scrollWidth / 2
            if (posRef.current >= halfWidth) posRef.current = 0
            track.style.transform = `translateX(-${posRef.current}px)`
        }
        animFrameRef.current = requestAnimationFrame(step)
        }

        animFrameRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(animFrameRef.current)
    }, [loading, testimonials])

    const items = loading
        ? Array.from({ length: 4 }) // render 4 skeleton cards
        : [...testimonials, ...testimonials] // duplicate for seamless loop

    return (
        <section className="py-20 bg-mc-green-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
            {/* Header */}
            <div className="text-center mb-16">
            <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-foreground mb-4">
                Happy Pet Parents
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it — hear what our wonderful clients have to say about us.
            </p>
            </div>
        </div>

        {/* Full-width scrolling carousel — sits outside the padded container */}
        <div
            className="max-w-6xl mx-auto overflow-hidden"
            onMouseEnter={() => (isPausedRef.current = true)}
            onMouseLeave={() => (isPausedRef.current = false)}
            onTouchStart={() => (isPausedRef.current = true)}
            onTouchEnd={() => (isPausedRef.current = false)}
        >
            {loading ? (
            // Skeletons: simple flex row, no animation loop needed
            <div className="flex gap-6 px-4">
                {items.map((_, i) => (
                <TestimonialSkeleton key={i} />
                ))}
            </div>
            ) : (
            <div
                ref={trackRef}
                className="flex gap-6 px-4 will-change-transform"
                style={{ width: "max-content" }}
            >
                {items.map((testimonial, i) => (
                <TestimonialCard key={i} testimonial={testimonial} />
                ))}
            </div>
            )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
            <div className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-pixel text-[10px] pixel-btn">
            <Button onClick={() => setModalOpen(true)}>Add Review</Button>
            </div>
        </div>

        <ReviewModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={() => console.log("Review submitted!")}
        />
        </section>
    )
}