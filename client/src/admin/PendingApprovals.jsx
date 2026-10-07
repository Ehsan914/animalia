import { useRef, useState } from "react"
import Icon from "../components/ui/Icon"
import Chip from "./Chip"

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches

// "Pending Approvals (n)" under the table: one card per waiting record, or a line.
export function PendingBlock({ count, empty, children }) {
    return (
        <section className="block">
            <header className="block-head">
                <h2>Pending Approvals <span className="muted">({count})</span></h2>
            </header>
            {count ? <div className="pending-grid">{children}</div> : <p className="empty-line">{empty}</p>}
        </section>
    )
}

export const Fact = ({ label, wide, children }) => (
    <div className={wide ? "fact--wide" : undefined}>
        <dt>{label}</dt>
        <dd>{children}</dd>
    </div>
)

/**
 * One waiting record. Accept / Reject slide the card out, then onDecide(accepted)
 * saves it (resolving true); if saving fails the card comes back.
 */
export function PendingCard({ when, acceptLabel, onDecide, children }) {
    const ref = useRef(null)
    const [busy, setBusy] = useState(false)

    const decide = async (accepted) => {
        setBusy(true)
        const leave = reducedMotion() ? null : ref.current.animate(
            [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(24px)" }],
            { duration: 220, easing: "ease-in", fill: "forwards" },
        )
        await leave?.finished
        if (await onDecide(accepted)) return
        leave?.cancel()
        setBusy(false)
    }

    return (
        <article className="pending-card" ref={ref}>
            <header><Chip tone="wait">Pending</Chip><span className="muted">{when}</span></header>
            {children}
            <footer>
                <button className="btn btn--sm" type="button" disabled={busy} onClick={() => decide(true)}>
                    <Icon name="check" />{acceptLabel}
                </button>
                <button className="btn btn--sm btn--quiet btn--danger" type="button" disabled={busy} onClick={() => decide(false)}>
                    <Icon name="x" />Reject
                </button>
            </footer>
        </article>
    )
}
