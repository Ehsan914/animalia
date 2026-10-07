import { createContext, useContext, useEffect, useRef, useState } from "react"
import { services, vets, reviews, faqs, blogs, banners, heroBanners, clinicProfile } from "../api/resources"
import PageLoader from "../components/ui/PageLoader"

const SiteDataContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useSiteData = () => {
    const ctx = useContext(SiteDataContext)
    if (!ctx) throw new Error("useSiteData must be used within a SiteDataProvider")
    return ctx
}

// The clinic's contact details, address and hours, or null if they could not
// be loaded.
// eslint-disable-next-line react-refresh/only-export-components
export const useClinicProfile = () => useSiteData().clinicProfile

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

export const SiteDataProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        services: [],
        vets: [],
        reviews: [],
        faqs: { en: [], bn: [] },
        blogs: { en: [], bn: [] },
        banner: null,
        heroBanners: [],
        clinicProfile: null,
    })
    const hasFetched = useRef(false)

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true

        const loadEverything = async () => {
            // All requests fire at once, so the total wait is the slowest single
            // request — not the sum of them.
            const [serviceList, vetList, reviewList, faqsEn, faqsBn, blogsEn, blogsBn, banner, heroBannerList, profile] =
                await Promise.allSettled([
                    services.list(),
                    vets.list(),
                    reviews.list(),
                    faqs.list({ lang: "en" }),
                    faqs.list({ lang: "bn" }),
                    blogs.list({ lang: "en" }),
                    blogs.list({ lang: "bn" }),
                    banners.list(),
                    heroBanners.list(),
                    clinicProfile.get(),
                ])

            setData({
                services: settle(serviceList, "services"),
                vets: settle(vetList, "vets"),
                reviews: settle(reviewList, "reviews"),
                faqs: {
                    en: settle(faqsEn, "FAQs (en)"),
                    bn: settle(faqsBn, "FAQs (bn)"),
                },
                blogs: {
                    en: settle(blogsEn, "blogs (en)"),
                    bn: settle(blogsBn, "blogs (bn)"),
                },
                banner: settle(banner, "banner", null),
                heroBanners: settle(heroBannerList, "hero banners"),
                clinicProfile: settle(profile, "clinic profile", null),
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

    // Blocking loader: render ONLY the loader while the single global prefetch
    // is in flight, then reveal everything at once. The prerenderer (a real
    // headless browser) runs this lifecycle to completion and snapshots after
    // data-app-ready fires, so the static HTML still gets full content + meta.
    if (loading) return <PageLoader />

    return (
        <SiteDataContext.Provider value={data}>
            {children}
        </SiteDataContext.Provider>
    )
}
