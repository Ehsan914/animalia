import { useEffect } from "react"
import HeroSection from "../components/home/HeroSection"
import ServicesSheet from "../components/home/ServicesSheet"
import CarePlanner from "../components/home/CarePlanner"
import ReviewsSection from "../components/home/ReviewsSection"
import EmergencySection from "../components/home/EmergencySection"
import VisitSection from "../components/home/VisitSection"
import useSmoothScroll from "../components/home/useSmoothScroll"
import { ScrollTrigger } from "../components/home/motion"
import { useSiteData } from "../context/SiteDataContext"
import { PageSEO, LocalBusinessSchema } from "../components/SEO"
import "../styles/home.css"

const HomePage = () => {
    const { services, vets, reviews, heroBanners, clinicProfile } = useSiteData()
    useSmoothScroll()

    // Every section's triggers exist by now (children set up first); measure again
    // once the web fonts have settled the line heights, and when the announcement
    // bar at the top of the page is dismissed (everything below moves up).
    useEffect(() => {
        let live = true
        const refresh = () => { if (live) ScrollTrigger.refresh() }
        document.fonts?.ready.then(refresh)
        const root = document.getElementById("root")
        const observer = new MutationObserver(refresh)
        if (root) observer.observe(root, { childList: true })
        return () => {
            live = false
            observer.disconnect()
        }
    }, [])

    return (
        <>
            <PageSEO page="home" />
            <LocalBusinessSchema />
            <HeroSection profile={clinicProfile} vets={vets} services={services} heroBanners={heroBanners} />
            <ServicesSheet services={services} />
            <CarePlanner services={services} />
            <ReviewsSection reviews={reviews} />
            {clinicProfile && <EmergencySection profile={clinicProfile} />}
            {clinicProfile && <VisitSection profile={clinicProfile} />}
        </>
    )
}
export default HomePage
