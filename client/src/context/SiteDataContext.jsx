import { createContext, useContext, useEffect, useRef, useState } from "react"
import { getServices } from "../api/services"
import { getVets } from "../api/vets"
import { getReviews, getFAQs } from "../api/misc"
import { getBlogs } from "../api/blogs"
import { getActiveBanner } from "../api/banners"
import PageLoader from "../components/ui/PageLoader"

const SiteDataContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useSiteData = () => {
    const ctx = useContext(SiteDataContext)
    if (!ctx) throw new Error("useSiteData must be used within a SiteDataProvider")
    return ctx
}

// Pulls a settled promise's value, logging (and emptying) any failure so one
// bad request can never hang the whole site behind the loader.
const settle = (res, label, fallback = []) => {
    if (res.status !== "fulfilled") {
        console.error(`Failed to load ${label}:`, res.reason)
        return fallback
    }
    // Guard against non-JSON responses (e.g. an SPA HTML fallback returned with
    // a 200 when the API URL is misconfigured/unreachable) poisoning the UI:
    // if we expected an array, insist on an array, otherwise fall back.
    if (Array.isArray(fallback) && !Array.isArray(res.value)) {
        console.error(`Ignoring unexpected (non-array) response for ${label}`)
        return fallback
    }
    return res.value
}

const sortByOrder = (arr) => [...arr].sort((a, b) => a.order - b.order)

export const SiteDataProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        services: [],
        vets: [],
        reviews: [],
        faqs: { en: [], bn: [] },
        blogs: { en: [], bn: [] },
        banner: null,
    })
    const hasFetched = useRef(false)

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true

        const loadEverything = async () => {
            // All requests fire at once, so the total wait is the slowest single
            // request — not the sum of them.
            const [services, vets, reviews, faqsEn, faqsBn, blogsEn, blogsBn, banner] =
                await Promise.allSettled([
                    getServices(),
                    getVets(),
                    getReviews(),
                    getFAQs("en"),
                    getFAQs("bn"),
                    getBlogs("en"),
                    getBlogs("bn"),
                    getActiveBanner(),
                ])

            setData({
                services: settle(services, "services"),
                vets: settle(vets, "vets"),
                reviews: settle(reviews, "reviews"),
                faqs: {
                    en: sortByOrder(settle(faqsEn, "FAQs (en)")),
                    bn: sortByOrder(settle(faqsBn, "FAQs (bn)")),
                },
                blogs: {
                    en: settle(blogsEn, "blogs (en)"),
                    bn: settle(blogsBn, "blogs (bn)"),
                },
                banner: settle(banner, "banner", null),
            })
            setLoading(false)
        }

        loadEverything()
    }, [])

    // Signal for the build-time prerenderer (scripts/prerender.js): once the
    // global prefetch settles and content has painted, mark the document ready
    // so the snapshot is taken with real content instead of the loader.
    useEffect(() => {
        if (!loading && typeof document !== "undefined") {
            document.documentElement.setAttribute("data-app-ready", "true")
        }
    }, [loading])

    return (
        <SiteDataContext.Provider value={data}>
            {/* Children stay mounted (even while loading) so their content and
                meta tags exist in the DOM for prerendering and first paint. The
                full-screen loader overlays the empty state while the single
                global prefetch is in flight — same UX as before, just layered
                instead of replacing the tree. */}
            {loading && <PageLoader />}
            {children}
        </SiteDataContext.Provider>
    )
}
