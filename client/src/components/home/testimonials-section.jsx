import { useState, useEffect, useRef } from "react"
import { ReviewModal } from "../ui/ReviewModal"
import { Heart, PixelPaw } from "../icons/pixel-icons"
import Button from "../ui/Button"
import Reveal from "../ui/Reveal"

function TestimonialCard({ testimonial }) {
    return (
        <div className="group bg-white border-4 border-mc-primary shadow-mc-sharp p-6 flex flex-col min-w-75 w-75 md:min-w-90 md:w-90">
            <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Heart key={i} className="mc-heart-beat w-4 h-4 text-destructive" />
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

export function TestimonialsSection({ testimonials = [] }) {
    const [modalOpen, setModalOpen] = useState(false)
    const trackRef = useRef(null)
    const animFrameRef = useRef(null)
    const posRef = useRef(0)
    const isPausedRef = useRef(false)

    useEffect(() => {
        if (testimonials.length === 0) return
        const track = trackRef.current
        if (!track) return

        const SPEED = 0.6

        const step = () => {
            if (!isPausedRef.current) {
                posRef.current += SPEED
                const halfWidth = track.scrollWidth / 2
                if (posRef.current >= halfWidth) posRef.current = 0
                track.style.transform = `translateX(-${posRef.current}px)`
            }
            animFrameRef.current = requestAnimationFrame(step)
        }

        animFrameRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(animFrameRef.current)
    }, [testimonials])

    const items = [...testimonials, ...testimonials]

    return (
        <section className="py-20 bg-mc-green-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
            <Reveal className="text-center mb-16">
            <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-foreground mb-4">
                Happy Pet Parents
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it — hear what our wonderful clients have to say about us.
            </p>
            </Reveal>
        </div>

        <div
            className="max-w-6xl mx-auto overflow-hidden"
            onMouseEnter={() => (isPausedRef.current = true)}
            onMouseLeave={() => (isPausedRef.current = false)}
            onTouchStart={() => (isPausedRef.current = true)}
            onTouchEnd={() => (isPausedRef.current = false)}
        >
            <div
                ref={trackRef}
                className="flex gap-6 px-4 will-change-transform"
                style={{ width: "max-content" }}
            >
                {items.map((testimonial, i) => (
                <TestimonialCard key={i} testimonial={testimonial} />
                ))}
            </div>
        </div>

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
