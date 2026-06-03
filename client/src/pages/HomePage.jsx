import { useState, useEffect } from "react"
import useFetch from "../hooks/useFetch"
import { HeroSection } from "../components/home/hero-section"
import { ServicesSection } from "../components/home/services-section"
import { getServices } from '../api/services'


const HomePage = () => {
    const { execute, loading } = useFetch()
    const [services, setServices] = useState([])
    
    useEffect(() => {
        execute(getServices).then(data => setServices(data))
    }, [execute])
    return (
      <div className="min-h-screen">
        <HeroSection/>
        <ServicesSection services={services.slice(0, 6)} loading={loading} />
      </div>
    )
}
export default HomePage