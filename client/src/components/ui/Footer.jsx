import { Link } from "react-router-dom"
import Icon from "./Icon"
import { useClinicProfile, useSiteData } from "../../context/SiteDataContext"
import { localPhone, telHref } from "../../utils/clinicProfile"
import { serviceAnchor } from "../../constants/serviceIcons"

const QUICK_LINKS = [
    { to: "/about", label: "About us" },
    { to: "/services", label: "Services" },
    { to: "/vets", label: "Our vets" },
    { to: "/blogs", label: "Blog" },
]

const FOOTER_SERVICES = 4

export default function Footer() {
    const profile = useClinicProfile()
    const { services } = useSiteData()

    return (
        <footer className="footer on-navy">
            <div className="wrap">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" aria-label="Animalia Vet Care, home">
                            <img src="/logo.svg" alt="" width="204" height="58" />
                        </Link>
                        <p>Compassionate care for your beloved pets. Professional veterinary services you can trust.</p>
                        {profile?.facebookUrl && (
                            <div className="footer-social">
                                <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Animalia Vet Care on Facebook">
                                    <Icon name="facebook-logo" />
                                </a>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3>Quick links</h3>
                        <ul>
                            {QUICK_LINKS.map((link) => (
                                <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {services.length > 0 && (
                        <div>
                            <h3>Services</h3>
                            <ul>
                                {services.slice(0, FOOTER_SERVICES).map((service) => (
                                    <li key={service.id}>
                                        <Link to={`/services#${serviceAnchor(service)}`}>{service.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {profile && (
                        <div>
                            <h3>Contact</h3>
                            <ul className="footer-contact">
                                <li>
                                    {profile.streetAddress}<br />{profile.locality} {profile.postalCode}
                                    {profile.landmark && <><br /><span className="footer-muted">{profile.landmark}</span></>}
                                </li>
                                <li>Front desk <a href={telHref(profile.phone)}>{localPhone(profile.phone)}</a></li>
                                <li>Email <a href={`mailto:${profile.email}`}>{profile.email}</a></li>
                                <li className="footer-emergency">
                                    <span className="dot dot--alert" />
                                    <a href={telHref(profile.emergencyPhone)}>
                                        {profile.emergency24h ? "Emergency 24/7" : "Emergency"} · {localPhone(profile.emergencyPhone)}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="footer-base">
                    <span>© {new Date().getFullYear()} <b>Animalia Vet Clinic</b>. All rights reserved.</span>
                    <span className="footer-made">
                        Made with <Icon name="heart" /><span className="sr-only">love</span> for pets
                    </span>
                </div>
            </div>
        </footer>
    )
}
