import { Link } from "react-router"
import { PixelHeart } from "../icons/pixel-icons"
import Button from "../ui/Button"
import Reveal from "../ui/Reveal"
import { getGDriveUrl } from "../../utils/gdrive"

export function VetsSection({ vets = [] }) {
    return (
        <section className="py-20 bg-mc-creeper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <Reveal className="text-center mb-16">
            <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-foreground mb-4">
                Meet Our Vets
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Our team of experienced veterinarians is dedicated to providing the best care for your pets.
            </p>
            </Reveal>

            {/* Vets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vets.map((vet, index) => (
                        <Reveal
                            as="div"
                            key={vet.name}
                            delay={index * 90}
                            className="bg-mc-white border-4 border-mc-primary shadow-mc-sharp p-6 flex flex-col items-center text-center"
                        >
                            <div className="w-60 h-60 bg-mc-green-light border-2 border-mc-primary shadow-mc-flat mb-4 relative overflow-hidden">
                                <img
                                    src={getGDriveUrl(vet.img_url)}
                                    alt={vet.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="font-pixel text-[10px] text-foreground mb-1">
                                {vet.name}
                            </h3>
                            <p className="text-sm text-black font-medium mb-2">
                                {vet.designation}
                            </p>
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-mc-grass/30 text-xs text-muted-foreground mb-4">
                                <PixelHeart className="w-3 h-3" />
                                {vet.specialities?.[0]?.name ?? "General"}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {vet.short_bio}
                            </p>
                        </Reveal>
                    ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
                <Link to="/vets">
                    <Button>Meet The Team</Button>
                </Link>
            </div>
        </div>
        </section>
    )
}
