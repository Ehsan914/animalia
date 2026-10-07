import { Link } from "react-router-dom"
import Icon from "../ui/Icon"
import { localPhone, openStatus, telHref } from "../../utils/clinicProfile"

// Hero copy: live open status and the emergency line, the headline, the intro and
// the thumb row (book a visit, call the front desk).
export default function HeroIntro({ profile }) {
    const status = profile && openStatus(profile)

    return (
        <div className="hero-main">
            {profile && (
                <ul className="hero-status">
                    <li>
                        <span className={`dot${status.open ? "" : " dot--closed"}`} />
                        <span>{status.text}</span>
                    </li>
                    <li>
                        <span className="dot dot--alert" />
                        <a
                            href={telHref(profile.emergencyPhone)}
                            aria-label={`${profile.emergency24h ? "Emergency 24/7" : "Emergency"}, call ${localPhone(profile.emergencyPhone)}`}
                        >
                            {profile.emergency24h ? "Emergency 24/7" : "Emergency line"}
                        </a>
                    </li>
                </ul>
            )}
            <h1 className="display hero-title" id="hero-title">
                <span className="line"><span>Gentle care</span></span>
                <span className="line"><span>for every companion.</span></span>
            </h1>
            <p className="hero-intro">
                Veterinary care for dogs, cats and small pets, from routine check-ups and vaccinations
                to diagnosis, treatment and surgery.
            </p>
            <div className="hero-actions">
                <Link className="btn btn--paper" to="/appointment">
                    Book a visit <Icon name="arrow-right" className="icon-arrow" />
                </Link>
                {profile && (
                    <a className="hero-call" href={telHref(profile.phone)}>
                        <Icon name="phone" />
                        <span>Front desk <b className="nowrap">{localPhone(profile.phone)}</b></span>
                    </a>
                )}
            </div>
        </div>
    )
}
