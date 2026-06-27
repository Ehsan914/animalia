import { Link } from "react-router"
import { PixelMedical, WhatsApp } from "../../components/icons/pixel-icons"
import Button from "../../components/ui/Button"
import Reveal from "../../components/ui/Reveal"

const ContactSection = () => {
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
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7949602483322!2d90.3747017!3d23.7903147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c10059bd215d%3A0xb58f1a635614a2ad!2sAnimalia%20Vet%20Care!5e0!3m2!1sen!2sbd!4v1780767823840!5m2!1sen!2sbd"
                            width="100%"
                            height="100%"
                            style={{ border: 0, position: "absolute", inset: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Animalia Vet Care Location"
                        />
                        {/* Overlay label */}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                            <div className="bg-white/90 border-2 border-mc-primary px-3 py-2 text-center shadow-mc-flat">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <PixelMedical className="w-5 h-5 text-primary" />
                                    <span className="text-xs text-black font-medium">We are here!</span>
                                </div>
                                <p className="text-xs text-black font-bold max-w-50">
                                    677 West Shewrapara, Mirpur, Dhaka 1216
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        {/* Operating Hours */}
                        <div className="bg-mc-creeper p-6 border-4 border-mc-primary shadow-mc-sharp">
                            <h3 className="font-pixel text-[10px] sm:text-xs text-black mb-4">
                                Operating Hours
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-black font-bold">Saturday – Friday</span>
                                    <span className="font-bold text-black">10:00 AM – 9:00 PM</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-mc-emergency font-bold">Emergency Services</span>
                                    <span className="font-bold text-mc-emergency">24/7 Available</span>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/1879388068?text=Hi!%20I%20would%20like%20to%20inquire%20about%20your%20veterinary%20services."
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
                            <Button className="w-full bg-mc-emergency border-4 border-mc-heart shadow-mc-emergency p-4 text-center">
                                <a
                                    href="tel:+8801879388068"
                                >
                                    <p className="font-pixel text-[10px] text-white">Emergency</p>
                                </a>
                            </Button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactSection