import { Link } from "react-router-dom"
import Icon from "../components/ui/Icon"
import PageHead from "../components/pages/PageHead"
import { SEO } from "../components/SEO"
import "../styles/pages.css"

const WAYS_ON = [
    { to: "/services", icon: "first-aid", label: "Services", note: "Check-ups, vaccines, surgery and more" },
    { to: "/vets", icon: "stethoscope", label: "Our vets", note: "Meet the vets who will see your pet" },
    { to: "/contact", icon: "map-pin", label: "Contact", note: "Address, phones and opening hours" },
]

// Unknown URLs and unpublished blog posts. No demo page exists; this follows the
// inner-page language: the navy page head with a short message and two actions,
// then a paper band with the main pages so the head never runs into the footer.
const NotFoundPage = () => (
    <>
        <SEO title="Page not found" description="This page does not exist at Animalia Vet Care.">
            <meta name="robots" content="noindex" />
        </SEO>
        <PageHead
            title="We couldn’t find that page."
            lede="It may have moved, or the link has a typo. The clinic is still right where it was."
        >
            <div className="page-actions">
                <Link className="btn btn--paper" to="/">
                    Back to home <Icon name="arrow-right" className="icon-arrow" />
                </Link>
                <Link className="text-link" to="/appointment">Book a visit</Link>
            </div>
        </PageHead>

        <section className="section">
            <div className="wrap">
                <ul className="lost-links">
                    {WAYS_ON.map((way) => (
                        <li key={way.to}>
                            <Link to={way.to}>
                                <span className="fact-icon"><Icon name={way.icon} /></span>
                                <span><b>{way.label}</b>{way.note}</span>
                                <Icon name="arrow-right" className="icon-arrow" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    </>
)

export default NotFoundPage
