import { NavLink } from "react-router-dom"
import Icon from "../components/ui/Icon"
import useAuth from "../hooks/useAuth"
import { ADMIN_NAV } from "./adminNav"
import { usePendingCounts } from "./pendingCounts"

// The navy sidebar in the production order, with what is waiting beside Reviews
// and Appointments, and Sign out at the bottom. Phones slide it in from the menu.
export default function AdminSidebar({ onNavigate }) {
    const { logout } = useAuth()
    const counts = usePendingCounts()

    return (
        <aside className="side on-navy" id="admin-side" aria-label="Admin">
            <div className="side-head">
                <img src="/logo.svg" alt="" width="140" height="40" />
                {/* Spaced to end exactly under the logo's paw, whatever the font measures. */}
                <svg className="side-label" viewBox="0 0 140 12" width="140" height="12">
                    <text x="0" y="10" textLength="140" lengthAdjust="spacing">ADMIN PANEL</text>
                </svg>
            </div>
            <nav className="side-nav">
                {ADMIN_NAV.map((item) => {
                    const waiting = item.count ? counts[item.count] : 0
                    return (
                        <NavLink key={item.path} to={`/admin/${item.path}`} onClick={onNavigate}>
                            <Icon name={item.icon} />
                            {item.label}
                            {waiting > 0 && <span className="count" aria-label={`${waiting} pending`}>{waiting}</span>}
                        </NavLink>
                    )
                })}
            </nav>
            <button className="btn btn--paper side-out" type="button" onClick={logout}>
                <Icon name="sign-out" />Sign out
            </button>
        </aside>
    )
}
