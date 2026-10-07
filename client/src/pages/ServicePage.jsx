import { Link } from "react-router-dom"
import Icon from "../components/ui/Icon"
import PageHead from "../components/pages/PageHead"
import CtaCard from "../components/pages/CtaCard"
import FaqSection from "../components/pages/FaqSection"
import useReveal from "../components/pages/useReveal"
import useHashScroll from "../components/pages/useHashScroll"
import { bookingHref, findService } from "../constants/serviceIcons"
import { getGDriveUrl } from "../utils/gdrive"
import { getServiceIcon, serviceAnchor } from "../constants/serviceIcons"
import { telHref } from "../utils/clinicProfile"
import { useClinicProfile, useSiteData } from "../context/SiteDataContext"
import { PageSEO } from "../components/SEO"
import "../styles/pages.css"

// Each service's own action. Medicines and accessories are asked about, not booked.
const ACTIONS = {
    checkup: { label: "Book a check-up" },
    vaccination: { label: "Book a vaccination" },
    surgery: { label: "Book a surgery consult" },
    medicine: { label: "Ask about a medicine", ask: true },
    deworming: { label: "Book deworming" },
    accessories: { label: "Ask what's in stock", ask: true },
    grooming: { label: "Book grooming" },
    diagnosis: { label: "Book a diagnosis" },
}

const ServiceRow = ({ service, isTarget }) => {
    const action = ACTIONS[service.icon_key] ?? { label: "Book this service" }

    return (
        <article className="service" id={serviceAnchor(service)} data-target={isTarget || undefined} data-reveal>
            <figure className="photo service-photo">
                <img src={getGDriveUrl(service.img_url)} alt="" loading="lazy" />
            </figure>
            <div className="service-body">
                <div className="service-name">
                    <Icon name={getServiceIcon(service.icon_key)} />
                    <h2>{service.title}</h2>
                </div>
                <p>{service.description}</p>
                {service.features?.length > 0 && (
                    <ul className="features">
                        {service.features.map((feature, i) => <li key={i}>{feature}</li>)}
                    </ul>
                )}
                <Link className="text-link" to={action.ask ? "/contact" : bookingHref(service)}>
                    {action.label} <Icon name="arrow-right" className="icon-arrow" />
                </Link>
            </div>
        </article>
    )
}

const ServicesPage = () => {
    const { services, faqs } = useSiteData()
    const profile = useClinicProfile()
    const target = useHashScroll()
    const checkup = findService(services, "checkup")
    useReveal(services.length)

    return (
        <>
            <PageSEO page="services" />
            <PageHead
                title="What we do"
                lede="Everyday care and the bigger moments, under one roof in Mirpur. Pick a service to book it."
            />

            <section className="section">
                <div className="wrap">
                    {services.map((service) => (
                        <ServiceRow key={service.id} service={service} isTarget={target === serviceAnchor(service)} />
                    ))}
                </div>
            </section>

            <FaqSection faqs={faqs} />

            <CtaCard
                title="Not sure what your pet needs?"
                text="Book a check-up and we will work it out together."
                photo="/images/vaccination.jpg"
                photoAlt="Dr. Md. Easin vaccinating a cat"
                photoPosition="50% 40%"
            >
                <Link className="btn btn--paper" to={bookingHref(checkup)}>
                    {checkup ? "Book a check-up" : "Book a visit"} <Icon name="arrow-right" className="icon-arrow" />
                </Link>
                {profile && <a className="text-link" href={telHref(profile.phone)}>Call the front desk</a>}
            </CtaCard>
        </>
    )
}

export default ServicesPage
