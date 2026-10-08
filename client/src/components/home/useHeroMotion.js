import { useLayoutEffect } from "react"
import { gsap, ScrollTrigger, REDUCED_MOTION, motionAllowed, navHeight } from "./motion"

const CAPTION_MIN = 420 // px of navy kept beside the photo for the caption
const CAPTION_MAX = 440
const PIN_DESK = 1.4 // pinned for this many screens of scroll
const PHOTO_DUR = 0.7 // timeline time the photo spends rising
const SCRUB_MOB = 0.6 // seconds the phone animation takes to catch up with the finger
// Phones finish the transition on their own once a swipe stops inside it: on to the
// vets scene going down, back to the hero going up.
const SNAP_MOB = {
    snapTo: [0, 1],
    directional: true,
    inertia: false,
    delay: 0.05,
    duration: { min: 0.5, max: 0.9 },
    ease: "power2.inOut",
}

// First entrance: the headline lines rise from their masks, then the row, the
// banner window and the photo.
function entrance() {
    gsap.timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-title .line > span", { yPercent: 110, duration: 0.9, stagger: 0.08 })
        .from(".hero-main > :not(.hero-title)", { y: 14, opacity: 0, duration: 0.6, stagger: 0.06 }, 0.16)
        .from(".hero-window, .hero-emergency", { y: 28, opacity: 0, duration: 0.9 }, 0.22)
        .from(".vets-photo img", { opacity: 0, yPercent: 4, duration: 0.9 }, 0.26)
}

// Where the photo starts and ends, for the screen as it is now. Desktop keeps the
// whole photo in frame beside the caption, which starts at the logo; phones run
// the photo full width with the caption under it.
function measure(stage, desk) {
    const copy = stage.querySelector(".hero-copy")
    const caption = stage.querySelector(".stage-caption")
    const img = stage.querySelector(".vets-photo img")
    // Width / height of whichever photo the browser picked (portrait on phones, wide on desktop).
    const ratio = (img.naturalWidth / img.naturalHeight) || (img.width / img.height)
    const areaW = stage.clientWidth
    const areaH = stage.clientHeight - navHeight()
    const geo = {}

    if (desk) {
        const edge = document.querySelector(".nav-logo")?.getBoundingClientRect().left ?? 0
        const inner = areaW - 2 * edge
        geo.w = Math.min(areaH * ratio, inner - CAPTION_MIN)
        geo.h = geo.w / ratio
        geo.endX = areaW / 2 - edge - geo.w / 2
        geo.endY = (areaH - geo.h) / 2
        geo.s0 = Math.min(0.8, (areaW * 0.76) / geo.w)
        stage.style.setProperty("--cap-left", `${edge}px`)
        stage.style.setProperty("--cap-w", `${Math.min(CAPTION_MAX, inner - geo.w - 48)}px`)
    } else {
        geo.w = areaW
        geo.h = geo.w / ratio
        geo.endX = 0
        geo.endY = 0
        geo.s0 = 0.86
    }
    geo.startY = copy.offsetTop + copy.offsetHeight - navHeight()
    stage.style.setProperty("--pw", `${geo.w}px`)
    stage.style.setProperty("--ph", `${geo.h}px`)
    if (!desk) stage.style.setProperty("--stage-h", `${navHeight() + geo.h + caption.offsetHeight}px`)
    return geo
}

// Hero depth: the stage pins, the vets photo rises over the copy (which fades out)
// and grows into the "Meet the vets" scene, then the caption and name tags arrive.
function pinStage(stage, desk) {
    stage.classList.add("is-pinned")
    const photo = stage.querySelector(".vets-photo")
    let geo = measure(stage, desk)
    const remeasure = () => { geo = measure(stage, desk) }
    ScrollTrigger.addEventListener("refreshInit", remeasure)

    const tl = gsap.timeline()
        .fromTo(photo,
            { x: 0, y: () => geo.startY, scale: () => geo.s0, borderRadius: () => 28 / geo.s0 },
            { x: () => geo.endX, y: () => geo.endY, scale: 1, borderRadius: () => (desk ? 22 : 0), ease: desk ? "power1.inOut" : "none", duration: PHOTO_DUR }, 0)
        .to(".hero-title", { scale: 0.88, opacity: 0, ease: "none", duration: 0.6 }, 0)
        // The copy the photo rises over leaves completely, before the photo passes it.
        .to(".hero-main > :not(.hero-title), .hero-window, .hero-emergency", { opacity: 0, ease: "none", duration: 0.24 }, 0.1)
        .fromTo("[data-reveal-late]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.1, stagger: 0.04, ease: "power2.out" }, 0.74)
        .to({}, { duration: 0.1 })

    // Phones: the photo rises the full height of the copy, so the pin lasts just long
    // enough for it to move at the finger's own speed, never racing ahead of it.
    ScrollTrigger.create({
        animation: tl,
        trigger: stage,
        start: "top top",
        end: () => `+=${desk ? window.innerHeight * PIN_DESK : (geo.startY * tl.duration()) / PHOTO_DUR}`,
        pin: true,
        scrub: desk ? true : SCRUB_MOB,
        snap: desk ? undefined : SNAP_MOB,
        anticipatePin: desk ? 0 : 1,
        invalidateOnRefresh: true,
    })

    return () => {
        ScrollTrigger.removeEventListener("refreshInit", remeasure)
        stage.classList.remove("is-pinned")
        ;["--cap-left", "--cap-w", "--stage-h", "--pw", "--ph"].forEach((p) => stage.style.removeProperty(p))
    }
}

// All hero motion, reverted on unmount. Reduced motion (or the prerender) keeps
// the static flow: copy, then the photo, then the caption.
export default function useHeroMotion(stageRef) {
    useLayoutEffect(() => {
        const stage = stageRef.current
        if (!stage || !motionAllowed()) return

        const ctx = gsap.context(entrance, stage)
        const mm = gsap.matchMedia(stage)
        mm.add(
            { desk: "(min-width: 900px)", mob: "(max-width: 899px)", reduce: REDUCED_MOTION },
            ({ conditions }) => (conditions.reduce ? undefined : pinStage(stage, conditions.desk)),
        )

        // The photo's real ratio is known once it loads (and again when the picture swaps source).
        const img = stage.querySelector(".vets-photo img")
        const refresh = () => ScrollTrigger.refresh()
        img.addEventListener("load", refresh)

        return () => {
            img.removeEventListener("load", refresh)
            mm.revert()
            ctx.revert()
        }
    }, [stageRef])
}
