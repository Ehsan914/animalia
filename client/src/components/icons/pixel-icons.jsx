export function PixelPaw({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <rect x="4" y="2" width="4" height="4" />
        <rect x="16" y="2" width="4" height="4" />
        <rect x="2" y="8" width="4" height="4" />
        <rect x="18" y="8" width="4" height="4" />
        <rect x="6" y="12" width="12" height="4" />
        <rect x="8" y="16" width="8" height="4" />
        <rect x="10" y="20" width="4" height="2" />
        </svg>
    );
}

export function PixelHeart({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <rect x="4" y="4" width="4" height="4" />
        <rect x="8" y="2" width="4" height="4" />
        <rect x="12" y="2" width="4" height="4" />
        <rect x="16" y="4" width="4" height="4" />
        <rect x="2" y="8" width="4" height="4" />
        <rect x="6" y="8" width="4" height="4" />
        <rect x="10" y="8" width="4" height="4" />
        <rect x="14" y="8" width="4" height="4" />
        <rect x="18" y="8" width="4" height="4" />
        <rect x="4" y="12" width="4" height="4" />
        <rect x="8" y="12" width="4" height="4" />
        <rect x="12" y="12" width="4" height="4" />
        <rect x="16" y="12" width="4" height="4" />
        <rect x="6" y="16" width="4" height="4" />
        <rect x="10" y="16" width="4" height="4" />
        <rect x="14" y="16" width="4" height="4" />
        <rect x="10" y="20" width="4" height="4" />
        </svg>
    );
}

export function PixelMedical({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <rect x="10" y="2" width="4" height="8" />
        <rect x="2" y="10" width="20" height="4" />
        <rect x="10" y="14" width="4" height="8" />
        </svg>
    );
}

export function PixelSyringe({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <rect x="18" y="2" width="4" height="4" />
        <rect x="14" y="6" width="4" height="4" />
        <rect x="10" y="10" width="4" height="4" />
        <rect x="6" y="10" width="4" height="8" />
        <rect x="10" y="14" width="4" height="4" />
        <rect x="2" y="18" width="4" height="4" />
        </svg>
    );
}

export function PixelStethoscope({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <rect x="4" y="2" width="4" height="4" />
        <rect x="16" y="2" width="4" height="4" />
        <rect x="2" y="6" width="4" height="6" />
        <rect x="18" y="6" width="4" height="6" />
        <rect x="6" y="10" width="4" height="4" />
        <rect x="14" y="10" width="4" height="4" />
        <rect x="10" y="12" width="4" height="4" />
        <rect x="10" y="16" width="4" height="4" />
        <rect x="8" y="20" width="8" height="4" />
        </svg>
    );
}

export function PixelPill({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <rect x="6" y="4" width="4" height="4" />
        <rect x="10" y="4" width="4" height="4" />
        <rect x="4" y="8" width="4" height="4" />
        <rect x="8" y="8" width="4" height="4" />
        <rect x="12" y="8" width="4" height="4" />
        <rect x="8" y="12" width="4" height="4" />
        <rect x="12" y="12" width="4" height="4" />
        <rect x="16" y="12" width="4" height="4" />
        <rect x="14" y="16" width="4" height="4" />
        <rect x="10" y="16" width="4" height="4" />
        </svg>
    );
}

export function PixelScalpel({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <rect x="18" y="2" width="4" height="4" />
        <rect x="14" y="6" width="4" height="4" />
        <rect x="10" y="10" width="4" height="4" />
        <rect x="6" y="14" width="4" height="4" />
        <rect x="2" y="18" width="6" height="4" />
        </svg>
    );
}

export function PixelPhone({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <rect x="6" y="2" width="12" height="4" />
            <rect x="4" y="6" width="4" height="12" />
            <rect x="16" y="6" width="4" height="12" />
            <rect x="6" y="18" width="12" height="4" />
        </svg>
    );
}

export function InstagramIcon({ className = "" }) {
    return <img src={new URL('../icons/instagram-detailed.svg', import.meta.url).href} className={className} alt="Instagram" />;
}

export function FacebookIcon({ className = "" }) {
    return <img src={new URL('../icons/facebook-detailed.svg', import.meta.url).href} className={className} alt="Facebook" />;
}

export function Heart({ className = "" }) {
    return <img src={new URL('../icons/heart.svg', import.meta.url).href} className={className} alt="Heart" />;
}

export function AnimaliaLogo({ className = "" }) {
    return <img src={new URL('../icons/animalia-pixelated.svg', import.meta.url).href} className={className} alt="AnimaliaLogo" />;
}

export function AnimaliaLogoGreen({ className = "" }) {
    return <img src={new URL('../icons/animalia-green.svg', import.meta.url).href} className={className} alt="AnimaliaLogoGreen" />;
}

export function AnimaliaLogoWhite({ className = "" }) {
    return <img src={new URL('../icons/animalia-white.svg', import.meta.url).href} className={className} alt="AnimaliaLogoWhite" />;
}

export function GreenPaw({ className = "" }) {
    return <img src={new URL('../icons/green-paw.svg', import.meta.url).href} className={className} alt="GreenPaw" />;
}

export function WhitePaw({ className = "" }) {
    return <img src={new URL('../icons/white-paw.svg', import.meta.url).href} className={className} alt="WhitePaw" />;
}