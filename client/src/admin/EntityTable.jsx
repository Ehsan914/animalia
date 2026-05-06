/**
 * EntityTable — reusable table component
 *
 * Props:
 *  - columns: Array<{ key: string, label: string, truncate?: boolean, align?: "left"|"center"|"right" }>
 *  - rows:    Array<Record<string, any>>  — each object should have a unique `id` field
 *  - onEdit?:   (row) => void
 *  - onDelete?: (row) => void
 */

import { Pencil, Trash2 } from "lucide-react"
import { twMerge } from "tailwind-merge"

const truncateText = (text, max = 150) =>
    typeof text === "string" && text.length > max
        ? text.slice(0, max) + "…"
        : text

const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
}

const EntityTable = ({ columns = [], rows = [], loading, onEdit, onDelete, className="" }) => {
    const hasActions = onEdit || onDelete

    const base = "w-full border-2 border-mc-primary shadow-mc-sharp-b overflow-hidden"
    return (
        <div className={twMerge(`${base} ${className}`)}>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-mc-grass text-white">
                        {columns.map((col, i) => (
                            <th
                                key={col.key}
                                className={`font-sans text-[13px] tracking-wide px-5 py-3.5 ${
                                    alignClass[col.align ?? "left"]
                                } ${i < columns.length - 1 || hasActions ? "border-r-2 border-white/20" : ""}`}
                            >
                                {col.label}
                            </th>
                        ))}
                        {hasActions && (
                            <th className="font-sans text-[13px] tracking-wide text-center px-5 py-3.5">
                                ACTION
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (hasActions ? 1 : 0)}
                                className="font-sans text-[14px] text-center text-black/40 py-16 border-t-2 border-black/10"
                            >
                                {loading ? 'Loading...' : 'No data available'}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, index) => (
                            <tr
                                key={row.id ?? index}
                                className={`border-t-2 border-black/10 hover:bg-black/3 transition-colors ${
                                    index % 2 === 0 ? "bg-white" : "bg-black/2"
                                }`}
                            >
                                {columns.map((col, i) => (
                                    <td
                                        key={col.key}
                                        title={col.truncate ? String(row[col.key] ?? "") : undefined}
                                        className={`font-sans text-[14px] px-5 py-4 ${
                                            alignClass[col.align ?? "left"]
                                        } ${i < columns.length - 1 || hasActions ? "border-r-2 border-black/10" : ""}`}
                                    >
                                        {col.truncate
                                            ? truncateText(row[col.key])
                                            : col.render 
                                            ? col.render(row)
                                            : row[col.key]}
                                    </td>
                                ))}
                                {hasActions && (
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="flex items-center gap-1.5 font-pixel-alt text-[16px] px-3 py-1.5 border-2 border-mc-primary bg-white hover:bg-mc-grass hover:text-white transition-colors shadow-mc-flat-b cursor-pointer"
                                                >
                                                    <Pencil size={12} />
                                                    Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(row)}
                                                    className="flex items-center gap-1.5 font-pixel-alt text-[16px] px-3 py-1.5 border-2 border-mc-heart bg-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-mc-flat-b  cursor-pointer"
                                                >
                                                    <Trash2 size={12} />
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default EntityTable