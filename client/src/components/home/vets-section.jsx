import { Link } from "react-router"
import { PixelHeart } from "../icons/pixel-icons"
import Button from "../ui/Button"
import { getGDriveUrl } from "../../utils/gdrive"

function VetCardSkeleton() {
    return (
        <div className="bg-mc-white border-4 border-mc-primary shadow-mc-sharp p-6 flex flex-col items-center animate-pulse">
            <div className="w-60 h-60 bg-mc-primary/20 border-2 border-mc-primary shadow-mc-flat mb-4" />
            <div className="h-3 w-1/2 bg-mc-primary/20 mb-2" />
            <div className="h-3 w-1/3 bg-mc-primary/20 mb-2" />
            <div className="h-3 w-1/4 bg-mc-primary/20 mb-4" />
            <div className="h-3 w-full bg-mc-primary/20 mb-1.5" />
            <div className="h-3 w-4/5 bg-mc-primary/20" />
        </div>
    )
}

export function VetsSection({ vets = [], loading = false }) {
    console.log(vets)
    return (
        <section className="py-20 bg-mc-creeper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
            <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-foreground mb-4">
                Meet Our Vets
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Our team of experienced veterinarians is dedicated to providing the best care for your pets.
            </p>
            </div>

            {/* Vets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            { loading
                ? Array.from({ length: 2 }).map((_, i) => <VetCardSkeleton key={i} />)
                : vets.map((vet) => (
                <div
                key={vet.name}
                className="bg-mc-white border-4 border-mc-primary shadow-mc-sharp p-6 flex flex-col items-center text-center"
                >
                {/* Pixel Avatar Placeholder */}
                <div className="w-60 h-60 bg-mc-green-light border-2 border-mc-primary shadow-mc-flat mb-4 relative overflow-hidden">
                    {/* Pixel face */}
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
                </div>
            ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
            <Link
                to="/vets"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-pixel text-[10px] pixel-btn"
            >
                <Button>Meet The Team</Button>
            </Link>
            </div>
        </div>
        </section>
    )
}
