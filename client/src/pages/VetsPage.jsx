import { Link } from "react-router-dom"
import Icon from "../components/ui/Icon"
import PageHead from "../components/pages/PageHead"
import CtaCard from "../components/pages/CtaCard"
import useReveal from "../components/pages/useReveal"
import useHashScroll from "../components/pages/useHashScroll"
import { vetAnchor } from "../components/pages/vetAnchor"
import { getGDriveUrl } from "../utils/gdrive"
import { localPhone, telHref } from "../utils/clinicProfile"
import { useClinicProfile, useSiteData } from "../context/SiteDataContext"
import { PageSEO } from "../components/SEO"
import "../styles/pages.css"

const LEDE_TWO = "Two veterinary consultants and surgeons, both graduates of Sher-e-Bangla Agricultural University with clinical training in Thailand."
const LEDE_ANY = "The veterinary consultants and surgeons who look after your pets, from first vaccines to surgery."

const VetProfile = ({ vet }) => (
    <article className="vet" id={vetAnchor(vet)}>
        <figure className="photo" data-reveal>
            <img src={getGDriveUrl(vet.img_url)} alt={`Portrait of ${vet.name}`} />
        </figure>
        <div data-reveal style={{ "--i": 1 }}>
            <h2 className="vet-name">{vet.name}</h2>
            <p className="vet-role">{vet.designation}</p>
            {vet.specialities?.length > 0 && (
                <ul className="tags" aria-label="Specialities">
                    {vet.specialities.map((s) => <li key={s.id}>{s.name}</li>)}
                </ul>
            )}
            <p className="vet-bio">{vet.bio}</p>
            <dl className="facts">
                <div><dt>Degree</dt><dd>{vet.degree}</dd></div>
                <div><dt>Experience</dt><dd>{vet.experience}+ years</dd></div>
            </dl>
            {vet.fun_fact && (
                <p className="fun-fact">
                    <Icon name="heart" />
                    <span><b>Beyond the clinic</b> {vet.fun_fact}</span>
                </p>
            )}
            <Link className="btn" to="/appointment">
                Book a visit <Icon name="arrow-right" className="icon-arrow" />
            </Link>
        </div>
    </article>
)

const VetsPage = () => {
    const { vets } = useSiteData()
    const profile = useClinicProfile()
    useHashScroll()
    useReveal(vets.length)

    return (
        <>
            <PageSEO page="vets" />
            <PageHead title="Our vets" lede={vets.length === 2 ? LEDE_TWO : LEDE_ANY} />

            <section className="section">
                <div className="wrap">
                    {vets.map((vet) => <VetProfile key={vet.id} vet={vet} />)}
                </div>
            </section>

            {profile ? (
                <CtaCard
                    title="Pet emergency?"
                    text={profile.emergency24h
                        ? "The emergency line answers 24/7. Call before you set off."
                        : "Call the emergency line before you set off."}
                    photo="/images/grooming.jpg"
                    photoAlt="Dr. Nafisa Noor with a golden retriever outdoors"
                    photoPosition="50% 35%"
                >
                    <a className="btn btn--paper" href={telHref(profile.emergencyPhone)}>
                        <Icon name="phone" />Call {localPhone(profile.emergencyPhone)}
                    </a>
                    <Link className="text-link" to="/appointment">Or book a visit</Link>
                </CtaCard>
            ) : (
                <CtaCard
                    title="Come and meet us."
                    text="Book a visit and see the vets in person."
                    photo="/images/grooming.jpg"
                    photoAlt="Dr. Nafisa Noor with a golden retriever outdoors"
                    photoPosition="50% 35%"
                >
                    <Link className="btn btn--paper" to="/appointment">
                        Book a visit <Icon name="arrow-right" className="icon-arrow" />
                    </Link>
                </CtaCard>
            )}
        </>
    )
}

export default VetsPage
