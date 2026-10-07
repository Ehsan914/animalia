import { useRef } from "react"
import HeroBannerWindow from "../banner/HeroBannerWindow"
import ClinicCard from "./ClinicCard"
import HeroIntro from "./HeroIntro"
import VetsScene from "./VetsScene"
import useHeroMotion from "./useHeroMotion"

// Hero → Meet the vets, one pinned stage: the copy and the banner window, then the
// vets photo rising from below until it fills the screen.
export default function HeroSection({ profile, vets, services, heroBanners }) {
    const stageRef = useRef(null)
    useHeroMotion(stageRef)

    return (
        <section className="hero on-navy" id="top" aria-labelledby="hero-title">
            <div className="hero-stage" ref={stageRef}>
                <div className="hero-copy wrap">
                    <HeroIntro profile={profile} />
                    {/* Slides come from the admin's hero banners; without any, the clinic card shows. */}
                    <HeroBannerWindow
                        banners={heroBanners}
                        fallback={<ClinicCard profile={profile} services={services} />}
                    />
                </div>
                <VetsScene vets={vets} />
            </div>
        </section>
    )
}
