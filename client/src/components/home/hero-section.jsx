import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Button from '../ui/Button';
import { MapPin, Syringe } from "lucide-react"
import { PixelPaw } from "../icons/pixel-icons"
import { useSiteData } from "../../context/SiteDataContext"
import { getGDriveUrl } from "../../utils/gdrive"
import vetTeamImage from '../../public/Vet Easin &  Vet Noor 1.png'

const SLIDE_INTERVAL = 6000; // ms each slide stays before advancing

const TRANSITION_MS = 700; // slide animation duration

export function HeroSection() {
    const { heroBanner } = useSiteData();

    // Two real slides when a banner is live: hero + promo. We render a third
    // child — a clone of the hero — after the promo so the track can keep moving
    // forward (1→2→1) and snap back to the start invisibly. No back-and-forth.
    const realCount = heroBanner ? 2 : 1;
    const hasCarousel = realCount > 1;

    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(true);
    const [paused, setPaused] = useState(false);

    // Always move forward: hero (6s) → promo (6s) → clone → … Pauses on hover.
    useEffect(() => {
        if (!hasCarousel || paused) return;
        const id = setInterval(() => setIndex((i) => i + 1), SLIDE_INTERVAL);
        return () => clearInterval(id);
    }, [hasCarousel, paused]);

    // When we land on the trailing clone, jump back to the real first slide with
    // the transition switched off, so the loop looks continuous in one direction.
    useEffect(() => {
        if (index !== realCount) return;
        const id = setTimeout(() => {
            setAnimate(false);
            setIndex(0);
        }, TRANSITION_MS);
        return () => clearTimeout(id);
    }, [index, realCount]);

    // Re-enable the transition on the next frame, after the silent snap-back.
    useEffect(() => {
        if (animate) return;
        const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
        return () => cancelAnimationFrame(raf);
    }, [animate]);

    const goTo = (i) => {
        setAnimate(true);
        setIndex(i);
    };

    // Clamp to the children actually rendered (hero=1, hero+promo+clone=3).
    const childCount = heroBanner ? 3 : 1;
    const clampedIndex = Math.min(index, childCount - 1);
    const activeDot = index % realCount; // clone (index === realCount) maps to dot 0

    return (
        <section
            className="relative min-h-[90vh] overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div
                className="flex h-full w-full"
                style={{
                    transform: `translateX(-${clampedIndex * 100}%)`,
                    transition: animate ? `transform ${TRANSITION_MS}ms ease-in-out` : "none",
                }}
            >
                <div className="w-full shrink-0">
                    <HeroMainSlide />
                </div>
                {heroBanner && (
                    <div className="w-full shrink-0">
                        <HeroPromoSlide banner={heroBanner} />
                    </div>
                )}
                {heroBanner && (
                    <div className="w-full shrink-0" aria-hidden="true">
                        <HeroMainSlide />
                    </div>
                )}
            </div>

            {/* Slide indicators */}
            {hasCarousel && (
                <div className="absolute bottom-13 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {Array.from({ length: realCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-3 w-3 border-2 border-mc-primary transition-colors cursor-pointer ${
                                activeDot === i ? "bg-mc-grass" : "bg-white"
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function HeroMainSlide() {
    return (
        <div className="relative min-h-[90vh] flex flex-col overflow-hidden">
            {/* Background gradient base */}
            <div className="absolute inset-0 bg-linear-to-r from-[#e8f5e0] via-[#f0f9ea] to-[#e8f5e0]" />

            {/* Main hero content row */}
            <div className="relative flex-1 flex items-stretch">
                {/* Left content */}
                <div className="relative z-10 flex items-center w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="max-w-2xl">
                        {/* Pixel badge */}
                        <div style={{ animationDelay: "0ms" }} className="mc-bump-in inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-8">
                            <PixelPaw className="w-5 h-5 text-mc-primary" />
                            <span className="text-sm font-medium text-black">Professional Veterinary Service</span>
                        </div>

                        {/* Main heading */}
                        <h1 style={{ animationDelay: "130ms" }} className="mc-bump-in font-pixel text-2xl sm:text-3xl md:text-4xl text-black leading-relaxed mb-6">
                            Compassionate Care<br />for Your Pets
                        </h1>

                        {/* Subheading */}
                        <p style={{ animationDelay: "260ms" }} className="mc-bump-in font-sans text-lg md:text-xl text-black mb-8 max-w-xl">
                            Your trusted veterinary clinic providing expert medical care, consultations, and treatments for all your beloved companions.
                        </p>

                        {/* CTA Buttons */}
                        <div style={{ animationDelay: "390ms" }} className="mc-bump-in flex flex-col sm:flex-row gap-4 mb-12">
                            <Link to="/appointment">
                                <Button className="font-pixel">Book Appointment</Button>
                            </Link>
                            <Link to="/services">
                                <Button className="font-pixel bg-white" variant="outline">Our Services</Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div style={{ animationDelay: "520ms" }} className="mc-bump-in inline-grid grid-cols-3 gap-0 border-2 border-mc-primary bg-mc-grass overflow-hidden">
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
                <div style={{ animationDelay: "650ms" }} className="mc-bump-in hidden hero-img:block absolute right-0 bottom-0 h-full w-auto overflow-visible">
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
        </div>
    );
}

const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// "17:00" (native time input) → "5:00 PM". Returns "" for blank/invalid input.
const formatTime = (value) => {
    if (!value) return "";
    const [h, m] = value.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return "";
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

function HeroPromoSlide({ banner }) {
    const logos = Array.isArray(banner.partnerLogos) ? banner.partnerLogos : [];

    return (
        <div className="relative min-h-[90vh] flex flex-col overflow-hidden">
            {/* Background gradient base */}
            <div className="absolute inset-0 bg-linear-to-r from-[#e8f5e0] via-[#f0f9ea] to-[#e8f5e0]" />

            <div className="relative flex-1 flex items-stretch">
                {/* Left content */}
                <div className="relative z-10 flex items-center w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-8">
                            <Syringe className="w-5 h-5 text-mc-primary"/>
                            <span className="text-sm font-medium text-black">Special Campaign</span>
                        </div>

                        {/* Title */}
                        <h2 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-black leading-relaxed mb-6">
                            {banner.title}
                        </h2>

                        {/* Description */}
                        <p className="font-sans text-lg md:text-xl text-black mb-8 max-w-xl">
                            {banner.description}
                        </p>
                        
                        <div className='inline-grid grid-cols-1'>

                            {/* Date range + time */}
                            <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-2 border-mc-primary bg-mc-grass text-white px-5 py-3 mb-2">
                                <span className="font-sans font-semibold text-sm sm:text-base">
                                    {formatDate(banner.startDate)} – {formatDate(banner.endDate)}
                                </span>
                                {(banner.startTime || banner.endTime) && (
                                    <>
                                        <span className="opacity-60">|</span>
                                        <span className="font-sans font-semibold text-sm sm:text-base">
                                            {[formatTime(banner.startTime), formatTime(banner.endTime)].filter(Boolean).join(" – ")}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Location */}
                            {banner.location && (
                                <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-2 border-mc-primary bg-mc-grass text-white px-5 py-3 mb-8">
                                    <span className="flex items-center gap-2 font-sans font-semibold text-sm sm:text-base">
                                        <MapPin className="w-5 h-5 shrink-0" />
                                        {banner.location}
                                    </span>
                                    {banner.mapUrl && (
                                        <a
                                            href={banner.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-sans font-bold text-sm underline whitespace-nowrap hover:opacity-80"
                                        >
                                            View on map →
                                        </a>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Partner logos */}
                        {logos.length > 0 && (
                            <div>
                                <div className="font-sans text-xs uppercase tracking-wide text-black/50 mb-3">
                                    Sponsored by
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    {logos.map((logo, i) => (
                                        <div
                                            key={i}
                                            className="h-12 banner:h-15 flex items-center bg-white shadow-mc-flat"
                                        >
                                            <img
                                                src={getGDriveUrl(logo)}
                                                alt={`Partner ${i + 1}`}
                                                className="h-12 banner:h-15 w-auto object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right photo */}
                <div className="hidden hero-img:block absolute right-0 bottom-0 h-full w-auto overflow-visible">
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
                            src={getGDriveUrl(banner.imageUrl)}
                            alt={banner.title}
                            className="h-full w-auto object-contain object-right"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
