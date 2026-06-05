import { Link } from 'react-router';
import { getServiceIcon } from "../../constants/serviceIcons";
import Button from "../ui/Button"

function ServiceCardSkeleton() {
    return (
        <div className="bg-mc-creeper p-6 border-4 border-mc-primary shadow-mc-sharp animate-pulse">
            <div className="flex flex-col items-start">
                <div className="w-12 h-12 bg-mc-primary/20 mb-4" />
                <div className="h-3 w-2/3 bg-mc-primary/20 mb-2" />
                <div className="h-3 w-full bg-mc-primary/20 mb-1.5" />
                <div className="h-3 w-4/5 bg-mc-primary/20" />
                <div className="h-3 w-20 bg-mc-primary/20 mt-4" />
            </div>
        </div>
    )
}

export function ServicesSection({ services = [], loading = false }) {
    return (
        <section className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-black mb-4">
                        Our Services
                    </h2>
                    <p className="text-black max-w-2xl mx-auto">
                        Comprehensive veterinary care for your beloved companions, from routine check-ups to specialized treatments.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <ServiceCardSkeleton key={i} />
                        ))
                        : services.map((service) => {
                            const Icon = getServiceIcon(service.icon_key)
                            return (
                                <Link
                                    key={service.id}
                                    to={`/services#service-${service.id}`}
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
                                </Link>
                            )
                        })
                    }
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