import { useState } from "react"
import { ReviewModal } from "../ui/ReviewModal"
import { Link } from "react-router"
import { Heart, PixelPaw } from "../icons/pixel-icons"
import Button from "../ui/Button"

const testimonials = [
    {
        name: "Amanda Peterson",
        pet: "Max (Golden Retriever)",
        content: "The team at Vet Care saved my dog's life! Their quick diagnosis and expert care during an emergency was incredible. I can't thank them enough.",
        rating: 5,
    },
    {
        name: "Robert Kim",
        pet: "Whiskers (Persian Cat)",
        content: "Best vet clinic in town! Dr. Chen is amazing with my cat. The Minecraft-themed waiting room is a nice touch that my kids love too!",
        rating: 4,
    },
    {
        name: "Lisa Thompson",
        pet: "Buddy (Beagle)",
        content: "Professional, caring, and affordable. They take the time to explain everything and truly care about the well-being of our pets.",
        rating: 5,
    },
    ]

export function TestimonialsSection() {

    const [modalOpen, setModalOpen] = useState(false)

    return (
        <section className="py-20 bg-mc-green-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                {/* Section Header */}
                <div className="text-center mb-16">
                <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-foreground mb-4">
                    Happy Pet Parents
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Don't just take our word for it - hear what our wonderful clients have to say about us.
                </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                    <div
                    key={testimonial.name}
                    className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 flex flex-col"
                    >
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Heart key={i} className="w-4 h-4 text-destructive" />
                        ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-foreground mb-6 grow">
                        "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t-2 border-mc-primary">
                        <div className="w-10 h-10 bg-mc-grass flex items-center justify-center">
                        <PixelPaw className="w-6 h-6 text-white" />
                        </div>
                        <div>
                        <p className="font-medium text-foreground text-sm">
                            {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {testimonial.pet}
                        </p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
                {/* CTA */}
                <div className="text-center mt-12">
                    <div
                        className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-pixel text-[10px] pixel-btn"
                    >
                        <Button onClick={() => setModalOpen(true)}>Add Review</Button>
                    </div>
                </div>

                <ReviewModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        // optionally refetch reviews or show a toast
                        console.log("Review submitted!")
                    }}
                />
            </div>
        </section>
    )
}
