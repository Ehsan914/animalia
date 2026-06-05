import { Link, NavLink } from 'react-router';
import Button from '../ui/Button';
import { PixelPaw, PixelHeart } from "../icons/pixel-icons"

export function HeroSection() {
    return (
        <section className="relative min-h-[80vh] flex items-center grass-pattern overflow-hidden">
        {/* Decorative pixel blocks */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Floating pixel elements */}
            <div className="absolute top-20 left-10 w-8 h-8 bg-mc-grass opacity-20" />
            <div className="absolute top-32 right-20 w-6 h-6 bg-mc-grass opacity-40" />
            <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-mc-grass opacity-30" />
            <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-mc-creeper opacity-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
            {/* Pixel badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-8">
                <PixelPaw className="w-5 h-5 text-mc-primary" />
                <span className="text-sm font-medium text-black">Professional Pet Care</span>
            </div>

            {/* Main heading */}
            <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-black leading-relaxed mb-6">
                <span className="text-balance">Compassionate Care for Your Pets</span>
            </h1>

            {/* Subheading */}
            <p className="font-sans text-lg md:text-xl text-black mb-8 max-w-2xl">
                Your trusted veterinary clinic providing expert medical care, consultations, and treatments for all your beloved companions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                to="/appointment"
                >
                <Button className='font-pixel'>Book Appointment</Button>
                </Link>
                <Link
                to="/services"
                >
                <Button className='font-pixel bg-white' variant='outline'>Our Services</Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg">
                <div className="text-center">
                <div className="font-pixel text-xl sm:text-2xl text-mc-mint">6+</div>
                <div className="text-xs text-mc-mint mt-1">Years Experience</div>
                </div>
                <div className="text-center">
                <div className="font-pixel text-xl sm:text-2xl text-mc-mint">900+</div>
                <div className="text-xs text-mc-mint mt-1">Happy Pets</div>
                </div>
                <div className="text-center">
                <div className="font-pixel text-xl sm:text-2xl text-mc-mint">24/7</div>
                <div className="text-xs text-mc-mint mt-1">Emergency Care</div>
                </div>
            </div>
            </div>

            {/* Decorative pixel pet on the right - hidden on mobile */}
            <div className="hidden lg:block absolute right-0 bottom-0 w-80 h-80">
            <div className="relative w-full h-full">
                {/* Pixel art cat silhouette */}
                <div className="absolute bottom-20 right-20 grid grid-cols-8 gap-0">
                {/* Row 1 - ears */}
                <div className="w-4 h-4" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4" />
                <div className="w-4 h-4" />
                <div className="w-4 h-4" />
                <div className="w-4 h-4" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4" />
                {/* Row 2 */}
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-primary" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-primary" />
                <div className="w-4 h-4 bg-mc-grass" />
                {/* Row 3 - eyes */}
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-white" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-white" />
                <div className="w-4 h-4 bg-mc-grass" />
                {/* Row 4 */}
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-creeper" />
                <div className="w-4 h-4 bg-mc-creeper" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                {/* Row 5 - body */}
                <div className="w-4 h-4" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4 bg-mc-grass" />
                <div className="w-4 h-4" />
                </div>
                {/* Hearts */}
                <PixelHeart className="absolute top-10 right-10 w-8 h-8 text-mc-heart animate-pulse" />
                <PixelHeart className="absolute top-24 right-32 w-6 h-6 text-mc-heart animate-pulse" />
            </div>
            </div>
        </div>
        </section>
    )
}
