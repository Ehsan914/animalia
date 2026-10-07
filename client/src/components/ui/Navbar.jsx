import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import Icon from "./Icon"
import { useClinicProfile } from "../../context/SiteDataContext"
import { localPhone, telHref } from "../../utils/clinicProfile"

const NAV = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/vets", label: "Our vets" },
    { to: "/about", label: "About" },
    { to: "/blogs", label: "Blog" },
    { to: "/contact", label: "Contact" },
]

// Fixed navy header. On phones the links move into a sheet and the emergency line
// becomes a one-tap call button.
export default function Navbar() {
    const profile = useClinicProfile()
    const { pathname } = useLocation()
    // The sheet belongs to the page it was opened on, so any navigation (a sheet
    // link, the header logo or "Book a visit", browser Back) closes it.
    const [openOn, setOpenOn] = useState(null)
    const open = openOn === pathname
    const close = () => setOpenOn(null)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        if (!open) return
        const onKey = (e) => { if (e.key === "Escape") setOpenOn(null) }
        document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [open])

    const emergency = profile && {
        href: telHref(profile.emergencyPhone),
        number: localPhone(profile.emergencyPhone),
        label: profile.emergency24h ? "Emergency 24/7" : "Emergency",
    }

    return (
        <header className={`nav on-navy${scrolled ? " is-scrolled" : ""}`}>
            <div className="wrap">
                <Link className="nav-logo" to="/" aria-label="Animalia Vet Care, home">
                    <img src="/logo.svg" alt="" width="162" height="46" />
                </Link>
                <ul className="nav-links">
                    {NAV.map((item) => (
                        <li key={item.to}>
                            <NavLink to={item.to} end={item.to === "/"}>{item.label}</NavLink>
                        </li>
                    ))}
                </ul>
                <div className="nav-actions">
                    {emergency && (
                        <>
                            <a className="nav-sos" href={emergency.href} aria-label={`Call the emergency line, ${emergency.number}`}>
                                <Icon name="phone" />
                                <span className="dot dot--alert" />
                            </a>
                            <a className="nav-emergency" href={emergency.href} aria-label={`${emergency.label}, call ${emergency.number}`}>
                                <span className="dot dot--alert" />
                                <span>{emergency.label}</span>
                            </a>
                        </>
                    )}
                    {pathname !== "/appointment" && (
                        <Link className="btn btn--paper" to="/appointment">Book a visit</Link>
                    )}
                    <button
                        className="nav-menu-btn"
                        type="button"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        aria-controls="nav-sheet"
                        onClick={() => setOpenOn(open ? null : pathname)}
                    >
                        <span />
                    </button>
                </div>
            </div>
            <nav className={`nav-sheet on-navy${open ? " is-open" : ""}`} id="nav-sheet" aria-label="Mobile">
            {NAV.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={close}>
                    {item.label} <span aria-hidden="true">→</span>
                </NavLink>
            ))}
            {emergency && (
                <a href={emergency.href}>
                    {emergency.label} · {emergency.number} <span aria-hidden="true">→</span>
                </a>
            )}
            </nav>
        </header>
    )
}
