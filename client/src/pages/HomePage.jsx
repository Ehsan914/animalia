import { HeroSection } from "../components/home/hero-section"
import { ServicesSection } from "../components/home/services-section"
import { VetsSection } from "../components/home/vets-section"
import { EmergencyBanner } from "../components/home/emergency-banner"
import { TestimonialsSection } from "../components/home/testimonials-section"
import ContactSection from "../components/home/contact-section"
import { useSiteData } from "../context/SiteDataContext"
import { PageSEO, LocalBusinessSchema } from "../components/SEO"

const HomePage = () => {
    const { services, vets, reviews } = useSiteData()

    return (
        <div className="min-h-screen">
            <PageSEO page="home" />
            <LocalBusinessSchema />
            <HeroSection/>
            <ServicesSection services={services.slice(0, 6)} />
            <VetsSection vets={vets} />
            <TestimonialsSection testimonials={reviews} />
            <ContactSection />
            <EmergencyBanner />
        </div>
    )
}
export default HomePage
