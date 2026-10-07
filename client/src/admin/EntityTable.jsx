import Icon from "../components/ui/Icon"

/**
 * The admin table: one column per field, then Edit / Delete.
 *
 *   columns  [{ label, key?, render?(row), truncate?, align? }]
 *   rows     records; keyOf(row) gives the React key
 *   onEdit?, onDelete?  (row) => void
 */
export default function EntityTable({ columns, rows, keyOf = (row) => row.id, loading, onEdit, onDelete, empty = "No data available" }) {
    const hasActions = Boolean(onEdit || onDelete)
    const cellClass = (col) => [col.align && `t-${col.align}`, col.truncate && "t-clip"].filter(Boolean).join(" ") || undefined

    return (
        <div className="table-wrap">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.label} scope="col" className={col.align ? `t-${col.align}` : undefined}>{col.label}</th>
                        ))}
                        {hasActions && <th scope="col" className="t-center">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td className={`t-empty${loading ? " t-loading" : ""}`} colSpan={columns.length + (hasActions ? 1 : 0)}>
                                {loading ? "Loading…" : empty}
                            </td>
                        </tr>
                    ) : rows.map((row) => (
                        <tr key={keyOf(row)}>
                            {columns.map((col) => {
                                const content = col.render ? col.render(row) : row[col.key]
                                return (
                                    <td key={col.label} className={cellClass(col)} title={col.truncate ? String(content ?? "") : undefined}>
                                        {content}
                                    </td>
                                )
                            })}
                            {hasActions && (
                                <td className="t-actions">
                                    {onEdit && (
                                        <button className="tbtn" type="button" onClick={() => onEdit(row)}>
                                            <Icon name="pencil-simple" />Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button className="tbtn tbtn--danger" type="button" onClick={() => onDelete(row)}>
                                            <Icon name="trash" />Delete
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
