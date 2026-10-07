import { Link } from "react-router"
import { WhatsApp } from "../../components/icons/pixel-icons"
import Button from "../../components/ui/Button"
import Reveal from "../../components/ui/Reveal"
import { buttonClassName } from "../../components/ui/buttonClassName"
import ClinicMap from "../clinic/ClinicMap"
import OpeningHours from "../clinic/OpeningHours"
import { useClinicProfile } from "../../context/SiteDataContext"
import { telHref, whatsAppHref, DEFAULT_WHATSAPP_MESSAGE } from "../../utils/clinicProfile"

const ContactSection = () => {
    const profile = useClinicProfile()
    if (!profile) return null

    return (
        <section className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <Reveal className="text-center mb-16">
                    <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-black mb-4">
                        Contact Us
                    </h2>
                    <p className="text-black max-w-2xl mx-auto">
                        Visit us, chat, or call — we're always here for your beloved companions.
                    </p>
                </Reveal>

                {/* Map + Contact Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Map Card */}
                    <div className="border-4 border-mc-primary shadow-mc-sharp relative overflow-hidden min-h-75 aspect-square lg:aspect-auto">
                        <ClinicMap profile={profile} />
                    </div>

                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        {/* Operating Hours */}
                        <div className="bg-mc-creeper p-6 border-4 border-mc-primary shadow-mc-sharp">
                            <h3 className="font-pixel text-[10px] sm:text-xs text-black mb-4">
                                Operating Hours
                            </h3>
                            <OpeningHours profile={profile} />
                        </div>

                        {/* WhatsApp */}
                        <a
                            href={whatsAppHref(profile.whatsappNumber, DEFAULT_WHATSAPP_MESSAGE)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 bg-mc-grass p-6 border-4 border-mc-primary shadow-mc-sharp hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            <div className="w-12 h-12 flex items-center justify-center shrink-0">
                                <WhatsApp className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-pixel text-[10px] text-white mb-1">
                                    Chat on WhatsApp
                                </p>
                                <p className="text-sm text-white/80">
                                    Quick responses during business hours
                                </p>
                            </div>
                        </a>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/appointment">
                                <Button className="w-full">Book Visit</Button>
                            </Link>
                            <a
                                href={telHref(profile.emergencyPhone)}
                                className={buttonClassName("primary", "w-full bg-mc-emergency border-4 border-mc-heart shadow-mc-emergency p-4 text-center")}
                            >
                                <p className="font-pixel text-[10px] text-white">Emergency</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactSection
