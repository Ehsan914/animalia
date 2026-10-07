import { Link } from "react-router-dom"
import Icon from "../components/ui/Icon"
import PageHead from "../components/pages/PageHead"
import CtaCard from "../components/pages/CtaCard"
import useReveal from "../components/pages/useReveal"
import { vetAnchor } from "../components/pages/vetAnchor"
import { getGDriveUrl } from "../utils/gdrive"
import { localPhone, telHref } from "../utils/clinicProfile"
import { useClinicProfile, useSiteData } from "../context/SiteDataContext"
import { PageSEO } from "../components/SEO"
import "../styles/pages.css"

// "Beside Shewrapara Metro Station" → "beside Shewrapara Metro Station", to sit mid-sentence.
const midSentence = (text) => text.charAt(0).toLowerCase() + text.slice(1)

const FounderCard = ({ vet, index }) => (
    <article className="founder" data-reveal style={{ "--i": index }}>
        <figure className="photo founder-photo">
            <img src={getGDriveUrl(vet.img_url)} alt={vet.name} loading="lazy" />
        </figure>
        <div className="founder-body">
            <h3>{vet.name}</h3>
            <p className="founder-role">{vet.designation}</p>
            <ul className="creds">
                <li><Icon name="graduation-cap" />{vet.degree}</li>
                <li><Icon name="certificate" />{vet.experience}+ years in clinical practice</li>
                {vet.specialities?.length > 0 && (
                    <li><Icon name="stethoscope" />{vet.specialities.map((s) => s.name).join(", ")}</li>
                )}
            </ul>
            <Link className="text-link" to={`/vets#${vetAnchor(vet)}`}>
                Full profile <Icon name="arrow-right" className="icon-arrow" />
            </Link>
        </div>
    </article>
)

const CareCards = ({ profile }) => (
    <ul className="care-cards">
        <li data-reveal>
            <span className="care-icon"><Icon name="hand-heart" /></span>
            <h3>Gentle hands</h3>
            <p>We treat every pet as if they were our own, with patience and a calm approach, so they feel safe while they are with us.</p>
        </li>
        <li data-reveal style={{ "--i": 1 }}>
            <span className="care-icon"><Icon name="chats-circle" /></span>
            <h3>Clear answers</h3>
            <p>We explain what we find and the treatment plan before we start, and take the time to answer your questions.</p>
        </li>
        <li data-reveal style={{ "--i": 2 }}>
            <span className="care-icon"><Icon name="calendar-check" /></span>
            <h3>Follow-up care</h3>
            <p>After treatment or surgery we check on your pet&apos;s recovery and set the next visit, so nothing is left to memory.</p>
        </li>
        <li data-reveal style={{ "--i": 3 }}>
            <span className="care-icon care-icon--alert"><Icon name="siren" /></span>
            <h3>Help at any hour</h3>
            {profile ? (
                <p>
                    {profile.emergency24h ? "The emergency line answers 24/7. " : ""}
                    Call <a href={telHref(profile.emergencyPhone)}>{localPhone(profile.emergencyPhone)}</a> before you set off and we will be ready.
                </p>
            ) : (
                <p>Call the emergency line before you set off and we will be ready.</p>
            )}
        </li>
    </ul>
)

const AboutPage = () => {
    const { vets } = useSiteData()
    const profile = useClinicProfile()
    useReveal(vets.length)

    const where = profile?.landmark ? ` ${midSentence(profile.landmark)}` : " in Mirpur"
    const founders = vets.map((vet) => vet.name).join(" and ")

    return (
        <>
            <PageSEO page="about" />
            <PageHead
                title={["Opened in 2024,", "right here in Mirpur."]}
                lede={`A clinic${where}, founded by ${founders || "two vets"}, where clinical expertise and genuine compassion go hand in hand.`}
            />

            <section className="section">
                <div className="wrap split split--center">
                    <figure className="photo about-photo" data-reveal>
                        <img
                            src="/images/about-vets.jpg"
                            width="1050"
                            height="1400"
                            alt="Dr. Md. Easin and Dr. Nafisa Noor standing back to back in white coats"
                        />
                    </figure>
                    <div className="prose" data-reveal style={{ "--i": 1 }}>
                        <h2 className="h2">Our story</h2>
                        <p>Founded in 2024, Animalia Vet Care started with a simple mission: to provide compassionate, high-quality veterinary care that every pet deserves. What began as a small clinic has grown into a trusted healthcare destination for thousands of pets in our community.</p>
                        <p>Our founders, Dr. Md. Easin and Dr. Nafisa Noor, established this clinic with the belief that veterinary care should be accessible, affordable, and delivered with genuine compassion. Today, our team of experienced veterinarians continues to uphold these values every day.</p>
                        <p>We&apos;ve treated over 900 pets and counting, from routine check-ups to complex surgeries. Our minimal clinic setup reflects our belief that visiting the vet should be a positive experience for both pets and their families.</p>
                        <ul className="story-facts">
                            <li><span className="fact-icon"><Icon name="calendar-check" /></span><span><b>Since 2024</b>Open every day</span></li>
                            <li><span className="fact-icon"><Icon name="dog" /></span><span><b>900+ pets</b>And counting</span></li>
                            <li><span className="fact-icon"><Icon name="map-pin" /></span><span><b>Mirpur</b>By the metro</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="section section--navy on-navy">
                <div className="wrap">
                    <article className="mv-row" data-reveal>
                        <p className="mv-label"><span className="mv-icon"><Icon name="heartbeat" /></span>Our mission</p>
                        <p className="mv-text">To give every pet excellent care, with compassion and skill, so they live their <span>healthiest, happiest life</span>, and to build lasting relationships with the families who love them.</p>
                    </article>
                    <article className="mv-row" data-reveal>
                        <p className="mv-label"><span className="mv-icon"><Icon name="compass" /></span>Our vision</p>
                        <p className="mv-text">To be the most trusted, caring vet clinic in our community, known for <span>good medicine</span> and for the bonds we build with pets and their families.</p>
                    </article>
                </div>
            </section>

            <section className="section">
                <div className="wrap">
                    <div className="section-head" data-reveal>
                        <h2 className="h2">How we look after your pet</h2>
                        <p className="muted">Compassion, care and commitment, in the things you notice at every visit.</p>
                    </div>
                    <CareCards profile={profile} />
                </div>
            </section>

            {vets.length > 0 && (
                <section className="section section--mist">
                    <div className="wrap">
                        <div className="section-head" data-reveal>
                            <h2 className="h2">The vets behind Animalia</h2>
                            {vets.length === 2 && (
                                <p className="muted">Both graduated from Sher-e-Bangla Agricultural University, trained in Thailand, and are registered with the Bangladesh Veterinary Council.</p>
                            )}
                        </div>
                        <div className="founders">
                            {vets.map((vet, i) => <FounderCard key={vet.id} vet={vet} index={i} />)}
                        </div>
                    </div>
                </section>
            )}

            <CtaCard
                title="Come and see us."
                text={profile
                    ? `Open every day, ${profile.opensAt} – ${profile.closesAt},${where}.`
                    : "Open every day in Mirpur."}
                photo="/images/checkup.jpg"
                photoAlt="Dr. Md. Easin holding a kitten in the clinic"
                photoPosition="50% 25%"
            >
                <Link className="btn btn--paper" to="/appointment">
                    Book a visit <Icon name="arrow-right" className="icon-arrow" />
                </Link>
                <Link className="text-link" to="/contact">Find the clinic</Link>
            </CtaCard>
        </>
    )
}

export default AboutPage
