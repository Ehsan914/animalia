// A status pill. tone: live | wait | off | muted | info | urgent | sale.
export default function Chip({ tone, children }) {
    return <span className={`chip chip--${tone}`}>{children}</span>
}
