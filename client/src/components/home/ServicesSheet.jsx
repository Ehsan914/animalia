import { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Icon from "../ui/Icon"
import { bookingHref, getServiceIcon } from "../../constants/serviceIcons"
import { gsap, motionAllowed } from "./motion"


// Treatment sheet: the rules draw left to right, then each row's text settles in.
function useSheetEntrance(sheetRef) {
    useLayoutEffect(() => {
        const sheet = sheetRef.current
        if (!sheet || !motionAllowed()) return
        const ctx = gsap.context(() => {
            const rows = gsap.utils.toArray(".sheet-row", sheet)
            gsap.timeline({ scrollTrigger: { trigger: sheet, start: "top 82%", once: true } })
                .from(rows, { "--rs": 0, duration: 0.7, ease: "expo.out", stagger: 0.06 })
                .from(rows.map((r) => [...r.children]), { y: 12, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.02 }, 0.12)
        }, sheet)
        return () => ctx.revert()
    }, [sheetRef])
}

// "What we do": every service as a ruled row; each opens booking with that service ticked.
export default function ServicesSheet({ services }) {
    const sheetRef = useRef(null)
    useSheetEntrance(sheetRef)

    return (
        <section className="services" id="services" aria-labelledby="services-title">
            <div className="wrap">
                <h2 className="h2 section-title" id="services-title">What we do</h2>
                <ol className="sheet" ref={sheetRef}>
                    {services.map((service) => (
                        <li key={service.id}>
                            <Link className="sheet-row" to={bookingHref(service)}>
                                <Icon name={getServiceIcon(service.icon_key)} className="sheet-icon" />
                                <div>
                                    <h3>{service.title}</h3>
                                    <p>{service.short_desc}</p>
                                </div>
                                <Icon name="arrow-right" className="sheet-go" />
                            </Link>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
