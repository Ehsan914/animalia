// Every public page: its path, SEO copy and sitemap settings. The router
// (src/public/PublicApp.jsx), the prerenderer (scripts/prerender.js) and the
// sitemap (scripts/sitemap.js) all read this list, so a page is added once.
// Plain data only — the build scripts import it under Node.
export const PUBLIC_ROUTES = [
    {
        page: "home",
        path: "/",
        changefreq: "weekly",
        priority: "1.0",
        title: "Animalia Vet Care - Professional Veterinary Services",
        description: "Expert veterinary care for your pets. Experienced vets, comprehensive services, and 24/7 emergency support at Animalia Vet Care.",
        keywords: "veterinary clinic, pet care, vet services, animal hospital, pet health",
    },
    {
        page: "services",
        path: "/services",
        changefreq: "monthly",
        priority: "0.9",
        title: "Our Services - Animalia Vet Care",
        description: "Comprehensive veterinary services including health check-ups, vaccinations, surgeries, deworming, grooming, pet medicines, and advanced diagnostics for dogs, cats, and small animals.",
        keywords: "vet services, pet check-up, vaccinations, surgery, grooming, deworming, pet care, animal hospital",
    },
    {
        page: "vets",
        path: "/vets",
        changefreq: "monthly",
        priority: "0.8",
        title: "Our Veterinarians - Animalia Vet Care",
        description: "Meet our team of experienced and qualified veterinarians dedicated to your pet's health.",
        keywords: "veterinarians, pet doctors, vet team",
    },
    {
        page: "about",
        path: "/about",
        changefreq: "monthly",
        priority: "0.7",
        title: "About Us - Animalia Vet Care",
        description: "Learn about Animalia Vet Care, founded in 2024 by Dr. Md. Easin. We've treated 900+ pets with compassion and expertise. Meet our team of experienced veterinarians dedicated to your pet's health.",
        keywords: "about veterinary clinic, our story, Dr. Md. Easin, pet care mission, trusted vet team",
    },
    {
        page: "blog",
        path: "/blogs",
        changefreq: "weekly",
        priority: "0.7",
        title: "Pet Health Blog - Animalia Vet Care",
        description: "Read expert articles about pet health, care tips, and wellness advice from our veterinarians.",
        keywords: "pet health, veterinary blog, pet care tips, animal wellness",
    },
    {
        page: "contact",
        path: "/contact",
        changefreq: "monthly",
        priority: "0.6",
        title: "Contact Us - Animalia Vet Care",
        description: "Get in touch with us. Visit our clinic or call for emergency veterinary services.",
        keywords: "contact us, vet clinic, emergency vet",
    },
    {
        page: "appointment",
        path: "/appointment",
        changefreq: "monthly",
        priority: "0.8",
        title: "Book an Appointment - Animalia Vet Care",
        description: "Schedule a consultation with our veterinarians. Easy online booking available.",
        keywords: "book appointment, vet consultation, schedule visit",
    },
    // Dynamic: not prerendered and not listed in the sitemap.
    { page: "blogPost", path: "/blogs/:slug", isStatic: false },
]

// Pages with a fixed URL: prerendered at build time and listed in the sitemap.
export const STATIC_ROUTES = PUBLIC_ROUTES.filter((route) => route.isStatic !== false)

export const routeFor = (page) => {
    const route = PUBLIC_ROUTES.find((r) => r.page === page)
    if (!route) throw new Error(`Unknown public page "${page}"`)
    return route
}
