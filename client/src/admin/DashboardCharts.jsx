import Icon from "../components/ui/Icon"

// Dashboard charts drawn as plain HTML and SVG, without a chart library. The
// numbers are real text for screen readers; the drawn shapes are aria-hidden.

export function ChartCard({ wide, title, sub, children }) {
    return (
        <section className={`chart-card${wide ? " chart-card--wide" : ""}`}>
            <header><h2>{title}</h2><p>{sub}</p></header>
            {children}
        </section>
    )
}

/**
 * Stacked columns, one per day. days: [{ day, label, sub, long, isToday, parts }],
 * series: [{ key, label, color }] from the bottom of the stack up.
 */
export function ColumnsChart({ days, series, unit }) {
    const totals = days.map((d) => series.reduce((sum, s) => sum + (d.parts[s.key] || 0), 0))
    const top = Math.max(2, Math.ceil(Math.max(...totals) / 2) * 2)

    return (
        <div className="cols-chart">
            <div className="cols-axis" aria-hidden="true"><span>{top}</span><span>{top / 2}</span><span>0</span></div>
            <ol className="cols">
                {days.map((d, i) => {
                    const said = series
                        .filter((s) => d.parts[s.key])
                        .map((s) => `${d.parts[s.key]} ${s.label.toLowerCase()}`)
                        .join(", ")
                    return (
                        <li key={d.day} className={d.isToday ? "is-today" : undefined} style={{ "--i": i }}>
                            <span className="sr-only">{d.long}: {totals[i]} {unit}{said ? ` (${said})` : ""}</span>
                            <span className="col-stack" aria-hidden="true">
                                {series.map((s) => (d.parts[s.key] ? (
                                    <span
                                        key={s.key}
                                        className="col-seg"
                                        style={{ height: `${(d.parts[s.key] / top) * 100}%`, "--c": s.color }}
                                    />
                                ) : null))}
                                {totals[i] > 0 && <span className="col-n">{totals[i]}</span>}
                            </span>
                            <span className="col-label" aria-hidden="true"><b>{d.label}</b>{d.sub}</span>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

// Donut: a ring of parts with the total in the middle. parts: [{ key, label, value, color }].
export function DonutChart({ parts, unit }) {
    const total = parts.reduce((sum, p) => sum + p.value, 0)
    const shown = parts.filter((p) => p.value)
    const gap = shown.length > 1 ? 0.8 : 0
    const pctOf = (v) => (total ? Math.round((v / total) * 100) : 0)
    // Each ring starts where the last one ended, from 12 o'clock.
    const rings = shown.map((p, i) => {
        const pct = (p.value / total) * 100
        const before = shown.slice(0, i).reduce((sum, x) => sum + (x.value / total) * 100, 0)
        return { ...p, pct, offset: 25 - before }
    })

    return (
        <div className="donut">
            <div className="donut-ring">
                <svg viewBox="0 0 42 42" aria-hidden="true">
                    <circle className="donut-track" r="15.915" cx="21" cy="21" />
                    {rings.map((r, i) => (
                        <circle
                            key={r.key}
                            r="15.915"
                            cx="21"
                            cy="21"
                            pathLength="100"
                            stroke={r.color}
                            strokeDasharray={`${r.pct - gap} ${100 - r.pct + gap}`}
                            strokeDashoffset={r.offset}
                            style={{ "--i": i }}
                        />
                    ))}
                </svg>
                <p><b>{total}</b><span>{unit}</span></p>
            </div>
            <ul className="legend">
                {parts.map((p) => (
                    <li key={p.key}>
                        <span className="key" style={{ "--c": p.color }} aria-hidden="true" />
                        {p.label}<b>{p.value}</b><span className="muted">{pctOf(p.value)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// Horizontal bars. rows: [{ key, label (text or node), value }].
export function BarsChart({ rows, color }) {
    const max = Math.max(1, ...rows.map((r) => r.value))
    return (
        <ul className="hbars" style={{ "--c": color }}>
            {rows.map((r, i) => (
                <li key={r.key ?? r.label} style={{ "--i": i }}>
                    <span className="hbar-label">{r.label}</span>
                    <span className="hbar-track" aria-hidden="true">
                        <span className="hbar-fill" style={{ width: `${(r.value / max) * 100}%` }} />
                    </span>
                    <b className="hbar-n">{r.value}</b>
                </li>
            ))}
        </ul>
    )
}

// "5 ★" for the ratings chart, read out as "5 stars".
export const StarsLabel = ({ stars }) => (
    <>{stars} <Icon name="star" /><span className="sr-only"> star{stars > 1 ? "s" : ""}</span></>
)
