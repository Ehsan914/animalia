import { Link } from "react-router-dom"
import Icon from "../ui/Icon"
import { bannerImage, bannerWhen, discount, safeLink, tone, validBg } from "./heroBanner"

// A link that stays in the SPA for in-site paths and opens other sites in a new tab.
function BannerLink({ link, className, children }) {
    if (link.internal) return <Link className={className} to={link.href}>{children}</Link>
    const external = /^https?:/.test(link.href) && new URL(link.href).host !== window.location.host
    return (
        <a className={className} href={link.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {children}
        </a>
    )
}

// One hero banner, drawn the same way on the home page and in the admin preview.
// Admin text is rendered as text; links are filtered by safeLink.
export default function HeroBannerSlide({ banner, active = true }) {
    const bg = validBg(banner.bgColor)
    const photo = bannerImage(banner)
    const pct = discount(banner)
    const dates = bannerWhen(banner)
    const cta = banner.ctaLabel ? safeLink(banner.ctaUrl) : null
    const map = safeLink(banner.mapUrl)
    const hasFoot = cta || banner.location

    return (
        <article
            className={`hw-slide${photo ? "" : " hw-slide--text"}${active ? " is-active" : ""}`}
            style={{ "--bg": bg }}
            data-tone={tone(bg)}
            inert={active ? undefined : true}
        >
            {photo && (
                <figure className="hw-media">
                    <img src={photo} alt="" />
                </figure>
            )}

            {pct > 0 && (
                <p className="hw-stamp"><b>{pct}%</b><span>off</span></p>
            )}

            <div className="hw-body">
                {dates && (
                    <p className="hw-when"><Icon name="calendar-blank" />{dates}</p>
                )}
                <h2 className="hw-title">{banner.title}</h2>
                {banner.description && <p className="hw-text">{banner.description}</p>}
                {hasFoot && (
                    <div className="hw-foot">
                        {cta && (
                            <BannerLink link={cta} className="btn hw-cta">
                                {banner.ctaLabel}
                                <Icon name="arrow-right" />
                            </BannerLink>
                        )}
                        {banner.location && (map ? (
                            <a className="hw-place" href={map.href} target="_blank" rel="noopener noreferrer">
                                <Icon name="map-pin" />{banner.location}
                            </a>
                        ) : (
                            <span className="hw-place"><Icon name="map-pin" />{banner.location}</span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    )
}
