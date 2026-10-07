import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

// The home page moves unless the visitor asked for reduced motion. The build-time
// prerenderer (scripts/prerender.js) gets the static page, so the snapshot never
// holds a half-played entrance.
export const motionAllowed = () =>
    typeof window !== "undefined" &&
    window.__PRERENDER__ !== true &&
    !window.matchMedia(REDUCED_MOTION).matches

export const navHeight = () => document.querySelector(".nav")?.offsetHeight ?? 0
