// The admin's pages in the production order: sidebar entries and page titles.
// `lists`: the pending lists (sidebar counts) a page loads and reports itself.
export const ADMIN_NAV = [
    { path: "dashboard", label: "Dashboard", icon: "squares-four", lists: ["reviews", "appointments"] },
    { path: "services", label: "Services", icon: "stethoscope" },
    { path: "vets", label: "Vets", icon: "user-circle" },
    { path: "blogs", label: "Blogs", icon: "article" },
    { path: "faqs", label: "FAQs", icon: "question" },
    { path: "reviews", label: "Reviews", icon: "star", count: "reviews", lists: ["reviews"] },
    { path: "clinic-profile", label: "Clinic Profile", icon: "map-pin" },
    { path: "appointments", label: "Appointments", icon: "calendar-blank", count: "appointments", lists: ["appointments"] },
    { path: "banners", label: "Banners", icon: "megaphone" },
    { path: "hero-banners", label: "Hero Banners", icon: "image-square" },
]

// The page at `pathname`; any other admin path redirects to the dashboard.
export const navItemFor = (pathname) =>
    ADMIN_NAV.find((item) => pathname.endsWith(`/${item.path}`)) ?? ADMIN_NAV[0]

export const titleFor = (pathname) => navItemFor(pathname).label
