import { Link } from 'react-router';
import { getServiceIcon } from "../../constants/serviceIcons";
import Button from "../ui/Button"
import Reveal from "../ui/Reveal"

export function ServicesSection({ services = [] }) {
    return (
        <section className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <Reveal className="text-center mb-16">
                    <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-black mb-4">
                        Our Services
                    </h2>
                    <p className="text-black max-w-2xl mx-auto">
                        Comprehensive veterinary care for your beloved companions, from routine check-ups to specialized treatments.
                    </p>
                </Reveal>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                            const Icon = getServiceIcon(service.icon_key)
                            return (
                                <Reveal
                                    as={Link}
                                    key={service.id}
                                    to={`/services#service-${service.id}`}
                                    delay={index * 70}
                                    className="group bg-mc-creeper p-6 border-4 border-mc-primary shadow-mc-sharp hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                    <div className="flex flex-col items-start">
                                        <div className="w-12 h-12 bg-mc-grass flex items-center justify-center mb-4">
                                            <Icon className="w-8 h-8 text-mc-mint" />
                                        </div>
                                        <h3 className="font-pixel text-[10px] sm:text-xs text-black mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-black">
                                            {service.short_desc}
                                        </p>
                                        <span className="mt-4 text-sm text-mc-grass font-medium group-hover:underline">
                                            Learn more →
                                        </span>
                                    </div>
                                </Reveal>
                            )
                        })}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link to="/services">
                        <Button>View All Services</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}