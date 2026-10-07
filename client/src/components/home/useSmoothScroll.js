import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger, motionAllowed } from "./motion"

// GSAP's default lag smoothing, restored when the home page unmounts.
const LAG_THRESHOLD = 500
const LAG_ADJUSTED = 33

// Smooth scroll for the landing page only, driven by GSAP's ticker so it stays in
// step with ScrollTrigger. Destroyed on unmount so other routes scroll natively.
export default function useSmoothScroll() {
    useEffect(() => {
        if (!motionAllowed()) return

        const lenis = new Lenis({ lerp: 0.12 })
        const raf = (time) => lenis.raf(time * 1000)
        lenis.on("scroll", ScrollTrigger.update)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(raf)
            gsap.ticker.lagSmoothing(LAG_THRESHOLD, LAG_ADJUSTED)
            lenis.destroy()
        }
    }, [])
}
