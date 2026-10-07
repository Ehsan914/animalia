import { useCallback, useLayoutEffect, useRef } from "react"
import { gsap, ScrollTrigger, motionAllowed } from "./motion"

// The stamp slams down; the card flinches a pixel at the moment of impact. The
// flinch uses yPercent so it never fights the card's entrance (y, rotation, opacity).
function slam(stamp, card, delay) {
    gsap.killTweensOf(stamp)
    gsap.killTweensOf(card, "yPercent")
    gsap.timeline({ delay })
        .fromTo(stamp, { scale: 1.7, opacity: 0, rotation: -14 },
            { scale: 1, opacity: 0.9, rotation: 0, duration: 0.3, ease: "back.out(2.4)" })
        .fromTo(card, { yPercent: 0 }, { yPercent: 0.4, duration: 0.05, ease: "power1.out", yoyo: true, repeat: 1 }, 0.12)
}

/**
 * Health card motion. On scroll the card drops in like paper and the stamp slams
 * once. When the pet or age changes, `leave(done)` sends the old rows off to the
 * left and calls `done` (swap the rows there); `arrive()` then drops the new rows
 * in and re-slams the stamp. With reduced motion `done` runs at once and nothing moves.
 */
export default function usePlannerMotion({ sectionRef, cardRef, rowsRef, stampRef }) {
    const ctxRef = useRef(null)

    useLayoutEffect(() => {
        const section = sectionRef.current
        const card = cardRef.current
        const stamp = stampRef.current
        if (!section || !motionAllowed()) return

        const ctx = gsap.context(() => {
            const reveal = { trigger: section, start: "top 70%", once: true }
            gsap.from(card, { scrollTrigger: reveal, y: -48, rotation: -5, opacity: 0, duration: 0.9, ease: "back.out(1.3)" })
            gsap.from(".planner-intro > *", { scrollTrigger: reveal, y: 16, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 })
            gsap.set(stamp, { opacity: 0 })
            ScrollTrigger.create({
                trigger: card,
                start: "top 60%",
                once: true,
                onEnter: () => ctx.add(() => slam(stamp, card, 0.55)),
            })
        }, section)
        ctxRef.current = ctx

        return () => {
            ctxRef.current = null
            ctx.revert()
        }
    }, [sectionRef, cardRef, stampRef])

    const leave = useCallback((done) => {
        const ctx = ctxRef.current
        const rows = rowsRef.current?.children
        if (!ctx || !rows?.length) {
            done()
            return
        }
        ctx.add(() => {
            gsap.killTweensOf(rows)
            gsap.to(rows, { x: -22, opacity: 0, duration: 0.16, ease: "power2.in", stagger: 0.025, onComplete: done })
        })
    }, [rowsRef])

    const arrive = useCallback(() => {
        const ctx = ctxRef.current
        if (!ctx) return
        ctx.add(() => {
            gsap.from(rowsRef.current.children, { y: -12, opacity: 0, duration: 0.45, ease: "back.out(1.7)", stagger: 0.05 })
            slam(stampRef.current, cardRef.current, 0.12)
        })
    }, [rowsRef, stampRef, cardRef])

    return { leave, arrive }
}
