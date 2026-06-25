import { useState } from "react"
import { Link } from "react-router"
import { X } from "lucide-react"
import { useSiteData } from "../../context/SiteDataContext"
import { PixelPaw, PixelMedical } from "../icons/pixel-icons"

// Colour + icon per banner type — all on the Minecraft palette.
const STYLES = {
    info:      { bar: "bg-mc-grass",     Icon: PixelPaw },
    promo:     { bar: "bg-mc-heart",     Icon: PixelPaw },
    emergency: { bar: "bg-mc-emergency", Icon: PixelMedical },
}

const DISMISS_KEY = "dismissedBannerId"

export default function BannerBar() {
    const { banner } = useSiteData()
    const [dismissed, setDismissed] = useState(false)

    if (!banner || dismissed) return null

    const style = STYLES[banner.type] ?? STYLES.promo
    const { Icon } = style
    const hasCta = banner.ctaUrl && banner.ctaLabel
    const isInternal = hasCta && banner.ctaUrl.startsWith("/")

    const dismiss = () => setDismissed(true)
    
    const cta = hasCta && (
        isInternal ? (
            <Link to={banner.ctaUrl} className="underline font-bold whitespace-nowrap hover:opacity-80">
                {banner.ctaLabel} →
            </Link>
        ) : (
            <a
                href={banner.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold whitespace-nowrap hover:opacity-80"
            >
                {banner.ctaLabel} →
            </a>
        )
    )

    return (
        <div className={`${style.bar} text-white`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                <p className="text-center text-sm font-sans font-semibold flex flex-wrap items-center justify-center gap-x-2">
                    <span>{banner.message}</span>
                    {cta}
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss announcement"
                    className="shrink-0 p-1 hover:bg-black/15 transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    )
}
