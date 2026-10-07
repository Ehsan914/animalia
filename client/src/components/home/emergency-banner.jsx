import { Link } from "react-router"
import { Phone, PixelMedical } from "../icons/pixel-icons"
import Reveal from "../ui/Reveal"
import { buttonClassName } from "../ui/buttonClassName"
import { useClinicProfile } from "../../context/SiteDataContext"
import { formatPhone, telHref } from "../../utils/clinicProfile"

export function EmergencyBanner() {
    const profile = useClinicProfile()
    if (!profile) return null

    return (
        <section className="bg-mc-emergency py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal as="div" className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center">
                    <PixelMedical className="w-8 h-8 text-mc-heart" />
                    </div>
                    <div>
                    <h3 className="font-pixel text-xs sm:text-sm text-white">
                        {profile.emergency24h ? "24/7 Emergency Care" : "Emergency Care"}
                    </h3>
                    <p className="text-white/90 text-sm">
                        {profile.emergency24h
                            ? "Pet emergency? We're here for you around the clock."
                            : "Pet emergency? Call us straight away."}
                    </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <a
                        href={telHref(profile.emergencyPhone)}
                        className={buttonClassName("ghost", "flex items-center gap-2 font-sans text-[15px] py-2 font-bold text-mc-heart bg-white shadow-mc-emergency")}
                    >
                        <Phone className="w-8 h-8 mb-2" />
                        <span>Call: {formatPhone(profile.emergencyPhone)}</span>
                    </a>
                    <Link
                    to="/contact"
                    className="text-white font-sans font-bold hover:underline text-sm"
                    >
                        Or visit our clinic →
                    </Link>
                </div>
                </Reveal>
            </div>
        </section>
    )
}
