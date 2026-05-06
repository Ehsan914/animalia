import { useState, useRef, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"

/**
 * ServiceCheckboxes — multi-select for services (no add/delete, selection only)
 *
 * Props:
 *  - options:     Array<{ value: number, label: string, price?: number }>
 *  - selectedIds: Array<number>
 *  - onChange:    (updatedIds: number[]) => void
 */
const ServiceCheckboxes = ({ options = [], selectedIds = [], onChange }) => {
    const [open, setOpen] = useState(false)
    const containerRef = useRef(null)

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target))
                setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const toggle = (id) => {
        const updated = selectedIds.includes(id)
            ? selectedIds.filter((s) => s !== id)
            : [...selectedIds, id]
        onChange(updated)
    }

    const toggleAll = () => {
        const allIds = options.map((o) => o.value)
        const allSelected = allIds.every((id) => selectedIds.includes(id))
        onChange(allSelected ? [] : allIds)
    }

    const allSelected = options.length > 0 && options.every((o) => selectedIds.includes(o.value))

    return (
        <div ref={containerRef} className="flex flex-col gap-2">

            {/* Selected chips */}
            {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedIds.map((id) => {
                        const opt = options.find((o) => o.value === id)
                        if (!opt) return null
                        return (
                            <span
                                key={id}
                                className="flex items-center gap-1 bg-mc-primary text-white text-xs font-sans font-medium px-2 py-1"
                            >
                                {opt.label}
                                <button
                                    type="button"
                                    onClick={() => toggle(id)}
                                    className="hover:opacity-70 transition-opacity cursor-pointer"
                                    aria-label={`Remove ${opt.label}`}
                                >
                                    <X size={11} />
                                </button>
                            </span>
                        )
                    })}
                </div>
            )}

            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center justify-between border-4 border-mc-primary bg-white px-3 py-2.5 text-sm font-sans font-medium hover:bg-black/3 transition-colors"
            >
                <span className={selectedIds.length === 0 ? "text-black/40" : "text-black"}>
                    {selectedIds.length === 0
                        ? "Select services..."
                        : `${selectedIds.length} service${selectedIds.length > 1 ? "s" : ""} selected`}
                </span>
                <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${open ? "rotate-180 text-black" : "text-gray-400"}`}
                />
            </button>

            {/* Dropdown list */}
            {open && (
                <div className="border-4 border-mc-primary max-h-48 overflow-y-auto">
                    {/* Select All */}
                    <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-black/5 border-b-2 border-mc-primary/20">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            className="w-4 h-4 accent-mc-primary cursor-pointer"
                        />
                        <span className="text-sm font-sans font-medium text-black">Select All</span>
                    </label>

                    {/* Options */}
                    {options
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map((opt) => {
                            const checked = selectedIds.includes(opt.value)
                            return (
                                <label
                                    key={opt.value}
                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b-2 border-mc-primary/20 last:border-b-0
                                        ${checked ? "bg-mc-primary/10" : "hover:bg-black/5"}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggle(opt.value)}
                                        className="w-4 h-4 accent-mc-primary cursor-pointer"
                                    />
                                    <span className="flex-1 text-sm font-sans font-medium text-black">
                                        {opt.label}
                                    </span>
                                    {opt.price != null && (
                                        <span className="text-xs font-sans font-semibold text-black/40 tabular-nums">
                                            ${opt.price}
                                        </span>
                                    )}
                                </label>
                            )
                        })}

                    {options.length === 0 && (
                        <p className="px-4 py-3 text-sm font-sans text-black/40">
                            No services available.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default ServiceCheckboxes