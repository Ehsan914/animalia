import { useEffect } from "react"

// Each [data-reveal] block on the page settles in once as it scrolls into view
// (pages.css owns the motion and skips it under prefers-reduced-motion).
// Pass a key that changes when new [data-reveal] blocks are rendered.
export default function useReveal(key) {
    useEffect(() => {
        const items = document.querySelectorAll("[data-reveal]:not(.is-in)")
        if (!("IntersectionObserver" in window)) {
            items.forEach((el) => el.classList.add("is-in"))
            return
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return
                entry.target.classList.add("is-in")
                io.unobserve(entry.target)
            })
        }, { rootMargin: "0px 0px -8% 0px" })
        items.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [key])
}
