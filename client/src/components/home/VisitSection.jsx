import { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Icon from "../ui/Icon"
import { localPhone, openStatus, telHref } from "../../utils/clinicProfile"
import { gsap, motionAllowed } from "./motion"

// The map unmasks from the left, settling from a slight zoom.
function useMapEntrance(mapRef) {
    useLayoutEffect(() => {
        const map = mapRef.current
        if (!map || !motionAllowed()) return
        const ctx = gsap.context(() => {
            gsap.timeline({ scrollTrigger: { trigger: map, start: "top 80%", once: true } })
                .from(map, { clipPath: "inset(0 100% 0 0 round 22px)", duration: 0.9, ease: "expo.out" })
                .from("iframe", { scale: 1.08, duration: 1.1, ease: "expo.out" }, 0)
        }, map)
        return () => ctx.revert()
    }, [mapRef])
}

// "Visit the clinic": address, live open status, hours and phone beside the real map.
export default function VisitSection({ profile }) {
    const mapRef = useRef(null)
    useMapEntrance(mapRef)
    const status = openStatus(profile)

    return (
        <section className="visit" id="visit" aria-labelledby="visit-title">
            <div className="wrap visit-grid">
                <div className="visit-info">
                    <h2 className="h2" id="visit-title">Visit the clinic</h2>
                    <p className="visit-status">
                        <span className={`dot${status.open ? "" : " dot--closed"}`} />
                        <span>{status.text}</span>
                    </p>

                    <dl className="visit-list">
                        <div>
                            <dt><Icon name="map-pin" />Address</dt>
                            <dd>
                                {profile.streetAddress}<br />
                                {profile.locality} {profile.postalCode}
                                {profile.landmark && <><br /><span className="muted">{profile.landmark}</span></>}
                            </dd>
                        </div>
                        <div>
                            <dt><Icon name="clock" />Hours</dt>
                            <dd>
                                Every day, {profile.opensAt} – {profile.closesAt}
                                {profile.emergency24h && <><br /><span className="muted">Emergency line 24/7</span></>}
                            </dd>
                        </div>
                        <div>
                            <dt><Icon name="phone" />Phone</dt>
                            <dd>
                                <a href={telHref(profile.phone)}>{localPhone(profile.phone)}</a><br />
                                <a className="muted" href={`mailto:${profile.email}`}>{profile.email}</a>
                            </dd>
                        </div>
                    </dl>

                    <div className="visit-actions">
                        <Link className="btn" to="/appointment">
                            Book a visit <Icon name="arrow-right" className="icon-arrow" />
                        </Link>
                        <a className="btn btn--line" href={profile.directionsUrl} target="_blank" rel="noopener noreferrer">
                            Directions <Icon name="arrow-up-right" />
                        </a>
                    </div>
                </div>

                <div className="visit-map" ref={mapRef}>
                    <iframe
                        title="Map to Animalia Vet Care"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={profile.mapEmbedUrl}
                    />
                </div>
            </div>
        </section>
    )
}
