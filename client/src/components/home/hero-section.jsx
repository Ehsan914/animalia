import { Link } from 'react-router';
import Button from '../ui/Button';
import { PixelPaw, PixelHeart } from "../icons/pixel-icons"
import vetTeamImage from '../../public/Vet Easin &  Vet Noor 1.png'

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
            {/* Background gradient base */}
            <div className="absolute inset-0 bg-linear-to-r from-[#e8f5e0] via-[#f0f9ea] to-[#e8f5e0]" />

            {/* Main hero content row */}
            <div className="relative flex-1 flex items-stretch">
                {/* Left content */}
                <div className="relative z-10 flex items-center w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="max-w-2xl">
                        {/* Pixel badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-8">
                            <PixelPaw className="w-5 h-5 text-mc-primary" />
                            <span className="text-sm font-medium text-black">Professional Veterinary Service</span>
                        </div>

                        {/* Main heading */}
                        <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-black leading-relaxed mb-6">
                            Compassionate Care<br />for Your Pets
                        </h1>

                        {/* Subheading */}
                        <p className="font-sans text-lg md:text-xl text-black mb-8 max-w-xl">
                            Your trusted veterinary clinic providing expert medical care, consultations, and treatments for all your beloved companions.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link to="/appointment">
                                <Button className="font-pixel">Book Appointment</Button>
                            </Link>
                            <Link to="/services">
                                <Button className="font-pixel bg-white" variant="outline">Our Services</Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="inline-grid grid-cols-3 gap-0 border-2 border-mc-primary bg-mc-grass overflow-hidden">
                            <div className="text-center px-6 py-3 border-r-2 border-mc-primary">
                                <div className="font-pixel text-[14px] sm:text-2xl text-white">6+</div>
                                <div className="text-xs text-white mt-1">Years Experience</div>
                            </div>
                            <div className="text-center px-6 py-3 border-r-2 border-mc-primary">
                                <div className="font-pixel text-[14px] sm:text-2xl text-white">900+</div>
                                <div className="text-xs text-white mt-1 ">Happy Pets</div>
                            </div>
                            <div className="text-center px-6 py-3">
                                <div className="font-pixel text-[14px] sm:text-2xl text-white">24/7</div>
                                <div className="text-xs text-white mt-1 ">Emergency Care</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right photo — blended with radial gradient masks */}
                <div className="hidden hero-img:block absolute right-0 bottom-0 h-full w-auto overflow-visible">
                    {/* The actual photo with mask */}
                    <div
                        className="relative h-full w-full"
                        style={{
                            WebkitMaskImage: `linear-gradient(
                                to right,
                                transparent 0%,
                                black 25%,
                                black 75%,
                                transparent 100%
                            )`,
                            maskImage: `linear-gradient(
                                to right,
                                transparent 0%,
                                black 25%,
                                black 75%,
                                transparent 100%
                            )`,
                        }}
                    >
                        <img
                            src={vetTeamImage}
                            alt="Veterinary team with pets"
                            className="h-full w-auto object-contain object-right"
                        />
                    </div>
                </div>
            </div>

            {/* Floating promotion banner - inside hero */}
            <div className="hidden banner:block absolute z-30 bottom-8 nav-bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-7xl px-6 lg:px-8">
                <div className="bg-[#c0392b] shadow-mc-heart flex items-center justify-between px-8 py-5 shadow-lg">
                    <span className="font-pixel text-white text-lg sm:text-xl tracking-wide">
                        Free Rabies Vaccination
                    </span>
                    <span className="font-sans text-white text-base sm:text-lg font-medium">
                        7-13th June
                    </span>
                </div>
            </div>

            {/* Promotion banner */}
            <div className="banner:hidden relative z-10 w-full bg-[#c0392b] flex flex-col gap-5 items-center justify-between px-8 py-5">
                <span className="font-pixel text-white text-center text-lg sm:text-xl tracking-wide">
                    Free Rabies Vaccination
                </span>
                <span className="font-sans text-white text-base sm:text-lg font-medium">
                    7-13th June
                </span>
            </div>
        </section>
    );
}
