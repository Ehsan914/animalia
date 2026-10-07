import Icon from "../components/ui/Icon"
import PageHead from "../components/pages/PageHead"
import MessageForm from "../components/pages/MessageForm"
import useReveal from "../components/pages/useReveal"
import ClinicMap from "../components/clinic/ClinicMap"
import OpeningHours from "../components/clinic/OpeningHours"
import { PageSEO, LocalBusinessSchema } from "../components/SEO"
import { useClinicProfile } from "../context/SiteDataContext"
import { localPhone, openStatus, telHref } from "../utils/clinicProfile"
import "../styles/pages.css"

// Address, phones, email and hours as ruled rows, all from the clinic profile.
const ContactFacts = ({ profile }) => {
    const status = openStatus(profile)

    return (
        <div data-reveal>
            <p className="contact-status">
                <span className={`dot${status.open ? "" : " dot--closed"}`} />
                <span>{status.text}</span>
            </p>
            <dl className="facts">
                <div>
                    <dt><Icon name="map-pin" />Visit</dt>
                    <dd>
                        {profile.streetAddress}<br />
                        {profile.locality} {profile.postalCode}<br />
                        {profile.landmark && <><span className="muted">{profile.landmark}</span><br /></>}
                        <a className="text-link directions" href={profile.directionsUrl} target="_blank" rel="noopener noreferrer">
                            Directions <Icon name="arrow-up-right" />
                        </a>
                    </dd>
                </div>
                <div>
                    <dt><Icon name="phone" />Front desk</dt>
                    <dd><a href={telHref(profile.phone)}>{localPhone(profile.phone)}</a></dd>
                </div>
                <div className="emergency-row">
                    <dt><span className="dot dot--alert" />Emergency</dt>
                    <dd>
                        <a href={telHref(profile.emergencyPhone)}>{localPhone(profile.emergencyPhone)}</a>
                        {profile.emergency24h && <span className="muted"> · answers 24/7</span>}
                    </dd>
                </div>
                <div>
                    <dt><Icon name="envelope-simple" />Email</dt>
                    <dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd>
                </div>
                <div>
                    <dt><Icon name="clock" />Hours</dt>
                    <dd><OpeningHours profile={profile} /></dd>
                </div>
            </dl>
        </div>
    )
}

export default function ContactPage() {
    const profile = useClinicProfile()
    useReveal(Boolean(profile))

    const emergency = profile
        ? ` For an emergency, call ${localPhone(profile.emergencyPhone)}${profile.emergency24h ? " at any hour" : ""}.`
        : ""

    return (
        <>
            <PageSEO page="contact" />
            <LocalBusinessSchema />
            <PageHead
                title="Contact us"
                lede={`Come by, call the front desk, or send us a message.${emergency}`}
            />

            <section className="section">
                <div className="wrap contact-grid">
                    {profile && <ContactFacts profile={profile} />}
                    <div className="message-card" data-reveal style={{ "--i": 1 }}>
                        <MessageForm whatsappNumber={profile?.whatsappNumber} />
                    </div>
                </div>
            </section>

            {profile?.mapEmbedUrl && (
                <section className="section">
                    <div className="wrap">
                        <div className="map-frame" data-reveal>
                            <ClinicMap profile={profile} />
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
