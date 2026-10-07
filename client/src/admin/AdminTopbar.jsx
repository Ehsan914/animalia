import Icon from "../components/ui/Icon"
import LiveDate from "../components/ui/LiveDate"

// The clock bar across the top. Phones get the menu button that opens the sidebar.
export default function AdminTopbar({ menuOpen, onMenu }) {
    return (
        <header className="topbar">
            <button
                className="icon-btn menu-btn"
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="admin-side"
                onClick={onMenu}
            >
                <Icon name="list" />
            </button>
            <p className="clock"><Icon name="clock" /><LiveDate /></p>
            <a className="view-site" href="/" target="_blank" rel="noopener">
                <Icon name="arrow-square-out" /><span>View website</span>
            </a>
        </header>
    )
}
