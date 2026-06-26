import { HeroSection } from "../components/home/hero-section"
import { ServicesSection } from "../components/home/services-section"
import { VetsSection } from "../components/home/vets-section"
import { EmergencyBanner } from "../components/home/emergency-banner"
import { TestimonialsSection } from "../components/home/testimonials-section"
import ContactSection from "../components/home/contact-section"
import { useSiteData } from "../context/SiteDataContext"
import { SEO, LocalBusinessSchema } from "../components/SEO"
import { seoConfig, getCanonicalUrl, getOgImage, getLocalBusinessSchema } from "../utils/seo"

const HomePage = () => {
    const { services, vets, reviews } = useSiteData()

    return (
        <div className="min-h-screen">
            <SEO
                title={seoConfig.home.title}
                description={seoConfig.home.description}
                keywords={seoConfig.home.keywords}
                canonicalUrl={getCanonicalUrl("")}
                ogImage={getOgImage()}
            />
            <LocalBusinessSchema schema={getLocalBusinessSchema()} />
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
