import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Scrolls to the element named by the URL #hash (e.g. /services#vaccinations)
// on load and on in-app hash links. ScrollToTop leaves hashed URLs alone.
// Returns the target id, so the page can mark the row: in-app navigation
// changes the hash without updating CSS :target.
export default function useHashScroll() {
    const { hash } = useLocation()
    const id = decodeURIComponent(hash.slice(1))

    useEffect(() => {
        if (!id) return
        const el = document.getElementById(id)
        if (!el) return
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        // A beat for fonts and the announcement bar to settle before measuring.
        const timer = setTimeout(() => el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" }), 100)
        return () => clearTimeout(timer)
    }, [id])

    return id
}
