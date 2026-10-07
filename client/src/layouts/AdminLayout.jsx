import { useCallback, useEffect, useMemo, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import AdminSidebar from "../admin/AdminSidebar"
import AdminTopbar from "../admin/AdminTopbar"
import { navItemFor, titleFor } from "../admin/adminNav"
import { PendingContext, countPending } from "../admin/pendingCounts"
import { appointments, reviews } from "../api/resources"

// The signed-in admin: navy sidebar, clock bar, and the page column beside them.
// It also holds the sidebar's pending counts, kept current by the Reviews,
// Appointments and Dashboard pages as their lists change. On entry it loads only
// the lists the opening page doesn't load itself, so none is fetched twice.
export default function AdminLayout() {
    const { pathname } = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [counts, setCounts] = useState({})
    const [listedByPage] = useState(() => navItemFor(pathname).lists ?? [])

    const report = useCallback((kind, n) => {
        setCounts((current) => (current[kind] === n ? current : { ...current, [kind]: n }))
    }, [])

    useEffect(() => {
        Object.entries({ reviews, appointments }).forEach(([kind, resource]) => {
            if (listedByPage.includes(kind)) return
            resource.adminList()
                // A page that has already reported holds the fresher number.
                .then((rows) => setCounts((current) => (kind in current ? current : { ...current, [kind]: countPending(rows) })))
                // The page that lists them reports a failed load; the count just stays empty.
                .catch(() => {})
        })
    }, [listedByPage])

    useEffect(() => {
        if (!menuOpen) return
        const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false) }
        document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [menuOpen])

    const pending = useMemo(() => ({ counts, report }), [counts, report])
    const close = () => setMenuOpen(false)

    return (
        <PendingContext.Provider value={pending}>
            <Helmet>
                <title>{`${titleFor(pathname)} · Admin · Animalia Vet Care`}</title>
            </Helmet>
            <div className={`shell${menuOpen ? " is-menu-open" : ""}`}>
                <AdminSidebar onNavigate={close} />
                <div className="side-scrim" hidden={!menuOpen} onClick={close} />
                <div className="main">
                    <AdminTopbar menuOpen={menuOpen} onMenu={() => setMenuOpen((open) => !open)} />
                    <main className="page" id="admin-view" tabIndex={-1}>
                        <div className="view-inner" key={pathname}>
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </PendingContext.Provider>
    )
}
