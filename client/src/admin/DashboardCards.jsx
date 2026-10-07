import { Link } from "react-router-dom"
import Icon from "../components/ui/Icon"

// One stat card: a count, a link to its page, and (reviews, appointments) what came
// in this month and what is waiting for approval.
export default function DashboardCards({ name, icon, amount, to, loading, thisMonth, pendingCount, pendingLabel }) {
    return (
        <article className="stat">
            <header>
                <h2><Icon name={icon} />{name}</h2>
                <Link className="stat-go" to={to} aria-label={`Open ${name.toLowerCase()}`}><Icon name="arrow-right" /></Link>
            </header>
            <p className="stat-n">{loading ? "—" : amount}</p>
            <footer>
                {thisMonth !== undefined && !loading && (
                    <p className="stat-up"><Icon name="arrow-up" />+{thisMonth} this month</p>
                )}
                {pendingCount > 0 && (
                    <p className="stat-wait"><Icon name="clock" />{pendingCount} {pendingLabel} for approval</p>
                )}
            </footer>
        </article>
    )
}
