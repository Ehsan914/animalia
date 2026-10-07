import { useLayoutEffect, useRef } from "react"
import Icon from "../ui/Icon"
import { localPhone, telHref } from "../../utils/clinicProfile"
import { gsap, motionAllowed } from "./motion"

// The only light-blue band: the emergency line set large.
export default function EmergencySection({ profile }) {
    const sectionRef = useRef(null)

    // The headline rises line by line out of its mask.
    useLayoutEffect(() => {
        const section = sectionRef.current
        if (!section || !motionAllowed()) return
        const ctx = gsap.context(() => {
            gsap.from("[data-lines] .line > span", {
                scrollTrigger: { trigger: section, start: "top 75%", once: true },
                yPercent: 110, duration: 0.8, ease: "expo.out", stagger: 0.08,
            })
        }, section)
        return () => ctx.revert()
    }, [])

    return (
        <section className="emergency" aria-labelledby="emergency-title" ref={sectionRef}>
            <div className="wrap emergency-grid">
                <div>
                    <p className="emergency-kicker">
                        <span className="dot dot--alert" />
                        {profile.emergency24h ? "Emergency line, day and night" : "Emergency line"}
                    </p>
                    <h2 className="h2" id="emergency-title" data-lines="">
                        <span className="line"><span>Something's wrong</span></span>
                        <span className="line"><span>and it can't wait?</span></span>
                    </h2>
                </div>
                <div className="emergency-call">
                    <p>Call before you set off. Tell us what happened, and we'll be ready when you arrive.</p>
                    <a className="emergency-number num" href={telHref(profile.emergencyPhone)}>
                        <Icon name="phone" />{localPhone(profile.emergencyPhone)}
                    </a>
                </div>
            </div>
        </section>
    )
}
