import { useState, useEffect } from "react"
import useFetch from "../hooks/useFetch"
import { HeroSection } from "../components/home/hero-section"
import { ServicesSection } from "../components/home/services-section"
import { getServices } from '../api/services'
import { getVets } from '../api/vets'
import { VetsSection } from "../components/home/vets-section"
import { EmergencyBanner } from "../components/home/emergency-banner"

const HomePage = () => {
    const { execute: fetchServices, loading: servicesLoading } = useFetch()
    const { execute: fetchVets, loading: vetsLoading } = useFetch()
    const [services, setServices] = useState([])
    const [vets, setVets] = useState([]) 
    
    useEffect(() => {
        fetchServices(getServices).then(data => setServices(data))
    }, [fetchServices])

    useEffect(() => {
        fetchVets(getVets).then(data => setVets(data))
    }, [fetchVets])

    return (
      <div className="min-h-screen">
        <HeroSection/>
        <ServicesSection services={services.slice(0, 6)} loading={servicesLoading} />
        <VetsSection vets={vets} loading={vetsLoading}/>
        <EmergencyBanner />
      </div>
    )
}
export default HomePage