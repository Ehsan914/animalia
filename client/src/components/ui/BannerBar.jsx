import { useState } from "react"
import { Link } from "react-router-dom"
import Icon from "./Icon"
import { useSiteData } from "../../context/SiteDataContext"
import { safeLink } from "../banner/heroBanner"

// The admin's one-line announcement ("Banners"), under the header. Dismissal lasts
// for the visit.
export default function BannerBar() {
    const { banner } = useSiteData()
    const [dismissed, setDismissed] = useState(false)

    if (!banner || dismissed) return null

    const link = banner.ctaLabel ? safeLink(banner.ctaUrl) : null
    const type = ["info", "promo", "emergency"].includes(banner.type) ? banner.type : "promo"

    return (
        <div className={`announce announce--${type}`} role="region" aria-label="Announcement">
            <div className="wrap">
                {type === "emergency" && <span className="dot dot--alert" />}
                <p>
                    <span>{banner.message}</span>
                    {link && (link.internal ? (
                        <Link className="text-link" to={link.href}>{banner.ctaLabel}<Icon name="arrow-right" /></Link>
                    ) : (
                        <a className="text-link" href={link.href} target="_blank" rel="noopener noreferrer">
                            {banner.ctaLabel}<Icon name="arrow-up-right" />
                        </a>
                    ))}
                </p>
                <button type="button" className="announce-close" aria-label="Dismiss announcement" onClick={() => setDismissed(true)}>
                    <Icon name="x" />
                </button>
            </div>
        </div>
    )
}
