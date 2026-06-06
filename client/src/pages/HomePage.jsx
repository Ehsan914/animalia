import { useState, useEffect } from "react"
import useFetch from "../hooks/useFetch"
import { HeroSection } from "../components/home/hero-section"
import { ServicesSection } from "../components/home/services-section"
import { getServices } from '../api/services'
import { getVets } from '../api/vets'
import { getReviews } from "../api/misc"
import { VetsSection } from "../components/home/vets-section"
import { EmergencyBanner } from "../components/home/emergency-banner"
import { TestimonialsSection } from "../components/home/testimonials-section"
import ContactSection from "../components/home/contact-section"

const HomePage = () => {
    const { execute: fetchServices, loading: servicesLoading } = useFetch()
    const { execute: fetchVets, loading: vetsLoading } = useFetch()
    const { execute: fetchTestimonials, loading: testimonialsLoading } = useFetch()
    const [services, setServices] = useState([])
    const [vets, setVets] = useState([])
    const [testimonials, setTestimonials] = useState([])
    
    useEffect(() => {
        fetchServices(getServices).then(data => setServices(data))
    }, [fetchServices])

    useEffect(() => {
        fetchVets(getVets).then(data => setVets(data))
    }, [fetchVets])

    useEffect(() => {
        fetchTestimonials(getReviews).then(data => setTestimonials(data))
    }, [fetchTestimonials])

    return (
        <div className="min-h-screen">
            <HeroSection/>
            <ServicesSection services={services.slice(0, 6)} loading={servicesLoading} />
            <VetsSection vets={vets} loading={vetsLoading}/>
            <TestimonialsSection testimonials={testimonials} loading={testimonialsLoading}/>
            <ContactSection />
            <EmergencyBanner />
        </div>
    )
}
export default HomePage