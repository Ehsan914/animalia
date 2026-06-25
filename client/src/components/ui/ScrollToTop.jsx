import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Resets the window scroll to the top whenever the route (pathname) changes,
 * so navigating to a new page never opens mid-scroll. Skips when the URL has a
 * #hash, letting in-page anchor scrolling (e.g. /services#service-2) win.
 */
export default function ScrollToTop() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (hash) return
        window.scrollTo(0, 0)
    }, [pathname, hash])

    return null
}
